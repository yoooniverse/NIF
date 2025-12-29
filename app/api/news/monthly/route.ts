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

function parseMonthOrNow(monthParam: string | null): { startIso: string; endIso: string; monthKey: string } {
  const now = new Date();
  const fallbackYear = now.getUTCFullYear();
  const fallbackMonth = now.getUTCMonth() + 1;

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

  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));

  const monthKey = `${year}-${String(month).padStart(2, "0")}`;
  return { startIso: start.toISOString(), endIso: end.toISOString(), monthKey };
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
      limit
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
    const levelColumns = {
      1: { title: 'easy_title', content: 'easy_content', worst: 'easy_worst', action: 'easy_action' },
      2: { title: 'normal_title', content: 'normal_content', worst: 'normal_worst', action: 'normal_action' },
      3: { title: 'hard_title', content: 'hard_content', worst: 'hard_worst', action: 'hard_action' }
    };

    const cols = levelColumns[userLevel as 1 | 2 | 3] || levelColumns[2];

    // 4. 뉴스 조회
    // 필터링을 JS에서 수행하기 위해 limit보다 충분히 많은 양을 가져옴
    const dbLimit = shouldFilter ? 200 : limit;

    let query = (supabase
      .from('news')
      .select(`
        id,
        title,
        url,
        published_at,
        news_analysis_levels!inner(
          ${cols.title},
          ${cols.content},
          ${cols.worst},
          ${cols.action},
          easy_title,
          easy_content,
          easy_worst,
          easy_action,
          interest,
          action_blurred
        ),
        sources(name)
      `) as any)
      .gte('published_at', startIso)
      .lt('published_at', endIso)
      .order('published_at', { ascending: false })
      .limit(dbLimit);

    // DB 레벨 필터링 제거 (500 에러 호환성 및 정확한 JS 필터링을 위해)

    const { data: newsData, error: newsError } = await query;

    if (newsError) {
      console.error("[API][NEWS_MONTHLY] Query error:", newsError);
      return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }

    console.log("[API][NEWS_MONTHLY] News fetched:", newsData?.length || 0);

    // 5. 응답 데이터 구성 및 JS 필터링
    const rawNews = (newsData || []).map((item: any) => {
      const analysis = Array.isArray(item.news_analysis_levels)
        ? item.news_analysis_levels[0]
        : item.news_analysis_levels;

      // 원본 태그 목록
      const originalTags = (analysis?.interest || []) as string[];

      // [핵심 변경] 태그 Allowlist 적용: Context(직장인, 달러보유 등)는 제거하고 Interest(주식, ETF 등)만 남김
      const DisplayableTags = originalTags.filter(tag => allowedTagNames.includes(tag));

      // 대표 카테고리 설정
      let primaryCategory = DisplayableTags[0];

      if (!primaryCategory && filterValues.length > 0) {
        const match = originalTags.find(tag => filterValues.includes(tag));
        if (match) primaryCategory = match;
        else primaryCategory = '일반';
      } else if (!primaryCategory) {
        primaryCategory = '일반';
      }

      // Fallback Logic: 선택된 레벨의 데이터가 없으면 Level 1(easy) 데이터를 사용
      const levelTitle = analysis?.[cols.title] || analysis?.easy_title || item.title;
      const levelContent = analysis?.[cols.content] || analysis?.easy_content || '';
      const levelWorst = analysis?.[cols.worst] || analysis?.easy_worst || '';
      const levelAction = analysis?.[cols.action] || analysis?.easy_action || '';

      // 태그가 없으면 Primary Category라도 보여줌 (Context는 절대 노출 금지)
      const finalTags = DisplayableTags.length > 0 ? DisplayableTags : [primaryCategory];

      return {
        id: item.id,
        title: levelTitle,
        url: item.url,
        published_at: item.published_at,
        category: primaryCategory,
        source: item.sources?.name || 'Unknown',
        tags: finalTags,
        analysis: {
          level: userLevel,
          easy_title: levelTitle,
          summary: levelContent,
          worst_scenario: levelWorst,
          user_action_tip: levelAction,
          should_blur: isTrialPeriod ? false : (analysis?.action_blurred !== false)
        }
      };
    });

    // 필터링 적용 (유효한 태그가 하나라도 있는 뉴스만 표시)
    let filteredNews = rawNews;
    if (shouldFilter && filterValues.length > 0) {
      filteredNews = rawNews.filter((item: any) => {
        return item.tags.some((tag: string) => filterValues.includes(tag));
      });
      console.log("[API][NEWS_MONTHLY] After JS filtering:", filteredNews.length);
    }

    const news = filteredNews;

    return NextResponse.json({
      month: monthKey,
      news
    });

  } catch (error: any) {
    console.error("[API][NEWS_MONTHLY] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
