'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import NewsCard from '@/components/dashboard/NewsCard';
import { FlightViewBackground } from '@/components/landing/FlightViewBackground';
import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { fetchMonthlyNews, filterNewsByCategory, transformNewsForCard } from '@/lib/news';
import { News } from '@/types/news';

// 관심분야 카테고리
const INTEREST_CATEGORIES = [
  { id: 'all', name: '전체', slug: 'all' },
  { id: 'stock', name: '주식', slug: 'stock' },
  { id: 'crypto', name: '가상화폐', slug: 'crypto' },
  { id: 'real-estate', name: '부동산', slug: 'real-estate' },
  { id: 'etf', name: 'ETF', slug: 'etf' },
  { id: 'exchange-rate', name: '환율', slug: 'exchange-rate' },
];

// 카테고리 slug ↔ 한글명 매핑
const CATEGORY_SLUG_TO_NAME: { [key: string]: string } = {
  'stock': '주식',
  'crypto': '가상화폐',
  'real-estate': '부동산',
  'etf': 'ETF',
  'exchange-rate': '환율',
};

// Mock 월간 뉴스 데이터 (더 많은 데이터)
const MOCK_MONTHLY_NEWS = [
  {
    id: '1',
    title: '미 연준, 금리 동결 시사 — 시장은 "인하 시점" 주목',
    category: '주식',
    publishedAt: '2025-12-18T09:00:00Z',
    summary: '연준이 금리 동결을 시사하며 시장의 관심이 다음 인하 시점으로 이동했습니다.',
  },
  {
    id: '2',
    title: '비트코인 변동성 확대… 현물 ETF 자금 유입/유출 혼조',
    category: '가상화폐',
    publishedAt: '2025-12-17T14:30:00Z',
    summary: '비트코인 가격 변동성이 커지며 ETF 자금 흐름도 불안정한 모습을 보이고 있습니다.',
  },
  {
    id: '3',
    title: '원/달러 환율 1,3xx원대 등락… 수출주 영향',
    category: '환율',
    publishedAt: '2025-12-17T11:00:00Z',
    summary: '원/달러 환율이 1300원대를 오가며 수출주들의 주가에 영향을 미치고 있습니다.',
  },
  {
    id: '4',
    title: 'AI 반도체 공급망 재편… 대형주 중심 랠리 지속',
    category: '주식',
    publishedAt: '2025-12-16T16:45:00Z',
    summary: 'AI 반도체 공급망 재편으로 대형 기술주들의 상승세가 이어지고 있습니다.',
  },
  {
    id: '5',
    title: '중국 경기 부양책 기대감… 원자재 가격 반등',
    category: 'ETF',
    publishedAt: '2025-12-16T09:20:00Z',
    summary: '중국의 경기 부양책 기대감으로 원자재 관련 ETF 가격이 상승했습니다.',
  },
  {
    id: '6',
    title: '부동산 시장 안정화 조짐… 매수세 회복',
    category: '부동산',
    publishedAt: '2025-12-15T13:15:00Z',
    summary: '부동산 시장에 안정화 조짐이 나타나며 매수세가 서서히 회복되고 있습니다.',
  },
  {
    id: '7',
    title: '글로벌 공급망 재구성… 아시아 기업들의 기회',
    category: '주식',
    publishedAt: '2025-12-14T10:30:00Z',
    summary: '글로벌 공급망 재구성 움직임이 커지며 아시아 기업들의 경쟁력이 부각되고 있습니다.',
  },
  {
    id: '8',
    title: '디지털 자산 규제 강화… 시장 참여자들의 대응 전략',
    category: '가상화폐',
    publishedAt: '2025-12-13T15:45:00Z',
    summary: '각국 정부의 디지털 자산 규제 강화 움직임에 따라 시장 참여자들이 대응 전략을 마련하고 있습니다.',
  },
  {
    id: '9',
    title: '미국 실업률 하락… 고용 시장 회복 신호',
    category: 'ETF',
    publishedAt: '2025-12-12T08:00:00Z',
    summary: '미국 실업률이 예상보다 큰 폭으로 하락하며 고용 시장 회복 신호를 보내고 있습니다.',
  },
  {
    id: '10',
    title: '주택담보대출 금리 안정… 부동산 시장에 긍정적',
    category: '부동산',
    publishedAt: '2025-12-11T12:20:00Z',
    summary: '주택담보대출 금리가 안정세를 보이며 부동산 시장에 긍정적인 영향을 미치고 있습니다.',
  },
  {
    id: '11',
    title: '외환시장 변동성 증가… 기업들의 환헤지 전략 필요',
    category: '환율',
    publishedAt: '2025-12-10T14:10:00Z',
    summary: '외환시장 변동성이 증가함에 따라 수출입 기업들의 환헤지 전략이 중요해지고 있습니다.',
  },
  {
    id: '12',
    title: '기술주 밸류에이션 재평가… 성장주 vs 가치주 논쟁',
    category: '주식',
    publishedAt: '2025-12-09T11:55:00Z',
    summary: '기술주 밸류에이션에 대한 재평가가 이루어지며 성장주와 가치주 간 논쟁이 커지고 있습니다.',
  },
];

