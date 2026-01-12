import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// 캐싱 비활성화: 항상 최신 데이터를 가져옵니다
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    console.log("[API][NEWS_MONTHLY] Request started");
    const { userId } = await auth();

    // 개발 환경이 아니면 로그인 필수 (프로덕션 보안)
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment && !userId) {
      console.log("[API][NEWS_MONTHLY] Production mode - login required");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[API][NEWS_MONTHLY] User ID:", userId || 'anonymous (dev mode)');

    const url = new URL(req.url);
    const categoryParam = url.searchParams.get("category");
    const limitParam = url.searchParams.get("limit");
    const limit = Math.min(parseInt(limitParam || "20"), 50);

    // 이달의 뉴스 전체 범위 (한국 시간 기준: UTC+9)
    // 한국 시간으로 현재 날짜 구하기
    const nowUTC = new Date();
    const koreaOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로
    const nowKorea = new Date(nowUTC.getTime() + koreaOffset);

    // 한국 시간 기준 이번 달의 시작: YYYY-MM-01 00:00:00 KST
    const year = nowKorea.getUTCFullYear();
    const month = nowKorea.getUTCMonth();

    // 한국 시간 이번 달 1일 00:00:00을 UTC로 변환
    const startOfMonthKorea = new Date(Date.UTC(year, month, 1, 0, 0, 0));
    const startOfMonthUTC = new Date(startOfMonthKorea.getTime() - koreaOffset);

    // 한국 시간 오늘 23:59:59를 UTC로 변환 (이달 말까지가 아니라 오늘까지)
    const date = nowKorea.getUTCDate();
    const endOfDayKorea = new Date(Date.UTC(year, month, date, 23, 59, 59, 999));
    const endOfMonthUTC = new Date(endOfDayKorea.getTime() - koreaOffset);

    console.log("[API][NEWS_MONTHLY] Query params:", {
      userId,
      category: categoryParam || 'all',
      limit,
      koreaDate: `${year}-${String(month + 1).padStart(2, '0')}`,
      koreaDateTimeRange: `${year}-${String(month + 1).padStart(2, '0')}-01 00:00:00 KST ~ ${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')} 23:59:59 KST`,
      utcDateTimeRange: `${startOfMonthUTC.toISOString()} ~ ${endOfMonthUTC.toISOString()}`
    });

    // 1. 사용자 정보 조회 (로그인한 경우에만)
    let userLevel = 1; // 기본 레벨 (비로그인 사용자)
    let isPremiumSubscriber = false; // 유료 구독 여부
    let isTrialPeriod = true; // 비로그인 사용자는 무료 체험 중으로 간주
    let userInterestIds: string[] = [];

    if (userId) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('level, onboarded_at')
        .eq('clerk_id', userId)
        .single();

      if (userData) {
        userLevel = userData.level || 1;
        const onboardedAt = new Date(userData.onboarded_at);
        const now = new Date();

        // 구독 정보 조회
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('plan, active, ends_at')
          .eq('clerk_id', userId)
          .order('started_at', { ascending: false })
          .limit(1)
          .single();

        console.log("[API][NEWS_MONTHLY] Subscription check:", {
          userId,
          subscriptionData,
          subscriptionError: subscriptionError?.code
        });

        // ✅ 유료 구독자 확인
        isPremiumSubscriber = subscriptionData && 
          subscriptionData.plan === 'premium' && 
          subscriptionData.active === true &&
          new Date(subscriptionData.ends_at) > now;

        // ⚠️ 무료 체험 기간 확인 (subscriptions 테이블에 레코드가 없으면서 가입 후 30일 이내)
        const hasNoSubscriptionRecord = !subscriptionData || subscriptionError?.code === 'PGRST116';
        const daysSinceOnboarding = (now.getTime() - onboardedAt.getTime()) / (1000 * 60 * 60 * 24);
        isTrialPeriod = hasNoSubscriptionRecord && daysSinceOnboarding < 30;

        console.log("[API][NEWS_MONTHLY] User subscription status:", {
          isPremiumSubscriber,
          isTrialPeriod,
          daysSinceOnboarding: daysSinceOnboarding.toFixed(1),
          hasNoSubscriptionRecord
        });
      } else {
        console.log("[API][NEWS_MONTHLY] User not found in DB, using defaults");
      }
    }

    // 2. 마스터 데이터(Interests) 및 사용자 관심사 조회
    const [allInterestsResult, userInterestsResult] = await Promise.all([
      supabase.from('interests').select('name'), // 태그 표시 허용 목록(Allowlist)용
      userId 
        ? supabase.from('user_interests').select('interest_id').eq('clerk_id', userId)
        : Promise.resolve({ data: [], error: null })
    ]);

    // 사용자 관심사 ID 목록 (로그인한 경우에만)
    userInterestIds = (userInterestsResult.data || []).map(i => i.interest_id);

    // 태그 허용 목록 (Contexts 제외, 오직 Interests만 표시)
    const allowedTagNames = (allInterestsResult.data || []).map(i => i.name);

    // 사용자 관심사 한글명 조회 (뉴스 필터링용)
    const userInterestNamesResult = userInterestIds.length > 0
      ? await supabase.from('interests').select('name').in('id', userInterestIds)
      : { data: [], error: null };

    const userInterestNames = (userInterestNamesResult.data || []).map(i => i.name);

    console.log("[API][NEWS_MONTHLY] User selected interests:", userInterestNames);
    console.log("[API][NEWS_MONTHLY] Allowed display tags:", allowedTagNames);

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
        console.log("[API][NEWS_MONTHLY] No user interests found, showing unfiltered news");
      }
    }

    console.log("[API][NEWS_MONTHLY] Final filter criteria:", filterValues);

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
      .gte('published_at', startOfMonthUTC.toISOString())
      .lte('published_at', endOfMonthUTC.toISOString())
      .order('published_at', { ascending: false })
      .limit(dbLimit) as any);

    if (newsError) {
      console.error("[API][NEWS_MONTHLY] Query error detailed:", newsError);
      return NextResponse.json({ error: "Failed to fetch news", message: newsError.message }, { status: 500 });
    }

    console.log("[API][NEWS_MONTHLY] News fetched from DB:", newsData?.length || 0);

    // 5. 응답 데이터 구성 및 JS 필터링
    const allProcessedNews = (newsData || []).map((item: any) => {
      // 조인 결과가 배열로 올 수 있으므로 처리
      const analysis = Array.isArray(item.news_analysis_levels)
        ? item.news_analysis_levels[0]
        : item.news_analysis_levels;

      const originalTags = (analysis?.interest || []) as string[];

      // 태그 Allowlist 적용
      const displayableTags = originalTags.filter(tag => allowedTagNames.includes(tag));

      // 대표 카테고리 설정 (항상 첫 번째 태그가 주요 카테고리)
      const primaryCategory = displayableTags[0] || '일반';
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
          should_blur: (isTrialPeriod || isPremiumSubscriber) ? false : (analysis?.action_blurred !== false)
        },
        originalTags // 필터링용
      };
    });

    // JS 레벨 필터링: 대표 카테고리(primaryCategory)가 요청한 카테고리와 일치하는 것만
    let filteredNews = allProcessedNews;
    
    console.log("[API][NEWS_MONTHLY] Before filtering:");
    console.log("  Total:", allProcessedNews.length);
    console.log("  Should filter:", shouldFilter);
    console.log("  Filter values:", JSON.stringify(filterValues));
    console.log("  Sample news (first 5):");
    allProcessedNews.slice(0, 5).forEach((n, i) => {
      const publishedKorea = new Date(new Date(n.published_at).getTime() + koreaOffset);
      const publishedKoreaStr = `${publishedKorea.getUTCFullYear()}-${String(publishedKorea.getUTCMonth() + 1).padStart(2, '0')}-${String(publishedKorea.getUTCDate()).padStart(2, '0')} ${String(publishedKorea.getUTCHours()).padStart(2, '0')}:${String(publishedKorea.getUTCMinutes()).padStart(2, '0')}`;
      console.log(`    [${i}] "${n.title?.substring(0, 50)}"`);
      console.log(`        PRIMARY category: ${n.category}`);
      console.log(`        published_at (KST): ${publishedKoreaStr}`);
      console.log(`        all tags: ${JSON.stringify(n.tags)}`);
    });
    
    if (shouldFilter && filterValues.length > 0) {
      // 대표 카테고리가 요청한 카테고리와 정확히 일치하는 것만 필터링
      filteredNews = allProcessedNews.filter((item: any) => {
        return filterValues.includes(item.category);
      });
      console.log("[API][NEWS_MONTHLY] After filtering:", {
        beforeCount: allProcessedNews.length,
        afterCount: filteredNews.length,
        filterValues
      });
    } else {
      console.log("[API][NEWS_MONTHLY] Skipping filter - returning all news");
    }

    // 최종적으로 사용자가 요청한 limit만큼만 반환
    const finalNews = filteredNews.slice(0, limit);

    console.log("[API][NEWS_MONTHLY] Final response:", {
      filteredCount: filteredNews.length,
      returnedCount: finalNews.length,
      limit
    });

    return NextResponse.json({
      news: finalNews,
      user_interests: userInterestNames,
      subscription: { active: true, days_remaining: 30 }
    });

  } catch (error: any) {
    console.error("[API][NEWS_MONTHLY] Unexpected error detailed:", {
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

