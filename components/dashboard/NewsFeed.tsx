import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { NewsItem } from "@/lib/mock/news";
import { mockNewsData } from "@/lib/mock/news";
import NewsSummary from "@/components/news/news-summary";
import WorstScenario from "@/components/news/worst-scenario";
import ActionItem from "@/components/news/action-item";
import NewsFooter from "@/components/news/news-footer";

type NewsFeedCategory = "all" | "real-estate" | "stock" | "exchange" | "etf" | "crypto";

type NewsFeedVariant = "default" | "pearl";

function formatKoreanDate(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function categoryLabel(category: NewsFeedCategory) {
  switch (category) {
    case "all":
      return "전체";
    case "real-estate":
      return "부동산";
    case "stock":
      return "주식";
    case "exchange":
      return "환율";
    case "etf":
      return "ETF";
    case "crypto":
      return "가상화폐";
  }
}

function mapCategoryToNewsCategory(category: NewsFeedCategory): NewsItem["category"] | null {
  if (category === "all") return null;
  return category;
}

type NewsApiResponse = {
  news: Array<{
    id: string;
    title: string;
    category: string | null;
    published_at: string;
    source: string;
    analysis: {
      level: number;
      easy_title: string;
      summary: string;
      worst_scenario: string;
      user_action_tip: string;
      should_blur: boolean;
    };
  }>;
  subscription: {
    active: boolean;
    days_remaining: number;
  };
  error?: string;
  hint?: string;
};

// NewsFeed 컴포넌트
export default function NewsFeed({
  onBack,
  variant = "default",
}: {
  onBack?: () => void;
  variant?: NewsFeedVariant;
}) {
  console.info("[NEWS_FEED] 오늘의 뉴스 페이지 로드됨 - News In Flight");
  const isPearl = variant === "pearl";

  const [selectedCategory, setSelectedCategory] = useState<NewsFeedCategory>("all");
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setLoadError(null);

      const categoryForApi = selectedCategory === "all" ? undefined : selectedCategory;

      console.info("[NEWS_FEED] fetch today's news", {
        category: categoryForApi ?? "all",
      });

      try {
        const url = new URL("/api/news", window.location.origin);
        if (categoryForApi) {
          url.searchParams.set("category", categoryForApi);
        }
        url.searchParams.set("limit", "20");

        const res = await fetch(url.toString(), { method: "GET" });

        const json = (await res.json()) as NewsApiResponse;

        if (!res.ok) {
          const message = json?.error ?? `오늘의 뉴스 로딩 실패 (${res.status})`;
          throw new Error(message);
        }

        const apiItems: NewsItem[] = (json.news ?? []).map((n) => {
          return {
            id: n.id,
            title: n.title,
            category: (n.category as any) ?? "stock",
            url: "", // API에서 아직 제공하지 않음
            content: "",
            published_at: n.published_at,
            source: n.source ?? "Unknown",
            analysis: {
              level: n.analysis.level,
              easy_title: n.analysis.easy_title,
              summary: n.analysis.summary,
              worst_scenario: n.analysis.worst_scenario,
              user_action_tip: n.analysis.user_action_tip,
              should_blur: n.analysis.should_blur,
            },
            subscription: json.subscription,
          } as NewsItem;
        });

        if (cancelled) return;

        if (apiItems.length > 0) {
          console.info("[NEWS_FEED] loaded from API", { count: apiItems.length });
          setItems(apiItems);
          return;
        }

        // API 데이터가 없으면 목데이터로 폴백해서 UI는 계속 확인 가능하게 한다.
        console.info("[NEWS_FEED] empty from API -> fallback to mock data");
        const levelFiltered = mockNewsData.filter((news) => news.analysis.level === 2);
        const target = mapCategoryToNewsCategory(selectedCategory);
        const fallback = target ? levelFiltered.filter((n) => n.category === target) : levelFiltered;
        setItems(fallback as NewsItem[]);
      } catch (e: any) {
        if (cancelled) return;
        console.error("[NEWS_FEED] load error", { message: e?.message });
        setLoadError(e?.message ?? "오늘의 뉴스 로딩 중 오류가 발생했어요.");

        // 에러 시에도 목데이터로 폴백
        const levelFiltered = mockNewsData.filter((news) => news.analysis.level === 2);
        const target = mapCategoryToNewsCategory(selectedCategory);
        const fallback = target ? levelFiltered.filter((n) => n.category === target) : levelFiltered;
        setItems(fallback as NewsItem[]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    // 상세 화면에서는 리스트 갱신을 막아 UX를 안정적으로 유지
    if (!selectedNewsId) {
      void load();
    }

    return () => {
      cancelled = true;
    };
  }, [selectedCategory, selectedNewsId]);

  const selectedNews = useMemo(() => {
    if (!selectedNewsId) return null;
    return items.find((n) => n.id === selectedNewsId) ?? null;
  }, [items, selectedNewsId]);

  return (
    <div
      className={
        isPearl
          ? // Pearl metal (단색)
            "h-full w-full bg-[#D7DCE3]"
          : "h-full w-full bg-gradient-to-br from-sky-50 via-white to-blue-50"
      }
    >
      {/* 지도 느낌의 얇은 라인 패턴 */}
      {!isPearl && <div className="pointer-events-none absolute inset-0 opacity-[0.14]">
        <div
          className={
            "absolute left-0 top-24 h-px w-full bg-gradient-to-r from-transparent " +
            (isPearl ? "via-slate-500/35" : "via-sky-400/60") +
            " to-transparent"
          }
        />
        <div
          className={
            "absolute left-0 top-56 h-px w-full bg-gradient-to-r from-transparent " +
            (isPearl ? "via-slate-400/30" : "via-sky-300/55") +
            " to-transparent"
          }
        />
        <div
          className={
            "absolute left-0 bottom-40 h-px w-full bg-gradient-to-r from-transparent " +
            (isPearl ? "via-slate-500/30" : "via-sky-400/55") +
            " to-transparent"
          }
        />
        <div
          className={
            "absolute left-12 top-0 h-full w-px bg-gradient-to-b from-transparent " +
            (isPearl ? "via-slate-500/25" : "via-sky-400/45") +
            " to-transparent"
          }
        />
        <div
          className={
            "absolute right-24 top-0 h-full w-px bg-gradient-to-b from-transparent " +
            (isPearl ? "via-slate-400/22" : "via-sky-300/45") +
            " to-transparent"
          }
        />
      </div>}

      {/* 스크롤 컨테이너 (이 화면만 스크롤 가능) */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="mx-auto w-full max-w-[1100px] px-6 pt-8 pb-16">
          {/* 상단 좌측 헤더 (스크린샷 위치 동일) */}
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => {
                // 상세 화면에서는 리스트로, 리스트에서는 대시보드로
                if (selectedNewsId) {
                  console.info("[NEWS_FEED] click: back (detail -> list)");
                  setSelectedNewsId(null);
                  return;
                }
                console.info("[NEWS_FEED] click: back (list -> dashboard)");
                onBack?.();
              }}
              className={
                "h-12 w-12 rounded-2xl border shadow-sm flex items-center justify-center transition " +
                (isPearl
                  ? "border-slate-200 bg-white hover:bg-slate-50"
                  : "border-sky-200/80 bg-white/55 backdrop-blur hover:bg-white/70")
              }
              aria-label="뒤로가기"
            >
              <ArrowLeft className="h-5 w-5 text-slate-900" />
            </button>

            <div className="pt-1">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">오늘의 뉴스</h1>
              <p className="mt-1 text-slate-600 text-base sm:text-lg">
                {selectedNewsId ? "뉴스를 쉽게 해설해드릴게요" : "관심 자산별로 확인해보세요"}
              </p>
            </div>
          </div>

          {/* 상세 화면 */}
          {selectedNews ? (
            <div className="mt-10 space-y-6">
              <div
                className={
                  "rounded-3xl border px-7 py-6 " +
                  (isPearl ? "border-slate-200/80 bg-white" : "border-sky-200/60 bg-white/45 backdrop-blur")
                }
              >
                <div className="text-sm text-slate-600">
                  {formatKoreanDate(selectedNews.published_at)} · {selectedNews.source}
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">{selectedNews.title}</div>
              </div>

              <NewsSummary
                easyTitle={selectedNews.analysis.easy_title}
                summary={selectedNews.analysis.summary}
                variant={isPearl ? "pearl" : "default"}
              />
              <WorstScenario text={selectedNews.analysis.worst_scenario} variant={isPearl ? "pearl" : "default"} />
              <ActionItem
                text={selectedNews.analysis.user_action_tip}
                shouldBlur={selectedNews.analysis.should_blur}
                variant={isPearl ? "pearl" : "default"}
              />
              <NewsFooter source={selectedNews.source} url={selectedNews.url} variant={isPearl ? "pearl" : "default"} />
            </div>
          ) : (
            <>
              {/* 필터 칩 (스크린샷 위치/정렬) */}
              <div className="mt-7 flex flex-wrap gap-3">
                {(["all", "real-estate", "stock", "exchange", "etf", "crypto"] as const).map((c) => {
                  const isSelected = selectedCategory === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        console.info("[NEWS_FEED] click: filter", { category: c });
                        setSelectedCategory(c);
                      }}
                      className={`
                        h-11 px-6
                        rounded-2xl
                        border
                        text-sm font-semibold
                        transition
                        ${
                          isSelected
                            ? isPearl
                              ? "border-slate-400 bg-white text-slate-900 shadow-[0_0_0_3px_rgba(100,116,139,0.16)]"
                              : "border-sky-500 bg-sky-50/80 text-slate-900 shadow-[0_0_0_3px_rgba(14,165,233,0.16)]"
                            : isPearl
                              ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              : "border-sky-200/70 bg-white/40 text-slate-700 hover:bg-white/60"
                        }
                      `}
                    >
                      {categoryLabel(c)}
                    </button>
                  );
                })}
              </div>

              {/* 카드 리스트 */}
              <div className="mt-10 space-y-6">
                {isLoading && (
                  <div
                    className={
                      "rounded-3xl border px-8 py-8 text-slate-700 " +
                      (isPearl ? "border-slate-200/80 bg-white" : "border-sky-200/60 bg-white/45")
                    }
                  >
                    불러오는 중...
                  </div>
                )}

                {loadError && (
                  <div
                    className={
                      "rounded-3xl border px-8 py-8 text-slate-700 " +
                      (isPearl ? "border-rose-200 bg-white" : "border-red-200/60 bg-white/45")
                    }
                  >
                    {loadError}
                  </div>
                )}

                {items.map((news) => {
                  return (
                    <button
                      key={news.id}
                      type="button"
                      onClick={() => {
                        console.info("[NEWS_FEED] click: news card -> detail", {
                          id: news.id,
                          category: news.category,
                        });
                        setSelectedNewsId(news.id);
                      }}
                      className={
                        "w-full text-left rounded-3xl border px-8 py-7 shadow-[0_18px_50px_-40px_rgba(2,6,23,0.35)] transition " +
                        (isPearl
                          ? "border-slate-200/80 bg-white hover:bg-slate-50"
                          : "border-sky-200/60 bg-white/45 backdrop-blur hover:bg-white/55")
                      }
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                            <span>{formatKoreanDate(news.published_at)}</span>
                            <span className="opacity-60">•</span>
                            <span>{news.source}</span>
                          </div>

                          <div className="mt-4 text-xl sm:text-2xl font-bold text-slate-900">{news.title}</div>

                          <div className="mt-3 text-slate-700/80 text-base leading-relaxed line-clamp-2">
                            {news.analysis.summary}
                          </div>
                        </div>

                        <div className="pt-1 text-slate-900/30">
                          <ChevronRight className="h-7 w-7" />
                        </div>
                      </div>
                    </button>
                  );
                })}

                {items.length === 0 && !isLoading && (
                  <div
                    className={
                      "rounded-3xl border px-8 py-10 text-slate-700 " +
                      (isPearl ? "border-slate-200/80 bg-white" : "border-sky-200/60 bg-white/45")
                    }
                  >
                    오늘은 선택한 관심 자산에 해당하는 뉴스가 아직 없어요.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}