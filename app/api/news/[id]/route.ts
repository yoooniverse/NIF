import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const SLUG_TO_KOREAN: Record<string, string> = {
  'stock': '주식',
  'crypto': '가상화폐',
  'real-estate': '부동산',
  'etf': 'ETF',
  'exchange-rate': '환율'
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: newsId } = await params;
    console.log("[API][NEWS_DETAIL] Request:", { userId, newsId });

    // 1. 사용자 정보 조회 (레벨, 온보딩 날짜, 상황, 관심사)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        level, 
        onboarded_at,
        user_contexts(context_id),
        user_interests(interest_id)
      `)
      .eq('clerk_id', userId)
      .single();

    if (userError || !userData) {
      console.error("[API][NEWS_DETAIL] User not found:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userLevel = userData.level || 2;
    const onboardedAt = new Date(userData.onboarded_at);
    // 사용자 태그 수집 (상황 + 관심사)
    const userContexts = (userData.user_contexts as any[])?.map(uc => uc.context_id) || [];
    const userInterests = (userData.user_interests as any[])?.map(ui => ui.interest_id) || [];
    const userTags = new Set([...userContexts, ...userInterests]);

    console.log("[API][NEWS_DETAIL] User Tags:", Array.from(userTags));

    const now = new Date();

    // 무료 체험 기간 확인 (가입 후 30일 이내)
    const isTrialPeriod = (now.getTime() - onboardedAt.getTime()) < (30 * 24 * 60 * 60 * 1000);

    // 2. 레벨별 컬럼 선택
    const levelPrefix = userLevel === 1 ? 'easy' : userLevel === 2 ? 'normal' : 'hard';
    const cols = {
      title: `${levelPrefix}_title`,
      content: `${levelPrefix}_content`,
      worst_all: `${levelPrefix}_worst_all`,
      action_all: `${levelPrefix}_action_all`
    };

    // 3. 뉴스 조회
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
          ${cols.worst_all},
          ${cols.action_all},
          interest,
          action_blurred
        ),
        sources(name)
      `) as any)
      .eq('id', newsId)
      .single();

    if (newsError || !newsData) {
      console.error("[API][NEWS_DETAIL] News not found:", newsError);
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    console.log("[API][NEWS_DETAIL] News found");

    // 4. 응답 데이터 구성
    const analysis = (newsData as any)?.news_analysis_levels;

    // 사용자가 선택한 상황(Contexts)들에 맞는 데이터 추출
    // userContexts: ['직장인', '대출보유'] 등
    const worstScenarios = userContexts
      .map(ctx => analysis?.[cols.worst_all]?.[ctx])
      .filter(Boolean); // 존재하는 데이터만 추출

    const actionTips = userContexts
      .map(ctx => analysis?.[cols.action_all]?.[ctx])
      .filter(Boolean);

    // 상황별 데이터가 하나도 없으면 기본값(첫 번째 키의 값)이라도 넣어주거나 빈 배열 유지
    // 현재 기획상 6개 상황이 다 있다고 했으므로 filter(Boolean)으로 충분

    // 무료 체험 기간이면 블러 처리 해제, 아니면 데이터베이스 설정값 사용
    const shouldBlur = isTrialPeriod ? false : (analysis?.action_blurred !== false);

    const response = {
      id: (newsData as any).id,
      title: (newsData as any).title,
      source: (newsData as any).sources?.name || 'Unknown',
      url: (newsData as any).url || '',
      analysis: {
        level: userLevel,
        title: analysis?.[cols.title] || '',
        content: analysis?.[cols.content] || '',
        worst_scenarios: worstScenarios,
        action_tips: actionTips,
        should_blur: shouldBlur
      }
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("[API][NEWS_DETAIL] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
