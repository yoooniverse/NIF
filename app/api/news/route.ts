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

    // 2. 사용자 관심사 조회
    const { data: userInterests, error: interestsError } = await supabase
      .from('user_interests')
      .select('interest_id')
      .eq('clerk_id', userId);

    if (interestsError) {
      console.error("[API][NEWS_TODAY] Failed to fetch interests:", interestsError);
    }

    // interest_id (UUID) → slug 변환
    const interestSlugs = (userInterests || [])
      .map(ui => INTEREST_UUID_TO_SLUG[ui.interest_id])
      .filter(Boolean);

    console.log("[API][NEWS_TODAY] User interests:", interestSlugs);

    // 필터링할 관심사 결정
    let shouldFilterByInterest = true;
    let allowedInterests = interestSlugs;

    if (categoryParam === 'all' || !categoryParam) {
      // "전체" 선택 시 관심사 필터링 안 함
      shouldFilterByInterest = false;
      console.log("[API][NEWS_TODAY] Showing all news (no interest filter)");
    } else if (categoryParam && categoryParam !== 'all') {
      // 특정 카테고리 선택 시
      allowedInterests = interestSlugs.includes(categoryParam) ? [categoryParam] : [];
      if (allowedInterests.length === 0) {
        console.log("[API][NEWS_TODAY] Category not in user interests");
        return NextResponse.json({
          news: [],
          subscription: { active: true, days_remaining: 30 }
        });
      }
    }

    // slug → 한글명 변환 (Supabase의 interest 필드는 한글로 저장됨)
    const allowedInterestsKorean = shouldFilterByInterest
      ? allowedInterests.map(slug => SLUG_TO_KOREAN[slug] || slug)
      : [];

    // 3. 레벨별 컬럼 선택
    const levelColumns = {
      1: { title: 'easy_title', content: 'easy_content', worst: 'easy_worst', action: 'easy_action' },
      2: { title: 'normal_title', content: 'normal_content', worst: 'normal_worst', action: 'normal_action' },
      3: { title: 'hard_title', content: 'hard_content', worst: 'hard_worst', action: 'hard_action' }
    };

    const cols = levelColumns[userLevel as 1 | 2 | 3] || levelColumns[2];

    // 4. 뉴스 조회
    let query = supabase
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
      `)
      .gte('published_at', startOfDay.toISOString())
      .lte('published_at', endOfDay.toISOString())
      .order('published_at', { ascending: false })
      .limit(limit);

    // interest 필터링 (shouldFilterByInterest가 true이고 allowedInterestsKorean이 있을 때만)
    if (shouldFilterByInterest && allowedInterestsKorean.length > 0) {
      // JSONB 배열에 한글 관심사가 포함되어 있는지 확인
      query = query.overlaps('news_analysis_levels.interest', allowedInterestsKorean);
    }

    const { data: newsData, error: newsError } = await query;

    if (newsError) {
      console.error("[API][NEWS_TODAY] Query error:", newsError);
      return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }

    console.log("[API][NEWS_TODAY] News fetched:", newsData?.length || 0);

    // 5. 응답 데이터 구성
    const news = (newsData || []).map((item: any) => {
      const analysis = Array.isArray(item.news_analysis_levels)
        ? item.news_analysis_levels[0]
        : item.news_analysis_levels;

      // interest 배열에서 첫 번째 값을 카테고리로 사용
      const categorySlug = analysis?.interest?.[0] || 'stock';
      const categoryName = SLUG_TO_KOREAN[categorySlug] || categorySlug;

      return {
        id: item.id,
        title: analysis?.[cols.title] || item.title,
        category: categoryName,
        published_at: item.published_at,
        analysis: {
          level: userLevel,
          easy_title: analysis?.[cols.title] || '',
          summary: analysis?.[cols.content] || '',
          worst_scenario: analysis?.[cols.worst] || '',
          should_blur: isTrialPeriod ? false : (analysis?.action_blurred !== false)
        }
      };
    });

    return NextResponse.json({
      news,
      subscription: { active: true, days_remaining: 30 }
    });

  } catch (error: any) {
    console.error("[API][NEWS_TODAY] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}