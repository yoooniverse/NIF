import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// 캐싱 비활성화: 항상 최신 데이터를 가져옵니다
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    
    // 사용자 태그 수집 (상황 + 관심사) - UUID
    const userContextIds = (userData.user_contexts as any[])?.map(uc => uc.context_id) || [];
    const userInterestIds = (userData.user_interests as any[])?.map(ui => ui.interest_id) || [];
    
    console.log("[API][NEWS_DETAIL] User Context IDs:", userContextIds);
    console.log("[API][NEWS_DETAIL] User Interest IDs:", userInterestIds);

    // contexts 테이블에서 한글 이름 가져오기
    const { data: contextsData } = await supabase
      .from('contexts')
      .select('id, name')
      .in('id', userContextIds);
    
    const { data: interestsData } = await supabase
      .from('interests')
      .select('id, name')
      .in('id', userInterestIds);

    // UUID를 한글 이름으로 변환
    const userContextNames = contextsData?.map(c => c.name) || [];
    const userInterestNames = interestsData?.map(i => i.name) || [];
    
    console.log("[API][NEWS_DETAIL] User Context Names:", userContextNames);
    console.log("[API][NEWS_DETAIL] User Interest Names:", userInterestNames);

    const now = new Date();

    // 2. 구독 정보 조회 (subscriptions 테이블)
    console.group("[API][NEWS_DETAIL] 📋 구독 상태 확인");
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('plan, active, ends_at')
      .eq('clerk_id', userId)
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    console.log("[API][NEWS_DETAIL] Subscription data:", subscriptionData);
    console.log("[API][NEWS_DETAIL] Subscription error:", subscriptionError);
    console.log("[API][NEWS_DETAIL] User onboarded at:", onboardedAt);
    console.log("[API][NEWS_DETAIL] Current time:", now);

    // ✅ 유료 구독자 확인 (plan='premium' AND active=true AND ends_at > now)
    const isPremiumSubscriber = subscriptionData && 
      subscriptionData.plan === 'premium' && 
      subscriptionData.active === true &&
      new Date(subscriptionData.ends_at) > now;

    // ⚠️ 무료 체험 기간 확인 (subscriptions 테이블에 레코드가 없으면서 가입 후 30일 이내)
    // subscriptions 테이블에 레코드가 있다면 무료체험이 아니라 구독 상태를 따라감
    const hasNoSubscriptionRecord = !subscriptionData || subscriptionError?.code === 'PGRST116'; // PGRST116 = no rows returned
    const daysSinceOnboarding = (now.getTime() - onboardedAt.getTime()) / (1000 * 60 * 60 * 24);
    const isTrialPeriod = hasNoSubscriptionRecord && daysSinceOnboarding < 30;

    console.log("[API][NEWS_DETAIL] 📊 블러 판단 로직:");
    console.log("[API][NEWS_DETAIL]   - 구독 레코드 없음:", hasNoSubscriptionRecord);
    console.log("[API][NEWS_DETAIL]   - 가입 후 경과일:", daysSinceOnboarding.toFixed(1), "일");
    console.log("[API][NEWS_DETAIL]   - 무료체험 중:", isTrialPeriod);
    console.log("[API][NEWS_DETAIL]   - 유료 구독자:", isPremiumSubscriber);
    console.log("[API][NEWS_DETAIL]   - 구독 플랜:", subscriptionData?.plan || 'N/A');
    console.log("[API][NEWS_DETAIL]   - 구독 활성:", subscriptionData?.active || false);
    console.log("[API][NEWS_DETAIL]   - 구독 만료:", subscriptionData?.ends_at || 'N/A');
    console.groupEnd();

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
    let analysis = (newsData as any)?.news_analysis_levels;
    console.log("[API][NEWS_DETAIL] Analysis raw data (before):", analysis);
    
    // analysis가 배열이면 첫 번째 요소를 가져옴
    if (Array.isArray(analysis) && analysis.length > 0) {
      console.log("[API][NEWS_DETAIL] Analysis is array, taking first element");
      analysis = analysis[0];
    }
    
    console.log("[API][NEWS_DETAIL] Analysis data (after):", analysis);
    console.log("[API][NEWS_DETAIL] Title:", analysis?.[cols.title]);
    console.log("[API][NEWS_DETAIL] Content:", analysis?.[cols.content]);
    
    // JSON 문자열을 객체로 파싱
    let worstAllData = analysis?.[cols.worst_all];
    let actionAllData = analysis?.[cols.action_all];
    
    // JSON 문자열이면 파싱
    if (typeof worstAllData === 'string') {
      console.log("[API][NEWS_DETAIL] Parsing worst_all JSON string");
      try {
        worstAllData = JSON.parse(worstAllData);
      } catch (e) {
        console.error("[API][NEWS_DETAIL] Failed to parse worst_all:", e);
        worstAllData = {};
      }
    }
    
    if (typeof actionAllData === 'string') {
      console.log("[API][NEWS_DETAIL] Parsing action_all JSON string");
      try {
        actionAllData = JSON.parse(actionAllData);
      } catch (e) {
        console.error("[API][NEWS_DETAIL] Failed to parse action_all:", e);
        actionAllData = {};
      }
    }
    
    console.log("[API][NEWS_DETAIL] Parsed worst_all:", worstAllData);
    console.log("[API][NEWS_DETAIL] Parsed action_all:", actionAllData);
    console.log("[API][NEWS_DETAIL] User context names (Korean):", userContextNames);

    // 사용자가 선택한 상황(Contexts)들에 맞는 데이터 추출
    let worstScenarios: string[] = [];
    let actionTips: string[] = [];

    if (userContextNames.length > 0 && worstAllData && actionAllData) {
      // 사용자 상황에 맞는 데이터 추출 (한글 이름 사용)
      console.log("[API][NEWS_DETAIL] Extracting data for user context names:", userContextNames);
      console.log("[API][NEWS_DETAIL] Available worst_all keys:", Object.keys(worstAllData));
      console.log("[API][NEWS_DETAIL] Available action_all keys:", Object.keys(actionAllData));
      
      worstScenarios = userContextNames
        .map(ctx => {
          const value = worstAllData?.[ctx];
          console.log(`[API][NEWS_DETAIL] worst_all['${ctx}']:`, value);
          return value;
        })
        .filter(Boolean) as string[];
      
      actionTips = userContextNames
        .map(ctx => {
          const value = actionAllData?.[ctx];
          console.log(`[API][NEWS_DETAIL] action_all['${ctx}']:`, value);
          return value;
        })
        .filter(Boolean) as string[];
      
      console.log("[API][NEWS_DETAIL] Context-filtered worst scenarios:", worstScenarios);
      console.log("[API][NEWS_DETAIL] Context-filtered action tips:", actionTips);
    }

    // 데이터가 없으면 worst_all과 action_all의 모든 값을 배열로 변환
    if (worstScenarios.length === 0 && worstAllData) {
      console.log("[API][NEWS_DETAIL] No context matches, using all worst scenarios");
      worstScenarios = Object.values(worstAllData).filter(Boolean) as string[];
    }
    
    if (actionTips.length === 0 && actionAllData) {
      console.log("[API][NEWS_DETAIL] No context matches, using all action tips");
      actionTips = Object.values(actionAllData).filter(Boolean) as string[];
    }

    console.log("[API][NEWS_DETAIL] ✅ Final worst scenarios count:", worstScenarios.length);
    console.log("[API][NEWS_DETAIL] ✅ Final action tips count:", actionTips.length);
    console.log("[API][NEWS_DETAIL] First worst scenario:", worstScenarios[0]?.substring(0, 100));
    console.log("[API][NEWS_DETAIL] First action tip:", actionTips[0]?.substring(0, 100));

    // 🔒 블러 처리 로직
    // ✅ 액션팁 볼 수 있는 사람: 무료체험 중 OR 유료 구독자
    // ❌ 액션팁 블러되는 사람: 무료체험 종료 AND 무료 플랜
    const canViewActionTips = isTrialPeriod || isPremiumSubscriber;
    const shouldBlur = canViewActionTips ? false : (analysis?.action_blurred !== false);

    console.log("[API][NEWS_DETAIL] 🔒 블러 처리 결과:");
    console.log("[API][NEWS_DETAIL]   - 액션팁 볼 수 있음:", canViewActionTips);
    console.log("[API][NEWS_DETAIL]   - 블러 적용:", shouldBlur);
    console.log("[API][NEWS_DETAIL]   - 이유:", 
      canViewActionTips 
        ? (isTrialPeriod ? "무료체험 중" : "유료 구독자") 
        : "무료체험 종료 + 무료 플랜"
    );

    // interest 필드 추출 (배열로 반환)
    const interests = analysis?.interest || [];
    console.log("[API][NEWS_DETAIL] Interests:", interests);

    const response = {
      id: (newsData as any).id,
      title: (newsData as any).title,
      source: (newsData as any).sources?.name || 'Unknown',
      url: (newsData as any).url || '',
      category: Array.isArray(interests) && interests.length > 0 ? interests[0] : '일반', // 첫 번째 관심분야를 카테고리로
      analysis: {
        level: userLevel,
        title: analysis?.[cols.title] || '',
        content: analysis?.[cols.content] || '',
        worst_scenarios: worstScenarios,
        action_tips: actionTips,
        should_blur: shouldBlur
      }
    };

    console.log("[API][NEWS_DETAIL] ✅ Response category:", response.category);
    return NextResponse.json(response);

  } catch (error: any) {
    console.error("[API][NEWS_DETAIL] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
