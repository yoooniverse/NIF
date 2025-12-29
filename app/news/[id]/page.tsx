"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Ticket } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import NewsSummary from "../../../components/news/news-summary";
import WorstScenario from "../../../components/news/worst-scenario";
import ActionItem from "../../../components/news/action-item";
import NewsFooter from "../../../components/news/news-footer";
import BoardingPassModal from "../../../components/news/BoardingPassModal";
import { FlightViewBackground } from '@/components/landing/FlightViewBackground';
import { getSubscriptionStatus } from '@/lib/subscription';

interface NewsDetail {
  id: string;
  title: string;
  source: string;
  url: string;
  analysis: {
    easy_title: string;
    summary: string;
    worst_scenario: string;
    user_action_tip: string;
    should_blur: boolean;
  };
}

export default function NewsDetailPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = params?.id;
  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // URL 파라미터에서 정보 가져오기
  const fromPage = searchParams.get('from') as 'today' | 'monthly' | null;
  const category = searchParams.get('category');


  useEffect(() => {
    if (!id) return;

    const fetchNews = async () => {
      try {
        console.info("[NEWS_DETAIL] fetching news", { id, fromPage, category });

        // API에서 뉴스 상세 정보 가져오기
        const response = await fetch(`/api/news/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        console.info("[NEWS_DETAIL] news loaded", data);
        setNews(data);
      } catch (error) {
        console.error("[NEWS_DETAIL] fetch error", error);
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id, fromPage, category]);

  // 동적 제목 생성
  const getPageTitle = () => {
    if (category) {
      return `${category} 뉴스`;
    }
    return '오늘의 뉴스';
  };

  const getPageSubtitle = () => {
    if (category) {
      return '카테고리 뉴스 해설을 확인해보세요';
    }
    return '뉴스 해설을 확인해보세요';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050814] flex items-center justify-center">
        <div className="text-white text-lg">뉴스를 불러오는 중...</div>
      </div>
    );
  }

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
    <div className="relative min-h-screen bg-[#050814] text-white overflow-hidden">
      {/* 우주 배경 (비행기 뷰) */}
      <FlightViewBackground />

      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-6 pt-8 pb-16">
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
              border border-white/20
              bg-white/10 backdrop-blur
              shadow-sm
              flex items-center justify-center
              hover:bg-white/20
              transition
            "
            aria-label="뒤로가기"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <div className="pt-1 flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {getPageTitle()}
            </h1>
            <p className="mt-1 text-white/70 text-base sm:text-lg">
              {getPageSubtitle()}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const status = getSubscriptionStatus(user);
              console.log("[NEWS_DETAIL] Click Boarding Pass. User:", user?.id, "FullUser:", user, "Status:", status);
              setIsBoardingPassOpen(true);
            }}
            className="
              h-12 px-4
              rounded-2xl
              border border-white/20
              bg-white/10 backdrop-blur
              shadow-sm
              flex items-center gap-2
              hover:bg-white/20
              transition
              text-white
            "
          >
            <Ticket className="h-5 w-5" />
            <span className="text-sm font-medium">Boarding Pass</span>
          </button>
        </div>

        <div className="mt-10 space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white px-7 py-6">
            <div className="text-sm text-gray-600">{news.source}</div>
            <div className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
              {news.title}
            </div>
          </div>

          <NewsSummary summary={news.analysis.summary} />
          <WorstScenario text={news.analysis.worst_scenario} />
          <ActionItem text={news.analysis.user_action_tip} shouldBlur={news.analysis.should_blur} />
          <NewsFooter source={news.source} url={news.url} />
        </div>
      </div>

      {/* Boarding Pass Modal */}
      <BoardingPassModal
        isOpen={isBoardingPassOpen}
        onClose={() => setIsBoardingPassOpen(false)}
        newsTitle="News Insight"
        economicIndex="NIF-001"
        passengerName={
          user ? (
            user.fullName ||
            `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
            user.username ||
            user.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
            'PREMIUM MEMBER'
          ) : 'PREMIUM MEMBER'
        }
        subscriptionStatus={getSubscriptionStatus(user)}
      />
    </div>
  );
}
