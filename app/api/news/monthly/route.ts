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

function parseMonthOrNow(monthParam: string | null): { startIso: string; endIso: string; monthKey: string } {
  // 한국 시간 기준으로 현재 월을 구함
  const nowUTC = new Date();
  const koreaOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로
  const nowKorea = new Date(nowUTC.getTime() + koreaOffset);
  
  const fallbackYear = nowKorea.getUTCFullYear();
  const fallbackMonth = nowKorea.getUTCMonth() + 1;

  let year = fallbackYear;
  let month = fallbackMonth;

  if (monthParam) {
    const match = /^([0-9]{4})-([0-9]{2})$/.exec(monthParam);
    if (match) {
      year = Number(match[1]);
      month = Number(match[2]);
    }
  }

  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    year = fallbackYear;
    month = fallbackMonth;
  }

  // 한국 시간 기준 해당 월의 1일 00:00:00 KST를 UTC로 변환
  const startKorea = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const startUTC = new Date(startKorea.getTime() - koreaOffset);
  
  // 한국 시간 기준 다음 달 1일 00:00:00 KST를 UTC로 변환 (해당 월의 마지막 순간)
  const endKorea = new Date(Date.UTC(year, month, 1, 0, 0, 0));
  const endUTC = new Date(endKorea.getTime() - koreaOffset);

  const monthKey = `${year}-${String(month).padStart(2, "0")}`;
  return { startIso: startUTC.toISOString(), endIso: endUTC.toISOString(), monthKey };
}

export async function GET(req: NextRequest) {
  try {
    console.log("[API][NEWS_MONTHLY] Request started");
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const monthParam = url.searchParams.get("month");
    const categoryParam = url.searchParams.get("category");
    const limitParam = url.searchParams.get("limit");

    const { startIso, endIso, monthKey } = parseMonthOrNow(monthParam);
    const limit = Math.min(parseInt(limitParam || "30"), 200);

    console.log("[API][NEWS_MONTHLY] Query params:", {
      userId,
      month: monthKey,
      category: categoryParam || 'all',
      limit,
      dateRange: `${monthKey}-01 00:00:00 KST ~ ${monthKey}-31 23:59:59 KST (approx)`,
      utcDateRange: `${startIso} ~ ${endIso}`
    });

    // 1. 사용자 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('level, onboarded_at')
      .eq('clerk_id', userId)
      .single();

    if (userError || !userData) {
      console.error("[API][NEWS_MONTHLY] User not found:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userLevel = userData.level !== null && userData.level !== undefined ? userData.level : 2;
    console.log("[API][NEWS_MONTHLY] User Level:", userLevel, "(DB value:", userData.level, ")");
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
    const levelPrefix = userLevel === 1 ? 'easy' : userLevel === 2 ? 'normal' : 'hard';
    const cols = {
      title: `${levelPrefix}_title`,
      content: `${levelPrefix}_content`,
    };

    // 4. 뉴스 조회
    // 복잡한 DB 레벨 필터링 대신 안정적인 JS 레벨 필터링을 사용합니다.
    const dbLimit = shouldFilter ? 200 : limit;

    const { data: newsData, error: newsError } = await (supabase
      .from('news')
      .select(`
        id,
        title,
        url,
        published_at,
        news_analysis_levels!inner(
          ${cols.title},
          ${cols.content},
          interest,
          action_blurred
        ),
        sources(name)
      `)
      .gte('published_at', startIso)
      .lt('published_at', endIso)
      .order('published_at', { ascending: false })
      .limit(dbLimit) as any);

    if (newsError) {
      console.error("[API][NEWS_MONTHLY] Query error:", newsError);
      return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }

    console.log("[API][NEWS_MONTHLY] News fetched:", newsData?.length || 0);

    // 5. 응답 데이터 구성 및 JS 필터링
    const allProcessedNews = (newsData || []).map((item: any) => {
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
        url: item.url,
        published_at: item.published_at,
        category: primaryCategory,
        source: item.sources?.name || 'Unknown',
        tags: finalTags,
        analysis: {
          level: userLevel,
          easy_title: analysis?.[cols.title] || '',
          summary: analysis?.[cols.content] || '',
          worst_scenarios: [],
          should_blur: isTrialPeriod ? false : (analysis?.action_blurred !== false)
        },
        originalTags
      };
    });

    // JS 레벨 필터링: 대표 카테고리(primaryCategory)가 요청한 카테고리와 일치하는 것만
    let filteredNews = allProcessedNews;
    
    const koreaOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로
    
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

    const news = filteredNews.slice(0, limit);

    console.log("[API][NEWS_MONTHLY] Final response:", {
      filteredCount: filteredNews.length,
      returnedCount: news.length,
      limit,
      userInterests: userInterestNames
    });

    return NextResponse.json({
      month: monthKey,
      news,
      user_interests: userInterestNames
    });

  } catch (error: any) {
    console.error("[API][NEWS_MONTHLY] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
