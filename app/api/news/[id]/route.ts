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

    // 1. 사용자 정보 조회 (레벨 및 온보딩 날짜)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('level, onboarded_at')
      .eq('clerk_id', userId)
      .single();

    if (userError || !userData) {
      console.error("[API][NEWS_DETAIL] User not found:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userLevel = userData.level || 2;
    const onboardedAt = new Date(userData.onboarded_at);
    const now = new Date();

    // 무료 체험 기간 확인 (가입 후 30일 이내)
    const isTrialPeriod = (now.getTime() - onboardedAt.getTime()) < (30 * 24 * 60 * 60 * 1000);

    // 2. 레벨별 컬럼 선택
    const levelColumns = {
      1: { title: 'easy_title', content: 'easy_content', worst: 'easy_worst', action: 'easy_action' },
      2: { title: 'normal_title', content: 'normal_content', worst: 'normal_worst', action: 'normal_action' },
      3: { title: 'hard_title', content: 'hard_content', worst: 'hard_worst', action: 'hard_action' }
    };

    const cols = levelColumns[userLevel as 1 | 2 | 3] || levelColumns[2];

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
          ${cols.worst},
          ${cols.action},
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
// 안전하게 데이터 꺼내기 (수정된 코드)
    const levels = (newsData as any)?.news_analysis_levels;
    const analysis = Array.isArray(levels) ? levels[0] : levels;

    const categorySlug = analysis?.interest?.[0] || 'stock';
    const categoryName = SLUG_TO_KOREAN[categorySlug] || categorySlug;

    // 무료 체험 기간이면 블러 처리 해제, 아니면 데이터베이스 설정값 사용
    const shouldBlur = isTrialPeriod ? false : (analysis?.action_blurred !== false);

    const response = {
  id: (newsData as any).id,
      title: analysis?.[cols.title] || (newsData as any).title,
      source: (newsData as any).sources?.name || 'Unknown',
      url: (newsData as any).url || '',
      analysis: {
        easy_title: analysis?.[cols.title] || '',
        summary: analysis?.[cols.content] || '',
        worst_scenario: analysis?.[cols.worst] || '',
        user_action_tip: analysis?.[cols.action] || '',
        should_blur: shouldBlur
      }
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("[API][NEWS_DETAIL] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
