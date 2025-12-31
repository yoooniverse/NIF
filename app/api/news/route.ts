import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Supabase interests 테이블의 UUID → slug 매핑
const INTEREST_UUID_TO_SLUG: Record<string, string> = {
  '5cbe5b84-2555-4b09-8b7d-a7ea1cde2a5e': 'real-estate',
  'cc5eb1d7-2fcd-4767-b2c5-5b4ae10af787': 'etf',
  '89f6d7da-e48c-4251-a50a-38819f252a2e': 'crypto',
  'ac07734f-bbf9-42fa-b2fa-4de04c5c072d': 'stock',
  '3c4b8119-67a5-41ab-9459-0582066b8934': 'exchange-rate'
};

const SLUG_TO_KOREAN: Record<string, string> = {
  'stock': '주식',
  'crypto': '가상화폐',
  'real-estate': '부동산',
  'etf': 'ETF',
  'exchange-rate': '환율'
};

export async function GET(req: NextRequest) {
  try {
    console.log("[API][NEWS_TODAY] Request started");
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const categoryParam = url.searchParams.get("category");
    const limitParam = url.searchParams.get("limit");
    const limit = Math.min(parseInt(limitParam || "20"), 50);

    // 최근 3일 날짜 범위 (한국 시간과 UTC 차이 고려)
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    const startOfDay = new Date(threeDaysAgo.getFullYear(), threeDaysAgo.getMonth(), threeDaysAgo.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    console.log("[API][NEWS_TODAY] Query params:", {
      userId,
      category: categoryParam || 'all',
      limit,
      dateRange: `${startOfDay.toISOString()} ~ ${endOfDay.toISOString()}`
    });

    // 1. 사용자 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('level, onboarded_at')
      .eq('clerk_id', userId)
      .single();

    if (userError || !userData) {
      console.error("[API][NEWS_TODAY] User not found:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userLevel = userData.level || 2;
    const onboardedAt = new Date(userData.onboarded_at);
    const now = new Date();

    // 무료 체험 기간 확인 (가입 후 30일 이내)
    const isTrialPeriod = (now.getTime() - onboardedAt.getTime()) < (30 * 24 * 60 * 60 * 1000);

    // 2. 마스터 데이터(Interests) 및 사용자 관심사 조회
    const [allInterestsResult, userInterestsResult] = await Promise.all([
      supabase.from('interests').select('name'), // 태그 표시 허용 목록(Allowlist)용
      supabase.from('user_interests').select('interest_id').eq('clerk_id', userId)
    ]);

    // 태그 허용 목록 (Contexts 제외, 오직 Interests만 표시)
    const allowedTagNames = (allInterestsResult.data || []).map(i => i.name);

    // 사용자 관심사 ID 목록
    const userInterestIds = (userInterestsResult.data || []).map(i => i.interest_id);

    // 사용자 관심사 한글명 조회 (뉴스 필터링용)
    const userInterestNamesResult = userInterestIds.length > 0
      ? await supabase.from('interests').select('name').in('id', userInterestIds)
      : { data: [], error: null };

    const userInterestNames = (userInterestNamesResult.data || []).map(i => i.name);

    console.log("[API][NEWS_TODAY] User selected interests:", userInterestNames);
    console.log("[API][NEWS_TODAY] Allowed display tags:", allowedTagNames);

    // 필터링 기준: 오직 'Interests'만 사용 (Contexts 제외)
    let filterValues = userInterestNames;
    let shouldFilter = true;

    if (categoryParam && categoryParam !== 'all') {
      const categoryName = SLUG_TO_KOREAN[categoryParam] || categoryParam;
      filterValues = [categoryName];
    } else {
      // "전체"일 때: 사용자 관심사로 필터링
      filterValues = userInterestNames;
      if (filterValues.length === 0) {
        shouldFilter = false;
        console.log("[API][NEWS_TODAY] No user interests found, showing unfiltered news");
      }
    }

    console.log("[API][NEWS_TODAY] Final filter criteria:", filterValues);

    // 3. 레벨별 컬럼 선택
    const levelColumns = {
      1: { title: 'easy_title', content: 'easy_content', worst: 'easy_worst', action: 'easy_action' },
      2: { title: 'normal_title', content: 'normal_content', worst: 'normal_worst', action: 'normal_action' },
      3: { title: 'hard_title', content: 'hard_content', worst: 'hard_worst', action: 'hard_action' }
    };

    const cols = levelColumns[userLevel as 1 | 2 | 3] || levelColumns[2];

    // 4. 뉴스 조회
    // 조인된 테이블에 대한 복잡한 DB 레벨 OR 필터링(JSONB)이 오류가 발생할 수 있으므로,
    // 넉넉하게 데이터를 가져온 후 JS 레벨에서 필터링을 수행하여 안정성을 확보합니다.
    const dbLimit = shouldFilter ? 100 : limit;

    const { data: newsData, error: newsError } = await (supabase
      .from('news')
      .select(`
        id,
        title,
        published_at,
        news_analysis_levels!inner(
          ${cols.title},
          ${cols.content},
          interest,
          action_blurred
        )
      `)
      .gte('published_at', startOfDay.toISOString())
      .lte('published_at', endOfDay.toISOString())
      .order('published_at', { ascending: false })
      .limit(dbLimit) as any);

    if (newsError) {
      console.error("[API][NEWS_TODAY] Query error detailed:", newsError);
      return NextResponse.json({ error: "Failed to fetch news", message: newsError.message }, { status: 500 });
    }

    console.log("[API][NEWS_TODAY] News fetched from DB:", newsData?.length || 0);

    // 5. 응답 데이터 구성 및 JS 필터링
    const allProcessedNews = (newsData || []).map((item: any) => {
      // 조인 결과가 배열로 올 수 있으므로 처리
      const analysis = Array.isArray(item.news_analysis_levels)
        ? item.news_analysis_levels[0]
        : item.news_analysis_levels;

      const originalTags = (analysis?.interest || []) as string[];

      // 태그 Allowlist 적용
      const displayableTags = originalTags.filter(tag => allowedTagNames.includes(tag));

      // 대표 카테고리 설정
      const requestedCategoryName = categoryParam ? (SLUG_TO_KOREAN[categoryParam] || categoryParam) : null;
      let primaryCategory = '';

      if (requestedCategoryName && displayableTags.includes(requestedCategoryName)) {
        primaryCategory = requestedCategoryName;
      } else {
        primaryCategory = displayableTags[0] || '일반';
      }

      const finalTags = displayableTags.length > 0 ? displayableTags : [primaryCategory];

      return {
        id: item.id,
        title: analysis?.[cols.title] || item.title,
        category: primaryCategory,
        published_at: item.published_at,
        tags: finalTags,
        analysis: {
          level: userLevel,
          easy_title: analysis?.[cols.title] || '',
          summary: analysis?.[cols.content] || '',
          worst_scenarios: [],
          should_blur: isTrialPeriod ? false : (analysis?.action_blurred !== false)
        },
        originalTags // 필터링용
      };
    });

    // JS 레벨 필터링 적용
    let filteredNews = allProcessedNews;
    if (shouldFilter && filterValues.length > 0) {
      filteredNews = allProcessedNews.filter((item: any) => {
        return item.originalTags.some((tag: string) => filterValues.includes(tag));
      });
      console.log("[API][NEWS_TODAY] After JS filtering, count:", filteredNews.length);
    }

    // 최종적으로 사용자가 요청한 limit만큼만 반환
    const finalNews = filteredNews.slice(0, limit);

    return NextResponse.json({
      news: finalNews,
      user_interests: userInterestNames,
      subscription: { active: true, days_remaining: 30 }
    });

  } catch (error: any) {
    console.error("[API][NEWS_TODAY] Unexpected error detailed:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json({
      error: "Internal server error",
      details: error.message
    }, { status: 500 });
  }
}
// ... 기존 코드들 ...

// 배포 트리거용 주석 (이 줄을 추가하세요)

