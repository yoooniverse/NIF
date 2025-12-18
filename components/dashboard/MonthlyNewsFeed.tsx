import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import type { NewsCategory, NewsItem } from "@/lib/mock/news";
import { mockNewsData } from "@/lib/mock/news";
import NewsSummary from "@/components/news/news-summary";
import WorstScenario from "@/components/news/worst-scenario";
import ActionItem from "@/components/news/action-item";
import NewsFooter from "@/components/news/news-footer";

type MonthlyNewsCategory = "all" | NewsCategory;

type MonthKey = `${number}-${string}`; // e.g. 2025-12

type MonthlyNewsDisplayItem = NewsItem;

type MonthlyNewsApiResponse = {
  month: string;
  news: Array<{
    id: string;
    title: string;
    url: string;
    published_at: string;
    category: string | null;
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
  error?: string;
  hint?: string;
};

function formatKoreanDate(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function monthKeyFromIso(iso: string): MonthKey {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}` as MonthKey;
}

function monthLabel(monthKey: MonthKey) {
  const [yyyy, mm] = monthKey.split("-");
  return `${yyyy}년 ${Number(mm)}월`;
}

function categoryLabel(category: MonthlyNewsCategory) {
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

function mapCategoryToNewsCategory(category: MonthlyNewsCategory): NewsItem["category"] | null {
  if (category === "all") return null;
  return category;
}

export default function MonthlyNewsFeed({ onBack }: { onBack?: () => void }) {
  console.info("[MONTHLY_NEWS] 이달의 뉴스 화면 로드됨 - News In Flight");

  const [selectedCategory, setSelectedCategory] = useState<MonthlyNewsCategory>("all");
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [items, setItems] = useState<MonthlyNewsDisplayItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const availableMonths = useMemo(() => {
    // API 기준으로는 “사용 가능한 월”을 미리 알기 어렵기 때문에,
    // UX로는 최근 12개월을 제공한다. (필요하면 나중에 월 목록 API로 대체)
    const now = new Date();
    const months: MonthKey[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      months.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}` as MonthKey);
    }
    return months;
  }, []);

  const [activeMonth, setActiveMonth] = useState<MonthKey>(() => availableMonths[0] ?? ("1970-01" as MonthKey));

  const canGoPrev = useMemo(() => {
    const idx = availableMonths.indexOf(activeMonth);
    return idx >= 0 && idx < availableMonths.length - 1;
  }, [activeMonth, availableMonths]);

  const canGoNext = useMemo(() => {
    const idx = availableMonths.indexOf(activeMonth);
    return idx > 0;
  }, [activeMonth, availableMonths]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setLoadError(null);

      const categoryForApi = selectedCategory === "all" ? "all" : selectedCategory;

      console.info("[MONTHLY_NEWS] fetch monthly news", {
        month: activeMonth,
        category: categoryForApi,
      });

      try {
        const res = await fetch(
          `/api/news/monthly?month=${encodeURIComponent(activeMonth)}&category=${encodeURIComponent(categoryForApi)}&limit=50`,
          { method: "GET" }
        );

        const json = (await res.json()) as MonthlyNewsApiResponse;

        if (!res.ok) {
          const message = json?.error ?? `월간 뉴스 로딩 실패 (${res.status})`;
          throw new Error(message);
        }

        const apiItems: MonthlyNewsDisplayItem[] = (json.news ?? []).map((n) => {
          return {
            id: n.id,
            title: n.title,
            category: (n.category as any) ?? "stock",
            url: n.url,
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
            subscription: {
              active: true,
              days_remaining: 0,
            },
          } as MonthlyNewsDisplayItem;
        });

        if (cancelled) return;

        if (apiItems.length > 0) {
          console.info("[MONTHLY_NEWS] loaded from API", { count: apiItems.length });
          setItems(apiItems);
          return;
        }

        // API 데이터가 없으면(개발 초기) 목데이터로 폴백해서 UI는 계속 확인 가능하게 한다.
        console.info("[MONTHLY_NEWS] empty from API -> fallback to mock data");
        const levelFiltered = mockNewsData.filter((news) => news.analysis.level === 2);
        const monthFiltered = levelFiltered.filter((news) => monthKeyFromIso(news.published_at) === activeMonth);
        const target = mapCategoryToNewsCategory(selectedCategory);
        const fallback = target ? monthFiltered.filter((n) => n.category === target) : monthFiltered;
        setItems(fallback as MonthlyNewsDisplayItem[]);
      } catch (e: any) {
        if (cancelled) return;
        console.error("[MONTHLY_NEWS] load error", { message: e?.message });
        setLoadError(e?.message ?? "월간 뉴스 로딩 중 오류가 발생했어요.");

        // 에러 시에도 목데이터로 폴백(개발/데모용)
        const levelFiltered = mockNewsData.filter((news) => news.analysis.level === 2);
        const monthFiltered = levelFiltered.filter((news) => monthKeyFromIso(news.published_at) === activeMonth);
        const target = mapCategoryToNewsCategory(selectedCategory);
        const fallback = target ? monthFiltered.filter((n) => n.category === target) : monthFiltered;
        setItems(fallback as MonthlyNewsDisplayItem[]);
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
  }, [activeMonth, selectedCategory, selectedNewsId]);

  const selectedNews = useMemo(() => {
    if (!selectedNewsId) return null;
    return items.find((n) => n.id === selectedNewsId) ?? null;
  }, [items, selectedNewsId]);

  return (
    <div className="h-full w-full bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* 얇은 라인 패턴 (오늘의 뉴스와 동일한 구성) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.14]">
        <div className="absolute left-0 top-24 h-px w-full bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
        <div className="absolute left-0 top-56 h-px w-full bg-gradient-to-r from-transparent via-sky-300/55 to-transparent" />
        <div className="absolute left-0 bottom-40 h-px w-full bg-gradient-to-r from-transparent via-sky-400/55 to-transparent" />
        <div className="absolute left-12 top-0 h-full w-px bg-gradient-to-b from-transparent via-sky-400/45 to-transparent" />
        <div className="absolute right-24 top-0 h-full w-px bg-gradient-to-b from-transparent via-sky-300/45 to-transparent" />
      </div>

      {/* 스크롤 컨테이너 */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="mx-auto w-full max-w-[1100px] px-6 pt-8 pb-16">
          {/* 상단 헤더 */}
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => {
                // 상세 화면에서는 리스트로, 리스트에서는 대시보드로
                if (selectedNewsId) {
                  console.info("[MONTHLY_NEWS] click: back (detail -> list)");
                  setSelectedNewsId(null);
                  return;
                }
                console.info("[MONTHLY_NEWS] click: back (list -> dashboard)");
                onBack?.();
              }}
              className="
                h-12 w-12
                rounded-2xl
                border border-sky-200/80
                bg-white/55 backdrop-blur
                shadow-sm
                flex items-center justify-center
                hover:bg-white/70
                transition
              "
              aria-label="뒤로가기"
            >
              <ArrowLeft className="h-5 w-5 text-slate-900" />
            </button>

            <div className="pt-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">이달의 뉴스</h1>
              <p className="mt-1 text-slate-600 text-base sm:text-lg">
                {selectedNewsId ? "뉴스를 쉽게 해설해드릴게요" : "이번 달 흐름을 한눈에 확인해보세요"}
              </p>

              {/* 월 네비게이션 (월별 그룹화 + 현재 월 우선) */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  disabled={!canGoPrev}
                  onClick={() => {
                    const idx = availableMonths.indexOf(activeMonth);
                    const nextMonth = availableMonths[idx + 1];
                    if (!nextMonth) return;
                    console.info("[MONTHLY_NEWS] click: month prev", { from: activeMonth, to: nextMonth });
                    setSelectedNewsId(null);
                    setActiveMonth(nextMonth);
                  }}
                  className={
                    "h-10 w-10 rounded-2xl border bg-white/55 backdrop-blur flex items-center justify-center transition " +
                    (canGoPrev
                      ? "border-sky-200/80 hover:bg-white/70"
                      : "border-slate-200/60 opacity-40 cursor-not-allowed")
                  }
                  aria-label="이전 달"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="px-4 py-2 rounded-2xl border border-sky-200/80 bg-white/55 backdrop-blur text-sm font-semibold text-slate-900">
                  {monthLabel(activeMonth)}
                </div>

                <button
                  type="button"
                  disabled={!canGoNext}
                  onClick={() => {
                    const idx = availableMonths.indexOf(activeMonth);
                    const prevMonth = availableMonths[idx - 1];
                    if (!prevMonth) return;
                    console.info("[MONTHLY_NEWS] click: month next", { from: activeMonth, to: prevMonth });
                    setSelectedNewsId(null);
                    setActiveMonth(prevMonth);
                  }}
                  className={
                    "h-10 w-10 rounded-2xl border bg-white/55 backdrop-blur flex items-center justify-center transition " +
                    (canGoNext
                      ? "border-sky-200/80 hover:bg-white/70"
                      : "border-slate-200/60 opacity-40 cursor-not-allowed")
                  }
                  aria-label="다음 달"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 상세 화면 */}
          {selectedNews ? (
            <div className="mt-10 space-y-6">
              <div className="rounded-3xl border border-sky-200/60 bg-white/45 backdrop-blur px-7 py-6">
                <div className="text-sm text-slate-600">
                  {formatKoreanDate(selectedNews.published_at)} · {selectedNews.source}
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">{selectedNews.title}</div>
              </div>

              <NewsSummary easyTitle={selectedNews.analysis.easy_title} summary={selectedNews.analysis.summary} />
              <WorstScenario text={selectedNews.analysis.worst_scenario} />
              <ActionItem text={selectedNews.analysis.user_action_tip} shouldBlur={selectedNews.analysis.should_blur} />
              <NewsFooter source={selectedNews.source} url={selectedNews.url} />
            </div>
          ) : (
            <>
              {/* 필터 버튼 (오늘의 뉴스 섹션처럼) */}
              <div className="mt-7 flex flex-wrap gap-3">
                {(["all", "real-estate", "stock", "exchange", "etf", "crypto"] as const).map((c) => {
                  const isSelected = selectedCategory === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        console.info("[MONTHLY_NEWS] click: filter", { category: c, month: activeMonth });
                        setSelectedCategory(c);
                      }}
                      className={
                        "h-11 px-6 rounded-2xl border text-sm font-semibold transition " +
                        (isSelected
                          ? "border-sky-500 bg-sky-50/80 text-slate-900 shadow-[0_0_0_3px_rgba(14,165,233,0.16)]"
                          : "border-sky-200/70 bg-white/40 text-slate-700 hover:bg-white/60")
                      }
                    >
                      {categoryLabel(c)}
                    </button>
                  );
                })}
              </div>

              {/* 카드 리스트 */}
              <div className="mt-10 space-y-6">
                {isLoading && (
                  <div className="rounded-3xl border border-sky-200/60 bg-white/45 px-8 py-8 text-slate-700">
                    불러오는 중...
                  </div>
                )}

                {loadError && (
                  <div className="rounded-3xl border border-red-200/60 bg-white/45 px-8 py-8 text-slate-700">
                    {loadError}
                  </div>
                )}

                {items.map((news) => {
                  return (
                    <button
                      key={news.id}
                      type="button"
                      onClick={() => {
                        console.info("[MONTHLY_NEWS] click: news card -> detail", {
                          id: news.id,
                          category: news.category,
                          month: activeMonth,
                        });
                        setSelectedNewsId(news.id);
                      }}
                      className="
                        w-full text-left
                        rounded-3xl
                        border border-sky-200/60
                        bg-white/45 backdrop-blur
                        px-8 py-7
                        shadow-[0_18px_50px_-40px_rgba(2,6,23,0.35)]
                        hover:bg-white/55
                        transition
                      "
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
                  <div className="rounded-3xl border border-sky-200/60 bg-white/45 px-8 py-10 text-slate-700">
                    이 달에는 선택한 관심 자산에 해당하는 뉴스가 아직 없어요.
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
