'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import dynamic from 'next/dynamic';
import NewsCard from '@/components/dashboard/NewsCard';
import { fetchTodayNews, filterNewsByCategory, transformNewsForCard } from '@/lib/news';
import { News } from '@/types/news';

// FlightViewBackground를 dynamic import로 변경 (SSR 비활성화)
const FlightViewBackground = dynamic(
  () => import('@/components/landing/FlightViewBackground').then(mod => ({ default: mod.FlightViewBackground })),
  { 
    ssr: false,
    loading: () => <div className="absolute inset-0 z-0 h-full w-full bg-[#030308]" />
  }
);

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

// Mock 뉴스 데이터
const MOCK_NEWS = [
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
    publishedAt: '2025-12-18T08:30:00Z',
    summary: '비트코인 가격 변동성이 커지며 ETF 자금 흐름도 불안정한 모습을 보이고 있습니다.',
  },
  {
    id: '3',
    title: '원/달러 환율 1,3xx원대 등락… 수출주 영향',
    category: '환율',
    publishedAt: '2025-12-18T08:00:00Z',
    summary: '원/달러 환율이 1300원대를 오가며 수출주들의 주가에 영향을 미치고 있습니다.',
  },
  {
    id: '4',
    title: 'AI 반도체 공급망 재편… 대형주 중심 랠리 지속',
    category: '주식',
    publishedAt: '2025-12-18T07:30:00Z',
    summary: 'AI 반도체 공급망 재편으로 대형 기술주들의 상승세가 이어지고 있습니다.',
  },
  {
    id: '5',
    title: '중국 경기 부양책 기대감… 원자재 가격 반등',
    category: 'ETF',
    publishedAt: '2025-12-18T07:00:00Z',
    summary: '중국의 경기 부양책 기대감으로 원자재 관련 ETF 가격이 상승했습니다.',
  },
  {
    id: '6',
    title: '부동산 시장 안정화 조짐… 매수세 회복',
    category: '부동산',
    publishedAt: '2025-12-18T06:30:00Z',
    summary: '부동산 시장에 안정화 조짐이 나타나며 매수세가 서서히 회복되고 있습니다.',
  },
];

// 메인 컴포넌트를 Suspense로 감싸기 위한 래퍼
export default function TodayNewsPage() {
  return (
    <Suspense fallback={<TodayNewsLoading />}>
      <TodayNewsContent />
    </Suspense>
  );
}

// 로딩 컴포넌트
function TodayNewsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050814]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent" />
        <p className="text-white/70">로딩 중...</p>
      </div>
    </div>
  );
}

const CATEGORY_NAME_TO_SLUG: { [key: string]: string } = {
  '주식': 'stock',
  '가상화폐': 'crypto',
  '부동산': 'real-estate',
  'ETF': 'etf',
  '환율': 'exchange-rate',
};

function TodayNewsContent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 카테고리 읽기 (뒤로가기 시 유지됨)
  const categoryFromUrl = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

  // 뉴스 데이터 상태
  const [news, setNews] = useState<News[]>([]);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL 파라미터 변경 시 state 동기화
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  // 뉴스 데이터 로딩
  useEffect(() => {
    async function loadNews() {
      if (!isLoaded || !user) return;

      try {
        console.info('[TODAY_NEWS] loading news data...');
        setLoading(true);
        setError(null);

        const response = await fetch('/api/news?limit=20');
        if (!response.ok) throw new Error('Failed to fetch news');

        const data = await response.json();
        
        console.info('[TODAY_NEWS] raw API response:', {
          newsCount: data.news?.length || 0,
          firstNews: data.news?.[0],
          userInterests: data.user_interests
        });

        // API 응답을 News 타입으로 변환
        const transformedNews = data.news.map((item: any) => ({
          id: item.id,
          source_id: '',
          title: item.title,
          url: '',
          content: item.analysis?.summary || '',
          published_at: item.published_at,
          ingested_at: item.published_at,
          metadata: { 
            tags: item.tags || [], 
            targets: [],
            level1: {
              title: item.title,
              content: item.analysis?.summary || '',
              worst: '',
              action: ''
            },
            level2: {},
            level3: {}
          }
        }));
        
        console.info('[TODAY_NEWS] transformed news:', {
          count: transformedNews.length,
          firstItem: transformedNews[0]
        });
        
        setNews(transformedNews);
        setUserInterests(data.user_interests || []);

        console.info('[TODAY_NEWS] news data loaded successfully');
      } catch (err) {
        console.error('[TODAY_NEWS] failed to load news:', err);
        setError('뉴스를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, [isLoaded, user]);

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
    console.info('[TODAY_NEWS] category filter:', slug);
    setSelectedCategory(slug);

    // URL 쿼리 파라미터 업데이트 (뒤로가기 시 유지되도록)
    if (slug === 'all') {
      router.replace('/news/today', { scroll: false });
    } else {
      router.replace(`/news/today?category=${slug}`, { scroll: false });
    }
  }, [router]);

  const handleBack = () => {
    console.info('[TODAY_NEWS] click: back to dashboard');
    router.push('/dashboard');
  };

  // 필터링된 뉴스 (API에서 이미 필터링되어 오지만, 전체탭에서 특정 카테고리 선택시 client filtering)
  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter(item => {
      const catName = CATEGORY_SLUG_TO_NAME[selectedCategory];
      const hasCategory = item.metadata?.tags?.includes(catName);
      console.info('[TODAY_NEWS] filtering:', {
        category: catName,
        itemTags: item.metadata?.tags,
        hasCategory
      });
      return hasCategory;
    });

  console.info('[TODAY_NEWS] filter result:', {
    selectedCategory,
    totalNews: news.length,
    filteredCount: filteredNews.length
  });

  // 동적 카테고리 목록 생성
  const categories = [
    { id: 'all', name: '전체', slug: 'all' },
    ...userInterests.map(name => ({
      id: CATEGORY_NAME_TO_SLUG[name] || name,
      name,
      slug: CATEGORY_NAME_TO_SLUG[name] || name
    }))
  ];

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050814]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent" />
          <p className="text-white">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050814] text-white overflow-hidden">
      {/* 우주 배경 (비행기 뷰) */}
      <FlightViewBackground earthSize={2.5} />

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
              오늘의 뉴스
            </h1>
            <p className="mt-1 text-white/70 text-base sm:text-lg">
              {userInterests.length > 0
                ? `${userInterests.join(', ')} 분야의 뉴스를 확인해보세요`
                : '관심분야별 주요 헤드라인을 확인해보세요'
              }
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {/* 관심분야 카테고리 필터 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-white/70" />
              <span className="text-sm font-medium text-white/80">관심분야</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`px-5 py-3 rounded-full text-base font-semibold transition ${selectedCategory === category.slug
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                      : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10 backdrop-blur'
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
                    fromPage="today"
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
