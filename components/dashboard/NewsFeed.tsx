import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { NewsItem } from "@/lib/mock/news";
import { mockNewsData } from "@/lib/mock/news";
import NewsSummary from "@/components/news/news-summary";
import WorstScenario from "@/components/news/worst-scenario";
import ActionItem from "@/components/news/action-item";
import NewsFooter from "@/components/news/news-footer";

type NewsFeedCategory = "all" | "real-estate" | "exchange" | "etf" | "crypto";

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

// NewsFeed 컴포넌트
export default function NewsFeed({ onBack }: { onBack?: () => void }) {
  console.info("[NEWS_FEED] 오늘의 뉴스 페이지 로드됨 - News In Flight");

  const [selectedCategory, setSelectedCategory] = useState<NewsFeedCategory>("all");
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  const filteredNews = useMemo(() => {
    // 유저 레벨 기반 필터링 (현재는 Lv.2만 표시)
    const levelFiltered = mockNewsData.filter((news) => news.analysis.level === 2);

    const target = mapCategoryToNewsCategory(selectedCategory);
    if (!target) return levelFiltered;
    return levelFiltered.filter((n) => n.category === target);
  }, [selectedCategory]);

  const selectedNews = useMemo(() => {
    if (!selectedNewsId) return null;
    return mockNewsData.find((n) => n.id === selectedNewsId) ?? null;
  }, [selectedNewsId]);

  return (
    <div className="h-full w-full bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* 지도 느낌의 얇은 라인 패턴(샴페인 골드 유지) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.14]">
        <div className="absolute left-0 top-24 h-px w-full bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
        <div className="absolute left-0 top-56 h-px w-full bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
        <div className="absolute left-0 bottom-40 h-px w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        <div className="absolute left-12 top-0 h-full w-px bg-gradient-to-b from-transparent via-amber-400/50 to-transparent" />
        <div className="absolute right-24 top-0 h-full w-px bg-gradient-to-b from-transparent via-amber-300/50 to-transparent" />
      </div>

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
              className="
                h-12 w-12
                rounded-2xl
                border border-amber-200/80
                bg-white/50 backdrop-blur
                shadow-sm
                flex items-center justify-center
                hover:bg-white/65
                transition
              "
              aria-label="뒤로가기"
            >
              <ArrowLeft className="h-5 w-5 text-amber-900" />
            </button>

            <div className="pt-1">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-amber-950">
                오늘의 뉴스
              </h1>
              <p className="mt-1 text-amber-800/80 text-base sm:text-lg">
                {selectedNewsId ? "뉴스를 쉽게 해설해드릴게요" : "관심 자산별로 확인해보세요"}
              </p>
            </div>
          </div>

          {/* 상세 화면 */}
          {selectedNews ? (
            <div className="mt-10 space-y-6">
              <div className="rounded-3xl border border-amber-200/60 bg-white/35 backdrop-blur px-7 py-6">
                <div className="text-sm text-amber-900/70">
                  {formatKoreanDate(selectedNews.published_at)} · {selectedNews.source}
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-bold text-amber-950">
                  {selectedNews.title}
                </div>
              </div>

              <NewsSummary
                easyTitle={selectedNews.analysis.easy_title}
                summary={selectedNews.analysis.summary}
              />
              <WorstScenario text={selectedNews.analysis.worst_scenario} />
              <ActionItem
                text={selectedNews.analysis.user_action_tip}
                shouldBlur={selectedNews.analysis.should_blur}
              />
              <NewsFooter source={selectedNews.source} url={selectedNews.url} />
            </div>
          ) : (
            <>
              {/* 필터 칩 (스크린샷 위치/정렬) */}
              <div className="mt-7 flex flex-wrap gap-3">
                {(["all", "real-estate", "exchange", "etf", "crypto"] as const).map((c) => {
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
                            ? "border-amber-500 bg-amber-50/70 text-amber-900 shadow-[0_0_0_3px_rgba(245,158,11,0.18)]"
                            : "border-amber-200/70 bg-white/35 text-amber-900/80 hover:bg-white/55"
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
                {filteredNews.map((news) => {
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
                      className="
                        w-full text-left
                        rounded-3xl
                        border border-amber-200/60
                        bg-white/35 backdrop-blur
                        px-8 py-7
                        shadow-[0_18px_50px_-40px_rgba(120,53,15,0.55)]
                        hover:bg-white/45
                        transition
                      "
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-amber-900/70">
                            <span>{formatKoreanDate(news.published_at)}</span>
                            <span className="opacity-60">•</span>
                            <span>{news.source}</span>
                          </div>

                          <div className="mt-4 text-xl sm:text-2xl font-bold text-amber-950">
                            {news.title}
                          </div>

                          <div className="mt-3 text-amber-900/70 text-base leading-relaxed line-clamp-2">
                            {news.analysis.summary}
                          </div>
                        </div>

                        <div className="pt-1 text-amber-900/35">
                          <ChevronRight className="h-7 w-7" />
                        </div>
                      </div>
                    </button>
                  );
                })}

                {filteredNews.length === 0 && (
                  <div className="rounded-3xl border border-amber-200/60 bg-white/35 px-8 py-10 text-amber-900/75">
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