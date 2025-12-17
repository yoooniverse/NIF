"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import NewsSummary from "@/components/news/news-summary";
import WorstScenario from "@/components/news/worst-scenario";
import ActionItem from "@/components/news/action-item";
import NewsFooter from "@/components/news/news-footer";
import { getMockNewsById } from "@/lib/mock/news";

export default function NewsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const news = typeof id === "string" ? getMockNewsById(id) : null;

  console.info("[NEWS_DETAIL] page load", { id, found: Boolean(news) });

  if (!news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-12 w-12 rounded-2xl border border-amber-200/80 bg-white/50 backdrop-blur flex items-center justify-center"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="h-5 w-5 text-amber-900" />
          </button>
          <div className="mt-6 text-2xl font-bold text-amber-950">
            뉴스를 찾지 못했어요
          </div>
          <div className="mt-2 text-amber-900/70">
            잠시 후 다시 시도해주세요.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="mx-auto w-full max-w-[1100px] px-6 pt-8 pb-16">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() => {
              console.info("[NEWS_DETAIL] click: back");
              router.back();
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
              뉴스 해설을 확인해보세요
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <div className="rounded-3xl border border-amber-200/60 bg-white/35 backdrop-blur px-7 py-6">
            <div className="text-sm text-amber-900/70">{news.source}</div>
            <div className="mt-3 text-2xl sm:text-3xl font-bold text-amber-950">
              {news.title}
            </div>
          </div>

          <NewsSummary easyTitle={news.analysis.easy_title} summary={news.analysis.summary} />
          <WorstScenario text={news.analysis.worst_scenario} />
          <ActionItem text={news.analysis.user_action_tip} shouldBlur={news.analysis.should_blur} />
          <NewsFooter source={news.source} url={news.url} />
        </div>
      </div>
    </div>
  );
}