// 메인 컴포넌트를 Suspense로 감싸기 위한 래퍼
export default function MonthlyNewsPage() {
  return (
    <Suspense fallback={<MonthlyNewsLoading />}>
      <MonthlyNewsContent />
    </Suspense>
  );
}

// 로딩 컴포넌트
function MonthlyNewsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050814]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent" />
        <p className="text-white/70">로딩 중...</p>
      </div>
    </div>
  );
}

function MonthlyNewsContent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useClerkSupabaseClient();

  // URL에서 카테고리 읽기 (뒤로가기 시 유지됨)
  const categoryFromUrl = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

  // 뉴스 데이터 상태
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL 파라미터 변경 시 state 동기화
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    console.info('[MONTHLY_NEWS] page loaded, category:', categoryFromUrl);
  }, [categoryFromUrl]);

  // 뉴스 데이터 로딩
  useEffect(() => {
    async function loadNews() {
      if (!isLoaded || !user) return;

      try {
        console.info('[MONTHLY_NEWS] loading news data...');
        setLoading(true);
        setError(null);

        const newsData = await fetchMonthlyNews(supabase, 30); // 이달의 뉴스는 최대 30개
        setNews(newsData);

        console.info('[MONTHLY_NEWS] news data loaded successfully, count:', newsData.length);
      } catch (err) {
        console.error('[MONTHLY_NEWS] failed to load news:', err);
        setError('뉴스를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, [isLoaded, user, supabase]);

  // 인증 체크
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
      return;
    }
  }, [isLoaded, user, router]);

  // 카테고리 변경 시 URL 업데이트
  const handleCategoryChange = useCallback((slug: string) => {
    console.info('[MONTHLY_NEWS] category filter:', slug);
    setSelectedCategory(slug);
    
    // URL 쿼리 파라미터 업데이트 (뒤로가기 시 유지되도록)
    if (slug === 'all') {
      router.replace('/news/monthly', { scroll: false });
    } else {
      router.replace(`/news/monthly?category=${slug}`, { scroll: false });
    }
  }, [router]);

  const handleBack = () => {
    console.info('[MONTHLY_NEWS] click: back to dashboard');
    router.push('/dashboard');
  };

  const filteredNews = filterNewsByCategory(news, selectedCategory);

  // 카테고리별 배경 설정 - 카테고리 버튼의 배경을 전체 버튼에서도 동일하게 사용
  const earthSize = selectedCategory === 'all' ? 2.5 : 2.5; // 모두 동일한 크기로 통일

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
          <p className="text-slate-700">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050814] text-white overflow-hidden">
      {/* 우주 배경 (비행기 뷰) */}
      <FlightViewBackground earthSize={earthSize} />
      
      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-6 pt-8 pb-16">
        <div className="flex items-start gap-4">
          <button
            onClick={handleBack}
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
              이달의 뉴스
            </h1>
            <p className="mt-1 text-white/70 text-base sm:text-lg">
              월간 뉴스 브리핑을 확인해보세요
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {/* 월간 요약 */}
          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur px-7 py-6">
            <h2 className="text-lg font-semibold text-white mb-3">12월 뉴스 브리핑</h2>
            <p className="text-white/80 leading-relaxed">
              이번 달은 &quot;리스크 온/오프&quot;가 빠르게 교차했습니다. 금리/환율/유가의 동시 변동이 커져 포트폴리오 분산이 중요합니다.
              미국 경제지표 호조와 함께 아시아 시장의 회복세가 두드러졌습니다.
            </p>
          </div>

          {/* 관심분야 카테고리 필터 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-white/70" />
              <span className="text-sm font-medium text-white/80">관심분야</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTEREST_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`px-5 py-3 rounded-full text-base font-semibold transition ${
                    selectedCategory === category.slug
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#050814] text-white hover:bg-[#0a0f29] border border-white/20'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* 뉴스 목록 */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                <p className="text-white/70">뉴스를 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-white/50 text-lg mb-2">오류 발생</div>
                <div className="text-white/40 text-sm">{error}</div>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-white/50 text-lg mb-2">뉴스가 없습니다</div>
                <div className="text-white/40 text-sm">해당 카테고리의 뉴스가 아직 준비되지 않았습니다.</div>
              </div>
            ) : (
              filteredNews.map((newsItem) => {
                const cardData = transformNewsForCard(newsItem);
                return (
                  <NewsCard
                    key={newsItem.id}
                    id={newsItem.id}
                    title={cardData.title}
                    category={cardData.category}
                    categorySlug={selectedCategory !== 'all' ? selectedCategory : undefined}
                    publishedAt={cardData.publishedAt}
                    summary={cardData.summary}
                    tags={cardData.tags}
                    targets={cardData.targets}
                    isWhite={true}
                    fromPage="monthly"
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}