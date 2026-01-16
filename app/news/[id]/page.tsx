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

import { useSubscriptionStatus } from '@/lib/subscription';

interface NewsDetail {
  id: string;
  title: string;
  source: string;
  url: string;
  category: string; // 관심분야 (주식, 가상화폐, 부동산 등)
  analysis: {
    level: 1 | 2 | 3;
    title: string;
    content: string;
    worst_scenarios: string[];
    action_tips: string[];
    should_blur: boolean;
  };
}

export default function NewsDetailPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = params?.id;
  const { status: subscriptionStatus, loading: subscriptionLoading } = useSubscriptionStatus();
  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // URL 파라미터에서 정보 가져오기
  const fromPage = searchParams.get('from') as 'today' | 'monthly' | null;
  const category = searchParams.get('category');


  useEffect(() => {
    if (user) {
      console.log('[DEBUG] Subscription Status:', subscriptionStatus, 'CreatedAt:', user.createdAt);
    }
  }, [user, subscriptionStatus]);

  useEffect(() => {
    if (!id) return;

    const fetchNews = async () => {
      try {
        console.info("[NEWS_DETAIL] fetching news", { id, fromPage, category });

        // API에서 뉴스 상세 정보 가져오기 (캐싱 비활성화)
        const response = await fetch(`/api/news/${id}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        console.group("[NEWS_DETAIL] 🔍 뉴스 데이터 로드");
        console.log("📦 전체 API 응답:", JSON.stringify(data, null, 2));
        console.log("📰 뉴스 ID:", data.id);
        console.log("📝 뉴스 제목:", data.title);
        console.log("🏢 출처:", data.source);
        console.log("🏷️ 카테고리:", data.category);
        console.log("🔗 URL:", data.url);
        console.log("---");
        console.log("📊 Analysis 객체:", data.analysis);
        console.log("📌 제목:", data.analysis?.title);
        console.log("📄 내용:", data.analysis?.content);
        console.log("⚠️ 최악의 시나리오:", data.analysis?.worst_scenarios);
        console.log("🎯 액션팁:", data.analysis?.action_tips);
        console.log("📊 레벨:", data.analysis?.level);
        console.log("🔒 블러:", data.analysis?.should_blur);
        console.groupEnd();

        // 데이터 검증
        if (!data.analysis?.content) {
          console.error("[NEWS_DETAIL] ❌ 뉴스 내용이 없습니다!");
          console.error("[NEWS_DETAIL] 받은 content 값:", data.analysis?.content);
        }
        if (!data.analysis?.worst_scenarios || data.analysis.worst_scenarios.length === 0) {
          console.error("[NEWS_DETAIL] ❌ 최악의 시나리오가 없습니다!");
          console.error("[NEWS_DETAIL] 받은 worst_scenarios:", data.analysis?.worst_scenarios);
        }
        if (!data.analysis?.action_tips || data.analysis.action_tips.length === 0) {
          console.error("[NEWS_DETAIL] ❌ 액션팁이 없습니다!");
          console.error("[NEWS_DETAIL] 받은 action_tips:", data.analysis?.action_tips);
        }

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
    if (fromPage === 'today') return '오늘의 뉴스';
    if (fromPage === 'monthly') return '이달의 뉴스';
    if (category) {
      return `${category} 뉴스`;
    }
    return '뉴스 센터';
  };

  const getPageSubtitle = () => {
    if (category) {
      return '카테고리 뉴스 해설을 확인해보세요';
    }
    return '당신을 위한 실전 뉴스 해설';
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
      <div className="min-h-screen bg-[#050814]">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-12 w-12 rounded-2xl border border-white/20 bg-white/10 backdrop-blur flex items-center justify-center"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="mt-6 text-2xl font-bold text-white">
            뉴스를 찾지 못했어요
          </div>
          <div className="mt-2 text-white/70">
            잠시 후 다시 시도해주세요.
          </div>
        </div>
      </div>
    );
  }

  return (
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
          <p className="mt-1 text-white text-base sm:text-lg">
            {getPageSubtitle()}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            console.log("[NEWS_DETAIL] Click Boarding Pass. User:", user?.id, "Status:", subscriptionStatus);
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
        {/* 뉴스 제목 카드 */}
        <div className="rounded-3xl border border-gray-200 bg-white px-7 py-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
              {news.category}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-black leading-tight">
            {news.analysis.title || news.title || "미 연준, 금리 동결 시사 — 시장은 '인하 시점' 주목"}
          </h2>
        </div>

        {/* 뉴스 내용 (3문장) */}
        <NewsSummary summary={news.analysis.content} />

        {/* 최악의 시나리오 */}
        <WorstScenario scenarios={news.analysis.worst_scenarios} />

        {/* 사용자 액션팁 */}
        <ActionItem tips={news.analysis.action_tips} shouldBlur={news.analysis.should_blur} />

        {/* 원문 링크 */}
        <NewsFooter source={news.source} url={news.url} />
      </div>

      {/* Boarding Pass Modal */}
      {!subscriptionLoading && (
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
          subscriptionStatus={subscriptionStatus}
        />
      )}
    </div>
  );
}
