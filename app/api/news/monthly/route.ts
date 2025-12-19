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

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const monthParam = url.searchParams.get("month");
    const categoryParam = url.searchParams.get("category"); // 'all' 또는 slug
    const limitParam = url.searchParams.get("limit");

    const { startIso, endIso, monthKey } = parseMonthOrNow(monthParam);

    const rawLimit = Number(limitParam ?? 50);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 200) : 50;

    console.info("[API][NEWS_MONTHLY] request", {
      clerkUserId: userId,
      month: monthKey,
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
    console.info("[API][NEWS_MONTHLY] mode", { useMock });

    // ✅ 스텁 API 모드: DB 없이도 UI가 항상 동작해야 함
    if (useMock) {
      const normalizedCategory = categoryParam && categoryParam !== "all" ? categoryParam : null;
      const allowedCategories = normalizedCategory
        ? clerkInterestSlugs.filter((s) => s === normalizedCategory)
        : clerkInterestSlugs;

      if (allowedCategories.length === 0) {
        console.info("[API][NEWS_MONTHLY][MOCK] no allowed categories -> empty");
        return NextResponse.json({
          month: monthKey,
          news: [],
          hint: "온보딩 관심사가 없어서(또는 선택한 카테고리가 관심사에 없어서) 뉴스가 비어있어요.",
        });
      }

      // 월 범위 + 관심사(+선택카테고리) 필터
      let items = mockNewsData
        .filter((n) => n.published_at >= startIso && n.published_at < endIso)
        .filter((n) => allowedCategories.includes(n.category));

      // 레벨 필터 (목데이터가 특정 레벨만 있을 수 있어서, 없으면 필터를 풀어준다)
      const levelFiltered = items.filter((n) => n.analysis.level === level);
      if (levelFiltered.length > 0) items = levelFiltered;

      items = items.slice(0, limit);

      console.info("[API][NEWS_MONTHLY][MOCK] response", {
        month: monthKey,
        count: items.length,
        level,
        categories: allowedCategories,
      });

      return NextResponse.json({
        month: monthKey,
        news: items.map((n) => ({
          id: n.id,
          title: n.title,
          url: n.url,
          published_at: n.published_at,
          category: n.category,
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
      console.warn("[API][NEWS_MONTHLY] users row not found. Did you call /api/sync-user?", {
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

    // ✅ 중요: 현재 온보딩 데이터는 Clerk unsafeMetadata에 저장됨.
    // Supabase의 user_interests 테이블이 아직 없거나(스키마 미적용) 비어 있어도
    // 이달의 뉴스 UI가 깨지지 않도록 Clerk 메타데이터를 기준으로 필터링한다.
    if (clerkInterestSlugs.length === 0) {
      console.info("[API][NEWS_MONTHLY] no interests -> empty result", {
        userId: dbUser.id,
      });
      return NextResponse.json({ month: monthKey, news: [] });
    }

    // categoryParam이 있으면 관심사+category 교집합으로 줄임
    const normalizedCategory = categoryParam && categoryParam !== "all" ? categoryParam : null;
    const allowedCategories = normalizedCategory
      ? clerkInterestSlugs.filter((s) => s === normalizedCategory)
      : clerkInterestSlugs;

    if (allowedCategories.length === 0) {
      console.info("[API][NEWS_MONTHLY] category not in user interests -> empty result", {
        userId: dbUser.id,
        category: normalizedCategory,
      });
      return NextResponse.json({ month: monthKey, news: [] });
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
      console.error("[API][NEWS_MONTHLY] query error", { error: error.message });

      // DB 스키마가 아직 적용되지 않은 개발 초기에는 500 대신 "빈 결과 + 힌트"로 폴백
      if (isSchemaCacheMissingTable(error.message)) {
        return NextResponse.json({
          month: monthKey,
          news: [],
          hint: "Supabase에 news 관련 테이블이 아직 적용되지 않았습니다. 마이그레이션/스키마를 적용해주세요.",
        });
      }

      return NextResponse.json({ error: "Failed to load monthly news" }, { status: 500 });
    }

    const news = (rows ?? []).map((r: any) => {
      const analysis = Array.isArray(r.news_analysis_levels) ? r.news_analysis_levels[0] : r.news_analysis_levels;
      const category = r?.metadata?.category ?? null;

      return {
        id: r.id,
        title: r.title,
        url: r.url,
        published_at: r.published_at,
        category,
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

    console.info("[API][NEWS_MONTHLY] response", {
      month: monthKey,
      count: news.length,
      level,
    });

    return NextResponse.json({ month: monthKey, news });
  } catch (e: any) {
    console.error("[API][NEWS_MONTHLY] unexpected error", { message: e?.message });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
