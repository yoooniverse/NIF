import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

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

    // 유저 관심사(slug) 조회 (이달의 뉴스는 관심사 기반 필터가 기본)
    const { data: interestRows, error: interestError } = await supabase
      .from("user_interests")
      .select("interests!inner(slug)")
      .eq("user_id", dbUser.id);

    if (interestError) {
      console.error("[API][NEWS_MONTHLY] failed to load user interests", {
        userId: dbUser.id,
        error: interestError.message,
      });
      return NextResponse.json({ error: "Failed to load interests" }, { status: 500 });
    }

    const interestSlugs = (interestRows ?? [])
      .map((r: any) => r?.interests?.slug)
      .filter((s: unknown): s is string => typeof s === "string" && s.length > 0);

    // 관심사가 없으면 빈 배열 반환
    if (interestSlugs.length === 0) {
      console.info("[API][NEWS_MONTHLY] no interests -> empty result", {
        userId: dbUser.id,
      });
      return NextResponse.json({ month: monthKey, news: [] });
    }

    // categoryParam이 있으면 관심사+category 교집합으로 줄임
    const normalizedCategory = categoryParam && categoryParam !== "all" ? categoryParam : null;
    const allowedCategories = normalizedCategory ? interestSlugs.filter((s) => s === normalizedCategory) : interestSlugs;

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
