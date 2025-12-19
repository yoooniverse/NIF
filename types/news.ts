// 뉴스 관련 타입 정의
// DB 스키마와 PRD를 기반으로 정의

export interface News {
  id: string;
  source_id: string;
  title: string;
  url: string;
  content: string;
  published_at: string;
  ingested_at: string;
  metadata: {
    category: string;
    thumbnail_url?: string;
    impact_score?: number;
    is_curated: boolean;
  };
}

export interface NewsAnalysisLevel {
  id: string;
  news_id: string;
  level: 1 | 2 | 3;
  easy_title: string;
  summary: string;
  worst_scenario: string;
  user_action_tip: string;
  action_blurred: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'premium';
  started_at: string;
  ends_at: string;
  active: boolean;
  billing_key?: string;
  created_at: string;
  updated_at: string;
}

// API 응답 타입들

// GET /api/news 응답
export interface NewsListResponse {
  news: NewsListItem[];
  subscription: {
    active: boolean;
    days_remaining: number;
  };
}

export interface NewsListItem {
  id: string;
  title: string;
  category: string;
  published_at: string;
  analysis?: {
    level: 1 | 2 | 3;
    easy_title: string;
    summary: string;
    worst_scenario: string;
    should_blur: boolean;
  } | null;
}

// GET /api/news/[id] 응답
export interface NewsDetailResponse {
  id: string;
  title: string;
  url: string;
  content: string;
  published_at: string;
  source: string;
  category: string;
  analysis: {
    level: 1 | 2 | 3;
    easy_title: string;
    summary: string;
    worst_scenario: string;
    user_action_tip: string;
    should_blur: boolean;
  };
  subscription: {
    active: boolean;
    days_remaining: number;
  };
}

// API 쿼리 파라미터 타입들

export interface NewsListQueryParams {
  user_id: string;
  date?: string; // YYYY-MM-DD
  category?: string; // 관심분야 slug
  limit?: number; // 기본 5
}

export interface NewsDetailQueryParams {
  user_id: string;
}

// DB 조인 결과 타입들

export interface NewsWithAnalysis {
  id: string;
  title: string;
  url: string;
  content: string;
  published_at: string;
  metadata: any;
  sources?: {
    source_id: string;
    homepage_url: string;
  };
  news_analysis_levels: NewsAnalysisLevel;
  category: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  level: 1 | 2 | 3;
  onboarded_at: string;
}

// 관심사 관련 타입들
export interface Interest {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface UserInterest {
  id: string;
  user_id: string;
  interest_id: string;
  created_at: string;
  interests: Interest;
}