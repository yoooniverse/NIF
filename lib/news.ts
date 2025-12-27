import { SupabaseClient } from '@supabase/supabase-js';
import { News } from '@/types/news';

/**
 * 뉴스 데이터를 Supabase에서 가져오는 함수들
 */

/**
 * 오늘의 뉴스 가져오기 (최신순)
 * @param supabase Supabase 클라이언트
 * @param limit 가져올 뉴스 개수 (기본값: 10)
 * @returns 뉴스 배열
 */
export async function fetchTodayNews(
  supabase: SupabaseClient,
  limit: number = 10
): Promise<News[]> {
  console.info('[NEWS_LIB] fetchTodayNews called, limit:', limit);

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .gte('published_at', startOfDay.toISOString())
    .lte('published_at', endOfDay.toISOString())
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[NEWS_LIB] fetchTodayNews error:', error);
    throw error;
  }

  console.info('[NEWS_LIB] fetchTodayNews success, count:', data?.length || 0);
  return data || [];
}

/**
 * 이달의 뉴스 가져오기 (최신순)
 * @param supabase Supabase 클라이언트
 * @param limit 가져올 뉴스 개수 (기본값: 20)
 * @returns 뉴스 배열
 */
export async function fetchMonthlyNews(
  supabase: SupabaseClient,
  limit: number = 20
): Promise<News[]> {
  console.info('[NEWS_LIB] fetchMonthlyNews called, limit:', limit);

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .gte('published_at', startOfMonth.toISOString())
    .lte('published_at', endOfMonth.toISOString())
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[NEWS_LIB] fetchMonthlyNews error:', error);
    throw error;
  }

  console.info('[NEWS_LIB] fetchMonthlyNews success, count:', data?.length || 0);
  return data || [];
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
 * @param news Supabase에서 가져온 뉴스 데이터
 * @returns NewsCard에서 사용할 데이터 형식
 */
export function transformNewsForCard(news: News) {
  return {
    id: news.id,
    title: news.metadata?.level1?.title || news.title, // 레벨1 제목 우선, 없으면 기본 제목
    category: news.metadata?.tags?.[0] || '일반', // 첫 번째 태그를 카테고리로 사용
    publishedAt: news.published_at,
    summary: news.metadata?.level1?.content, // 레벨1 내용
    tags: news.metadata?.tags || [], // 관심분야 태그들
    targets: news.metadata?.targets || [], // 타겟 사용자 그룹들
  };
}
