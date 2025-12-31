import { NewsListResponse, NewsListItem, News } from '@/types/news';

/**
 * 뉴스 데이터를 API에서 가져오는 함수들
 */

/**
 * 오늘의 뉴스 가져오기 (API 호출)
 * @param limit 가져올 뉴스 개수 (기본값: 10)
 * @returns 뉴스 배열
 */
export async function fetchTodayNews(limit: number = 10): Promise<News[]> {
  console.info('[NEWS_LIB] fetchTodayNews called, limit:', limit);

  try {
    const response = await fetch(`/api/news?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data: NewsListResponse = await response.json();
    console.info('[NEWS_LIB] fetchTodayNews success, count:', data.news.length);

    // NewsListItem[]을 News[]로 변환
    const news: News[] = data.news.map(convertNewsListItemToNews);
    return news;
  } catch (error) {
    console.error('[NEWS_LIB] fetchTodayNews error:', error);
    throw error;
  }
}

/**
 * 이달의 뉴스 가져오기 (API 호출)
 * @param limit 가져올 뉴스 개수 (기본값: 20)
 * @returns 뉴스 배열
 */
export async function fetchMonthlyNews(limit: number = 20): Promise<News[]> {
  console.info('[NEWS_LIB] fetchMonthlyNews called, limit:', limit);

  try {
    const response = await fetch(`/api/news/monthly?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    console.info('[NEWS_LIB] fetchMonthlyNews success, count:', data.news?.length || 0);

    // 월간 뉴스 API 응답을 News[]로 변환
    const news: News[] = (data.news || []).map(convertMonthlyNewsItemToNews);
    return news;
  } catch (error) {
    console.error('[NEWS_LIB] fetchMonthlyNews error:', error);
    throw error;
  }
}

/**
 * 특정 카테고리의 뉴스 필터링
 * @param news 뉴스 배열
 * @param categorySlug 카테고리 slug ('all'이면 필터링하지 않음)
 * @returns 필터링된 뉴스 배열
 */
export function filterNewsByCategory(news: News[], categorySlug: string): News[] {
  if (categorySlug === 'all') {
    return news;
  }

  // 카테고리 slug를 한글명으로 변환
  const categoryNameMap: { [key: string]: string } = {
    'stock': '주식',
    'crypto': '가상화폐',
    'real-estate': '부동산',
    'etf': 'ETF',
    'exchange-rate': '환율',
  };

  const categoryName = categoryNameMap[categorySlug];

  if (!categoryName) {
    console.warn('[NEWS_LIB] Unknown category slug:', categorySlug);
    return news;
  }

  return news.filter(item => {
    // metadata.tags 배열에 해당 카테고리가 포함되어 있는지 확인
    return item.metadata?.tags?.includes(categoryName) || false;
  });
}

/**
 * 뉴스 데이터를 NewsCard 컴포넌트에서 사용할 형식으로 변환
 * @param news API에서 가져온 뉴스 데이터
 * @returns NewsCard에서 사용할 데이터 형식
 */
export function transformNewsForCard(news: News) {
  return {
    id: news.id,
    title: news.title,
    category: news.metadata?.tags?.[0] || '일반',
    publishedAt: news.published_at,
    summary: news.content,
    tags: news.metadata?.tags || [],
    targets: news.metadata?.targets || [],
  };
}

/**
 * NewsListItem을 News 타입으로 변환
 */
function convertNewsListItemToNews(item: NewsListItem): News {
  return {
    id: item.id,
    source_id: '',
    title: item.analysis?.easy_title || item.title,
    url: '',
    content: item.analysis?.summary || '',
    published_at: item.published_at,
    ingested_at: item.published_at,
    metadata: {
      tags: item.tags || [item.category],
      targets: [],
      level1: {
        title: item.analysis?.easy_title || '',
        content: item.analysis?.summary || '',
        worst: item.analysis?.worst_scenarios?.[0] || '',
        action: '',
      } as any,
      level2: {} as any,
      level3: {} as any,
    },
  };
}

/**
 * 월간 뉴스 API 응답 아이템을 News 타입으로 변환
 */
function convertMonthlyNewsItemToNews(item: any): News {
  return {
    id: item.id,
    source_id: item.source || '',
    title: item.analysis?.easy_title || item.title,
    url: item.url || '',
    content: item.analysis?.summary || '',
    published_at: item.published_at,
    ingested_at: item.published_at,
    metadata: {
      tags: item.tags || [item.category],
      targets: [],
      level1: {
        title: item.analysis?.easy_title || '',
        content: item.analysis?.summary || '',
        worst: item.analysis?.worst_scenarios?.[0] || '',
        action: '',
      } as any,
      level2: {} as any,
      level3: {} as any,
    },
  };
}
