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
    // 필터링을 JS에서 수행하기 위해 limit보다 충분히 많은 양을 가져옴
    const dbLimit = shouldFilter ? 100 : limit;

    const query = (supabase
      .from('news')
      .select(`
        id,
        title,
        published_at,
        news_analysis_levels!inner(
          ${cols.title},
          ${cols.content},
          ${cols.worst},
          ${cols.action},
          interest,
          action_blurred
        )
      `) as any)
      .gte('published_at', startOfDay.toISOString())
      .lte('published_at', endOfDay.toISOString())
      .order('published_at', { ascending: false })
      .limit(dbLimit);

    // DB 레벨에서의 필터링은 제거하고 (500 에러 방지), 대신 JS에서 수행
    const { data: newsData, error: newsError } = await query;

    if (newsError) {
      console.error("[API][NEWS_TODAY] Query error detailed:", {
        message: newsError.message,
        details: newsError.details,
        hint: newsError.hint,
        code: newsError.code
      });
      return NextResponse.json({ error: "Failed to fetch news", message: newsError.message }, { status: 500 });
    }

    console.log("[API][NEWS_TODAY] News fetched from DB:", newsData?.length || 0);

    // 5. JS 레벨에서 필터링 및 응답 데이터 구성
    const allNews = (newsData || []).map((item: any) => {
      const analysis = Array.isArray(item.news_analysis_levels)
        ? item.news_analysis_levels[0]
        : item.news_analysis_levels;

      // 원본 태그 목록
      const originalTags = (analysis?.interest || []) as string[];

      // [핵심 변경] 태그 Allowlist 적용: Context(직장인, 달러보유 등)는 제거하고 Interest(주식, ETF 등)만 남김
      const DisplayableTags = originalTags.filter(tag => allowedTagNames.includes(tag));

      // 대표 카테고리 설정: 표시 가능한 태그 중 첫 번째
      // 만약 표시 가능한 태그가 없다면, 사용자가 필터링하려는 값 중 하나라도 포함되어 있는지 확인하여 대체
      let primaryCategory = DisplayableTags[0];

      if (!primaryCategory && filterValues.length > 0) {
        // 태그가 없더라도 사용자가 관심있어하는 주제라면 그 주제를 태그로 표시 (fallback)
        const match = originalTags.find(tag => filterValues.includes(tag));
        if (match) primaryCategory = match;
        else primaryCategory = '일반';
      } else if (!primaryCategory) {
        primaryCategory = '일반';
      }

      return {
        id: item.id,
        title: analysis?.[cols.title] || item.title,
        category: primaryCategory,
        published_at: item.published_at,
        tags: DisplayableTags.length > 0 ? DisplayableTags : originalTags, // UI에는 허용된 태그만 전달
        analysis: {
          level: userLevel,
          easy_title: analysis?.[cols.title] || '',
          summary: analysis?.[cols.content] || '',
          worst_scenario: analysis?.[cols.worst] || '',
          should_blur: isTrialPeriod ? false : (analysis?.action_blurred !== false)
        }
      };
    });

    // 필터링 적용
    // 조건: 뉴스에 달린 태그(originalTags) 중 하나라도 사용자의 필터 기준(filterValues)에 포함되면 합격
    // 주의: UI에 보여주는 태그(DisplayableTags)가 없더라도, 원본 태그가 관심사와 일치하면 가져와야 함
    // (예: 뉴스에 '주식', '달러보유'가 있고 내 관심사가 '주식'이면 -> 가져옴. 단 UI에는 '주식'만 표시)
    let filteredNews = allNews;
    if (shouldFilter && filterValues.length > 0) {
      filteredNews = allNews.filter((item: any) => {
        // allNews를 만들 때 원본 데이터를 상실했으므로 다시 매핑하거나, 위에서 originalTags를 참조해야 함.
        // 편의상 map 내부에서 logic을 처리하는게 좋지만, 구조상 분리되어 있으므로
        // newsData를 참조하여 필터링 하는 것이 정확함.
        // 하지만 여기서는 allNews에 `tags`가 이미 sanitizing 되었음.
        // 따라서 `tags` (DisplayableTags) 체크만으로 충분한지 고민 필요.
        // "사용자 관심사"는 무조건 "Allowed List"에 포함되므로 (Interest니까), 
        // DisplayableTags에 내 관심사가 포함되어 있는지 확인하면 됨.
        return item.tags.some((tag: string) => filterValues.includes(tag));
      });
      console.log("[API][NEWS_TODAY] After JS filtering:", filteredNews.length);
    }

    // 최종적으로 사용자가 요청한 limit만큼만 반환
    const finalNews = filteredNews.slice(0, limit);

    return NextResponse.json({
      news: finalNews,
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

