export type NewsCategory = "부동산" | "주식" | "환율" | "ETF" | "가상화폐";

// 카테고리 한글명 → 영문 slug 매핑
export const CATEGORY_TO_SLUG: Record<NewsCategory, string> = {
  "주식": "stock",
  "가상화폐": "crypto",
  "부동산": "real-estate",
  "ETF": "etf",
  "환율": "exchange-rate"
};

// 영문 slug → 카테고리 한글명 매핑 (역방향)
export const SLUG_TO_CATEGORY: Record<string, NewsCategory> = {
  "stock": "주식",
  "crypto": "가상화폐",
  "real-estate": "부동산",
  "etf": "ETF",
  "exchange-rate": "환율"
};

export interface NewsItem {
  id: string;
  title: string;
  category: NewsCategory;
  url: string;
  content: string;
  published_at: string;
  source: string;
  analysis: {
    level: number;
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

// 카테고리를 slug로 변환하는 헬퍼 함수
export function getCategorySlug(category: NewsCategory): string {
  return CATEGORY_TO_SLUG[category];
}

// 목 뉴스 데이터 (UI 개발/데모용)
export const mockNewsData: NewsItem[] = [
  {
    id: "1",
    title: "미 연준, 금리 동결 시사 — 시장은 '인하 시점' 주목",
    category: "주식",
    url: "https://news.example.com/fed-rate-hold",
    content:
      "연준이 금리 동결을 시사하며 시장의 관심이 다음 인하 시점으로 이동했습니다...",
    published_at: "2025-12-18T09:00:00Z",
    source: "연합뉴스",
    analysis: {
      level: 2,
      easy_title: "미국 중앙은행이 금리를 그대로 유지했어요",
      summary:
        "미국 연준이 금리 동결을 시사했습니다. 시장은 이제 다음 금리 인하 시점을 주목하고 있습니다.",
      worst_scenario:
        "금리가 예상보다 오래 유지되면 주식 시장 변동성이 커질 수 있어요. 투자 손실 위험이 증가할 수 있습니다.",
      user_action_tip:
        "포트폴리오 다각화를 고려해보세요. 고위험 자산 비중을 조절하고, 현금 비중을 늘리는 것도 좋은 전략입니다.",
      should_blur: false,
    },
    subscription: {
      active: true,
      days_remaining: 27,
    },
  },
  {
    id: "2",
    title: "비트코인 변동성 확대… 현물 ETF 자금 유입/유출 혼조",
    category: "가상화폐",
    url: "https://news.example.com/bitcoin-volatility",
    content:
      "비트코인 가격 변동성이 커지며 ETF 자금 흐름도 불안정한 모습을 보이고 있습니다...",
    published_at: "2025-12-18T08:30:00Z",
    source: "코인니스",
    analysis: {
      level: 2,
      easy_title: "비트코인 가격이 많이 흔들리고 있어요",
      summary:
        "비트코인 변동성이 확대되며 현물 ETF 자금도 불안정한 흐름을 보이고 있습니다.",
      worst_scenario:
        "급격한 가격 하락 시 투자 손실이 커질 수 있어요. 특히 레버리지를 사용한 투자는 위험합니다.",
      user_action_tip:
        "가상화폐 투자는 전체 자산의 5-10% 이내로 제한하세요. 분할 매수 전략을 사용하고, 손절매를 설정하는 게 안전합니다.",
      should_blur: false,
    },
    subscription: {
      active: true,
      days_remaining: 27,
    },
  },
  {
    id: "3",
    title: "중국 경기 부양책 기대감… 원자재 가격 반등",
    category: "ETF",
    url: "https://news.example.com/china-stimulus",
    content:
      "중국의 경기 부양책 기대감으로 원자재 관련 ETF 가격이 상승했습니다...",
    published_at: "2025-12-18T07:00:00Z",
    source: "Bloomberg",
    analysis: {
      level: 2,
      easy_title: "중국 경제 부양 기대감에 원자재 가격이 올랐어요",
      summary:
        "중국 경기 부양책 기대감으로 원자재 관련 ETF 가격이 반등했습니다.",
      worst_scenario:
        "기대감만으로 오른 가격이 실제 정책 효과가 미흡하면 하락할 수 있어요. 글로벌 경기 불확실성이 커질 수 있습니다.",
      user_action_tip:
        "원자재 ETF 투자는 분산 투자 관점에서 접근하세요. 중국 관련 리스크를 충분히 고려한 포트폴리오 구성이 필요합니다.",
      should_blur: false,
    },
    subscription: {
      active: true,
      days_remaining: 27,
    },
  },
  {
    id: "4",
    title: "AI 반도체 공급망 재편… 대형주 중심 랠리 지속",
    category: "주식",
    url: "https://news.example.com/ai-semiconductor",
    content:
      "AI 반도체 공급망 재편으로 대형 기술주들의 상승세가 이어지고 있습니다...",
    published_at: "2025-12-18T07:30:00Z",
    source: "한국경제",
    analysis: {
      level: 2,
      easy_title: "AI 관련 기술주들이 계속 오르고 있어요",
      summary:
        "AI 반도체 공급망 재편으로 대형 기술주들의 상승세가 지속되고 있습니다.",
      worst_scenario:
        "기술주 과열로 인한 조정 가능성이 있습니다. AI 투자 열풍이 식으면 주가 하락 위험이 있습니다.",
      user_action_tip:
        "AI 테마주 투자는 신중하게 접근하세요. 분산 투자 원칙을 지키고, 기업 실적을 꼼꼼히 확인해보세요.",
      should_blur: false,
    },
    subscription: {
      active: true,
      days_remaining: 27,
    },
  },
  {
    id: "5",
    title: "중국 경기 부양책 기대감… 원자재 가격 반등",
    category: "ETF",
    url: "https://news.example.com/china-stimulus",
    content:
      "중국의 경기 부양책 기대감으로 원자재 관련 ETF 가격이 상승했습니다...",
    published_at: "2025-12-18T07:00:00Z",
    source: "Bloomberg",
    analysis: {
      level: 2,
      easy_title: "중국 경제 부양 기대감에 원자재 가격이 올랐어요",
      summary:
        "중국 경기 부양책 기대감으로 원자재 관련 ETF 가격이 반등했습니다.",
      worst_scenario:
        "기대감만으로 오른 가격이 실제 정책 효과가 미흡하면 하락할 수 있어요. 글로벌 경기 불확실성이 커질 수 있습니다.",
      user_action_tip:
        "원자재 ETF 투자는 분산 투자 관점에서 접근하세요. 중국 관련 리스크를 충분히 고려한 포트폴리오 구성이 필요합니다.",
      should_blur: false,
    },
    subscription: {
      active: true,
      days_remaining: 27,
    },
  },
  {
    id: "6",
    title: "부동산 시장 안정화 조짐… 매수세 회복",
    category: "부동산",
    url: "https://news.example.com/real-estate-recovery",
    content:
      "부동산 시장에 안정화 조짐이 나타나며 매수세가 서서히 회복되고 있습니다...",
    published_at: "2025-12-18T06:30:00Z",
    source: "부동산경제신문",
    analysis: {
      level: 2,
      easy_title: "부동산 시장이 안정되고 있어요",
      summary:
        "부동산 시장 안정화 조짐이 나타나며 매수세가 회복되고 있습니다.",
      worst_scenario:
        "금리 인상이나 경기 침체 시 부동산 시장이 다시 얼어붙을 수 있어요. 투자 손실 위험이 있습니다.",
      user_action_tip:
        "부동산 투자는 장기적 관점으로 접근하세요. 지역별 시장 상황을 충분히 조사하고, 대출 비율을 신중하게 결정하세요.",
      should_blur: false,
    },
    subscription: {
      active: true,
      days_remaining: 27,
    },
  },
];

export function getMockNewsById(id: string): NewsItem | null {
  return mockNewsData.find((n) => n.id === id) ?? null;
}