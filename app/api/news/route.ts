import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type {
  NewsListResponse,
  NewsListItem
} from "@/types/news";

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

// GET /api/news - 뉴스 목록 조회
async function handleGet(request: NextRequest, userId: string): Promise<Response> {
  console.log(`[API] 뉴스 목록 조회 요청 - userId: ${userId}`);

  try {
    const { searchParams } = new URL(request.url);

    // 쿼리 파라미터 파싱
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const category = searchParams.get("category");
    const limit = Math.min(parseInt(searchParams.get("limit") || "5"), 20); // 최대 20개

    console.log(`[API] 쿼리 파라미터 - date: ${date}, category: ${category}, limit: ${limit}`);

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

    // 사용자 관심사 조회
    const { data: userInterests } = await supabase
      .from("user_interests")
      .select(`
        interests!inner(slug)
      `)
      .eq("user_id", userId);

    // 관심사 슬러그 목록 추출
    const interestSlugs = userInterests?.map(ui => (ui.interests as any).slug) || [];

    // 뉴스 조회 쿼리 구성
    let query = supabase
      .from("news")
      .select(`
        id,
        title,
        published_at,
        metadata,
        news_analysis_levels!inner(
          level,
          easy_title,
          summary,
          worst_scenario
        )
      `)
      .eq("news_analysis_levels.level", userLevel)
      .gte("published_at", `${date}T00:00:00`)
      .lte("published_at", `${date}T23:59:59`)
      .eq("metadata->>is_curated", "true")
      .order("published_at", { ascending: false })
      .limit(limit);

    // 관심사 필터 적용
    if (category) {
      // 특정 카테고리가 지정된 경우 해당 카테고리만
      query = query.eq("metadata->>category", category);
    } else if (interestSlugs.length > 0) {
      // 사용자의 관심사 기반 필터링
      query = query.in("metadata->>category", interestSlugs);
    }
    // 관심사가 없거나 카테고리가 지정되지 않은 경우 모든 뉴스 조회

    const { data: newsData, error: newsError } = await query;

    if (newsError) {
      console.error("뉴스 조회 실패:", newsError);
      // 오류 발생 시 빈 배열 반환
      const emptyResponse: NewsListResponse = {
        news: [],
        subscription: await checkSubscription(userId)
      };
      return Response.json(emptyResponse);
    }

    // 구독 상태 확인
    const subscription = await checkSubscription(userId);

    // 응답 데이터 구성
    const news: NewsListItem[] = (newsData || []).map(item => ({
      id: item.id,
      title: item.title,
      category: item.metadata?.category || "기타",
      published_at: item.published_at,
      analysis: item.news_analysis_levels && item.news_analysis_levels[0] ? {
        level: item.news_analysis_levels[0].level,
        easy_title: item.news_analysis_levels[0].easy_title,
        summary: item.news_analysis_levels[0].summary,
        worst_scenario: item.news_analysis_levels[0].worst_scenario,
        should_blur: !subscription.active // 무료 체험 중이 아니면 블러 처리
      } : undefined
    }));

    const response: NewsListResponse = {
      news,
      subscription
    };

    return Response.json(response);

  } catch (error) {
    console.error("뉴스 목록 조회 중 오류 발생:", error);
    return Response.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "로그인이 필요합니다" },
      { status: 401 },
    );
  }

  return handleGet(request, userId);
}