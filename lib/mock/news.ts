export type NewsCategory = "real-estate" | "stock" | "exchange" | "etf" | "crypto";

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

// 목 뉴스 데이터 (UI 개발/데모용)
export const mockNewsData: NewsItem[] = [
  {
    id: "1",
    title: "한은, 기준금리 동결 결정... 시장 예상대로",
    category: "stock",
    url: "https://news.example.com/interest-rate-hold",
    content:
      "한국은행 금융통화위원회는 오늘 통화정책방향 회의를 열어 기준금리를 현 수준에서 동결하기로 결정했다. 이는 시장의 예상과 일치하는 결과다...",
    published_at: "2025-12-18T09:30:00Z",
    source: "연합뉴스",
    analysis: {
      level: 2,
      easy_title: "한국은행이 금리를 그대로 두었어요",
      summary:
        "한국은행이 기준금리를 3.5%로 유지하기로 했습니다. 금리가 그대로면 대출 이자나 예금 이자도 당분간 큰 변화 없이 이어질 가능성이 큽니다.",
      worst_scenario:
        "금리가 오래 높은 수준에서 유지되면, 대출이 있는 분들은 이자 부담이 계속될 수 있어요. 물가가 다시 오르면 생활비 압박도 커질 수 있습니다.",
      user_action_tip:
        "대출이 있다면 상환 계획을 다시 점검하고, 변동금리라면 고정금리 전환 가능성을 비교해보세요. 예적금은 만기/금리를 분산해 리스크를 줄이는 게 좋아요.",
      should_blur: false,
    },
    subscription: {
      active: true,
      days_remaining: 27,
    },
  },
  {
    id: "2",
    title: "달러-원 환율 1,350원 돌파... 수출 기업 수혜",
    category: "exchange",
    url: "https://news.example.com/usd-krw-rise",
    content:
      "원/달러 환율이 1,350원을 돌파하며 상승세를 이어가고 있습니다. 수출 기업들의 실적 기대가 커지고 있으며...",
    published_at: "2025-12-18T16:45:00Z",
    source: "매일경제",
    analysis: {
      level: 2,
      easy_title: "달러 값이 올라서, 해외 관련 비용이 늘 수 있어요",
      summary:
        "원화 가치가 약해지면서 달러 가격이 상승했습니다. 수출 기업에는 유리할 수 있지만, 해외여행/직구/수입 원재료 비용은 올라갈 수 있어요.",
      worst_scenario:
        "환율 상승이 길어지면 해외여행 비용이 크게 늘고, 수입 물가가 오르면서 생활비 부담이 커질 수 있어요. 달러 부채가 있다면 상환 부담도 증가할 수 있습니다.",
      user_action_tip:
        "해외 지출 계획이 있다면 환전 시점을 나눠 리스크를 줄이세요. 달러 자산 비중을 점검하고, 사업자는 원가/환헤지 옵션을 검토해보는 게 좋습니다.",
      // 무료 체험(30일) 버전: 행동 가이드는 전체 공개
      should_blur: false,
    },
    subscription: {
      active: true,
      days_remaining: 27,
    },
  },
  {
    id: "3",
    title: "S&P 500 지수 사상 최고치 경신",
    category: "etf",
    url: "https://news.example.com/sp500-ath",
    content:
      "미국 대표 주식 지수인 S&P 500이 역사상 최고치를 기록했습니다. 대형 기술주 상승과 경기 기대가 반영되며...",
    published_at: "2025-12-18T14:20:00Z",
    source: "Bloomberg",
    analysis: {
      level: 2,
      easy_title: "미국 주식 시장이 정말 강해졌어요",
      summary:
        "S&P 500이 사상 최고치를 경신했습니다. 투자 심리가 좋아졌다는 뜻이지만, 단기적으로는 변동성이 커질 수 있어요.",
      worst_scenario:
        "너무 빠른 상승 뒤에는 조정(가격 하락)이 올 수 있어요. 고점에서 무리하게 들어가면 손실이 커질 수 있습니다.",
      user_action_tip:
        "분할 매수/정기 적립처럼 ‘나눠서’ 접근하세요. 이미 보유 중이라면 목표 비중을 넘지 않도록 리밸런싱을 고려해보세요.",
      should_blur: false,
    },
    subscription: {
      active: true,
      days_remaining: 27,
    },
  },
  {
    id: "4",
    title: "비트코인 상승세 지속... 기관 투자 확대",
    category: "crypto",
    url: "https://news.example.com/bitcoin-surge",
    content:
      "비트코인 가격이 상승세를 이어가고 있습니다. 최근 기관 투자자들의 참여가 증가하면서 변동성은 여전히 크지만...",
    published_at: "2025-12-18T11:15:00Z",
    source: "한국경제",
    analysis: {
      level: 2,
      easy_title: "가상화폐가 오르지만, 흔들림도 커요",
      summary:
        "기관 투자자 유입으로 상승 기대가 커졌습니다. 다만 변동성이 큰 자산이라 갑작스런 하락도 가능해요.",
      worst_scenario:
        "급락 시 손실이 커질 수 있어요. 레버리지(빚 투자)나 몰빵 투자는 위험합니다.",
      user_action_tip:
        "가상화폐는 전체 자산의 작은 비중(예: 5~10%)으로만, 잃어도 생활에 영향 없는 범위에서 접근하세요.",
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

