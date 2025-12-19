import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type {
  NewsDetailResponse
} from "@/types/news";

interface SourceData {
  source_id: string;
  homepage_url: string;
}

// 구독 상태 확인 함수
async function checkSubscription(userId: string) {
  const { data } = await supabase
    .from("subscriptions")
    .select("plan, active, ends_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) {
    // 구독 정보가 없으면 무료 체험으로 간주
    return { active: false, days_remaining: 0 };
  }

  const now = new Date();
  const endsAt = new Date(data.ends_at);
  const isActive = data.active && endsAt > now;

  return {
    active: isActive,
    days_remaining: isActive ? Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0,
  };
}

// GET /api/news/[id] - 뉴스 상세 조회
async function handleGet(request: NextRequest, userId: string): Promise<Response> {
  const newsId = request.nextUrl.pathname.split('/').pop(); // URL에서 news ID 추출
  console.log(`[API] 뉴스 상세 조회 요청 - userId: ${userId}, newsId: ${newsId}`);

  try {
    if (!newsId) {
      console.log(`[API] 뉴스 ID 누락`);
      return Response.json(
        { error: "뉴스 ID가 필요합니다" },
        { status: 400 }
      );
    }

    // 사용자 프로필 조회 (AI 레벨 확인)
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("level")
      .eq("user_id", userId)
      .single();

    if (profileError) {
      console.error("사용자 프로필 조회 실패:", profileError);
      // 프로필이 없으면 기본 레벨 2로 처리
    }

    const userLevel = profile?.level || 2;

    // 뉴스 기본 데이터 조회
    const { data: newsBasic, error: newsError } = await supabase
      .from("news")
      .select(`
        id,
        title,
        url,
        content,
        published_at,
        metadata,
        source_id
      `)
      .eq("id", newsId)
      .single();

    if (newsError || !newsBasic) {
      console.error("뉴스 기본 데이터 조회 실패:", newsError);
      return Response.json(
        { error: "뉴스를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 출처 정보 조회
    const { data: sourceData } = await supabase
      .from("sources")
      .select("source_id, homepage_url")
      .eq("id", newsBasic.source_id)
      .single();

    // 타입 안전성을 위한 검증
    const typedSourceData: SourceData | null = sourceData;

    if (newsError) {
      console.error("뉴스 상세 조회 실패:", newsError);
      return Response.json(
        { error: "뉴스를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    if (!newsBasic) {
      // 데이터가 없는 경우 (실제로는 아직 뉴스가 없음)
      console.log(`[API] 뉴스 데이터 없음 - newsId: ${newsId}`);
      return Response.json(
        { error: "뉴스를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 분석 데이터 조회 (별도 테이블에서)
    const { data: analysisData, error: analysisError } = await supabase
      .from("news_analysis_levels")
      .select("*")
      .eq("news_id", newsId)
      .eq("level", userLevel)
      .single();

    if (analysisError || !analysisData) {
      console.log(`[API] 뉴스 분석 데이터 없음 - newsId: ${newsId}, level: ${userLevel}`);
      return Response.json(
        { error: "해당 레벨의 뉴스 분석을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 구독 상태 확인
    const subscription = await checkSubscription(userId);

    // 출처 정보 구성
    const sourceName = typedSourceData?.source_id || "알 수 없음";

    // 응답 데이터 구성
    const response: NewsDetailResponse = {
      id: newsBasic.id,
      title: newsBasic.title,
      url: newsBasic.url,
      content: newsBasic.content,
      published_at: newsBasic.published_at,
      source: sourceName,
      category: newsBasic.metadata?.category || "기타",
      analysis: {
        level: analysisData.level,
        easy_title: analysisData.easy_title,
        summary: analysisData.summary,
        worst_scenario: analysisData.worst_scenario,
        user_action_tip: analysisData.user_action_tip,
        should_blur: !subscription.active // 무료 체험 중이 아니면 블러 처리
      },
      subscription
    };

    return Response.json(response);

  } catch (error) {
    console.error("뉴스 상세 조회 중 오류 발생:", error);
    return Response.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest, _params: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "로그인이 필요합니다" },
      { status: 401 },
    );
  }

  return handleGet(request, userId);
}