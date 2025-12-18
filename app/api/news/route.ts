import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { mockNewsData } from "@/lib/mock/news";

function isSchemaCacheMissingTable(message?: string) {
  if (!message) return false;
  return message.includes("schema cache") && message.includes("Could not find the table");
}

function shouldUseMockNews() {
  // ✅ A 전략: UI 먼저 개발
  // 환경변수 USE_MOCK_NEWS가 없으면 기본값은 true(목데이터 모드).
  // 나중에 DB를 붙이고 싶으면 .env.local에 USE_MOCK_NEWS=false 로 바꾸면 됨.
  return (process.env.USE_MOCK_NEWS ?? "true") !== "false";
}

function clampLevel(level: unknown): 1 | 2 | 3 {
  const n = Number(level);
  if (n === 1) return 1;
  if (n === 3) return 3;
  return 2;
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");
    const categoryParam = url.searchParams.get("category"); // slug 또는 null
    const limitParam = url.searchParams.get("limit");

    // 날짜 파싱 (기본값: 오늘)
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    const startIso = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0).toISOString();
    const endIso = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1, 0, 0, 0).toISOString();

    const rawLimit = Number(limitParam ?? 5);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 20) : 5;

    console.info("[API][NEWS] request", {
      clerkUserId: userId,
      date: targetDate.toISOString().split('T')[0],
      category: categoryParam ?? "(none)",
      limit,
    });

    // Clerk에서 유저 레벨 가져오기 (없으면 Lv.2)
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const level = clampLevel((clerkUser.unsafeMetadata as any)?.level);
    const clerkInterestsRaw = (clerkUser.unsafeMetadata as any)?.interests;
    const clerkInterestSlugs = Array.isArray(clerkInterestsRaw)
      ? clerkInterestsRaw.filter((s: unknown): s is string => typeof s === "string" && s.length > 0)
      : [];

    const useMock = shouldUseMockNews();
    console.info("[API][NEWS] mode", { useMock });

    // ✅ 스텁 API 모드: DB 없이도 UI가 항상 동작해야 함
    // - Supabase 환경변수/테이블 유무와 무관하게 목데이터로 응답
    if (useMock) {
      const allowedCategories = categoryParam
        ? clerkInterestSlugs.filter((s) => s === categoryParam)
        : clerkInterestSlugs;

      // 온보딩(관심사) 미완료면 빈 결과
      if (allowedCategories.length === 0) {
        console.info("[API][NEWS][MOCK] no allowed categories -> empty");
        return NextResponse.json({
          news: [],
          subscription: { active: true, days_remaining: 0 },
          hint: "온보딩 관심사가 없어서(또는 선택한 카테고리가 관심사에 없어서) 뉴스가 비어있어요.",
        });
      }

      const startIso = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        0,
        0,
        0
      ).toISOString();
      const endIso = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate() + 1,
        0,
        0,
        0
      ).toISOString();

      // 날짜 + 관심사(+선택카테고리) 필터
      let items = mockNewsData
        .filter((n) => n.published_at >= startIso && n.published_at < endIso)
        .filter((n) => allowedCategories.includes(n.category));

      // 레벨 필터 (목데이터가 특정 레벨만 있을 수 있어서, 없으면 필터를 풀어준다)
      const levelFiltered = items.filter((n) => n.analysis.level === level);
      if (levelFiltered.length > 0) items = levelFiltered;

      items = items.slice(0, limit);

      console.info("[API][NEWS][MOCK] response", {
        count: items.length,
        level,
        categories: allowedCategories,
      });

      return NextResponse.json({
        news: items.map((n) => ({
          id: n.id,
          title: n.title,
          category: n.category,
          published_at: n.published_at,
          source: n.source,
          analysis: {
            level: n.analysis.level,
            easy_title: n.analysis.easy_title,
            summary: n.analysis.summary,
            worst_scenario: n.analysis.worst_scenario,
            user_action_tip: n.analysis.user_action_tip,
            should_blur: n.analysis.should_blur,
          },
        })),
        subscription: {
          active: true,
          days_remaining: items[0]?.subscription?.days_remaining ?? 0,
        },
      });
    }

    const supabase = getServiceRoleClient();

    // Supabase users.id 조회 (clerk_id 매핑)
    const { data: dbUser, error: dbUserError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (dbUserError || !dbUser?.id) {
      console.warn("[API][NEWS] users row not found. Did you call /api/sync-user?", {
        clerkUserId: userId,
        error: dbUserError?.message,
      });
      return NextResponse.json(
        {
          error: "User not synced",
          hint: "Call POST /api/sync-user after login to create users row in Supabase.",
        },
        { status: 404 }
      );
    }

    // 관심사가 없으면 빈 배열 반환
    // ✅ 중요: 현재 온보딩 데이터는 Clerk unsafeMetadata에 저장됨.
    // Supabase user_interests 테이블이 없어도(스키마 미적용) 오늘의 뉴스가 깨지지 않도록
    // Clerk 메타데이터 기반으로 필터링한다.
    if (clerkInterestSlugs.length === 0) {
      console.info("[API][NEWS] no interests -> empty result", {
        userId: dbUser.id,
      });
      return NextResponse.json({ news: [] });
    }

    // categoryParam이 있으면 관심사+category 교집합으로 줄임
    const allowedCategories = categoryParam
      ? clerkInterestSlugs.filter((s) => s === categoryParam)
      : clerkInterestSlugs;

    if (allowedCategories.length === 0) {
      console.info("[API][NEWS] category not in user interests -> empty result", {
        userId: dbUser.id,
        category: categoryParam,
      });
      return NextResponse.json({ news: [] });
    }

    // 구독 상태 확인 (Paywall 로직용)
    let isActive = true;
    let daysRemaining = 0;
    try {
      const { data: subscription, error: subError } = await supabase
        .from("subscriptions")
        .select("active, started_at, ends_at")
        .eq("user_id", dbUser.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (subError) {
        // subscriptions 테이블이 아직 없을 수 있으므로(개발 초기) 조용히 폴백
        console.warn("[API][NEWS] subscription lookup failed (fallback)", { error: subError.message });
      } else {
        const now = new Date();
        isActive = Boolean(subscription?.active) && new Date(subscription.ends_at) > now;
        daysRemaining =
          isActive && subscription
            ? Math.ceil((new Date(subscription.ends_at).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            : 0;
      }
    } catch (e: any) {
      console.warn("[API][NEWS] subscription lookup exception (fallback)", { message: e?.message });
    }

    // 뉴스 + 레벨별 분석 조인
    const { data: rows, error } = await supabase
      .from("news")
      .select(
        [
          "id",
          "title",
          "url",
          "published_at",
          "metadata",
          "sources(source_id)",
          "news_analysis_levels!inner(level,easy_title,summary,worst_scenario,user_action_tip,action_blurred)",
        ].join(",")
      )
      .gte("published_at", startIso)
      .lt("published_at", endIso)
      .in("metadata->>category", allowedCategories)
      .eq("news_analysis_levels.level", level)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[API][NEWS] query error", { error: error.message });

      // DB 스키마가 아직 적용되지 않은 개발 초기에는 500 대신 "빈 결과 + 힌트"로 폴백
      if (isSchemaCacheMissingTable(error.message)) {
        return NextResponse.json({
          news: [],
          subscription: { active: isActive, days_remaining: daysRemaining },
          hint: "Supabase에 news 관련 테이블이 아직 적용되지 않았습니다. 마이그레이션/스키마를 적용해주세요.",
        });
      }

      return NextResponse.json({ error: "Failed to load news" }, { status: 500 });
    }

    const news = (rows ?? []).map((r: any) => {
      const analysis = Array.isArray(r.news_analysis_levels) ? r.news_analysis_levels[0] : r.news_analysis_levels;
      const category = r?.metadata?.category ?? null;

      return {
        id: r.id,
        title: r.title,
        category,
        published_at: r.published_at,
        source: r?.sources?.source_id ?? "Unknown",
        analysis: {
          level: analysis?.level ?? level,
          easy_title: analysis?.easy_title ?? "",
          summary: analysis?.summary ?? "",
          worst_scenario: analysis?.worst_scenario ?? "",
          user_action_tip: analysis?.user_action_tip ?? "",
          should_blur: Boolean(analysis?.action_blurred ?? false),
        },
      };
    });

    console.info("[API][NEWS] response", {
      date: targetDate.toISOString().split('T')[0],
      count: news.length,
      level,
      isActive,
      daysRemaining,
    });

    return NextResponse.json({
      news,
      subscription: {
        active: isActive,
        days_remaining: daysRemaining,
      },
    });
  } catch (e: any) {
    console.error("[API][NEWS] unexpected error", { message: e?.message });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}