# Technical Requirements Document (TRD)

## News In Flight - 기술 요구사항 명세서

**작성자:** Senior Developer & Product Manager

**작성일:** 2024년 12월

**개발 기간:** 33일 (2025.12.11 ~ 2026.01.13)

**Next.js 버전:** 15.5.9

**언어:** 한국어 단일 지원

---

## 1. 시스템 아키텍처

### 1.1 전체 구조도

```
[사용자 브라우저]
       ↓
[Vercel - Next.js 15.5.9]
  ├─ Frontend (React 19)
  ├─ API Routes (/api/*)
  └─ Server Actions
       ↓
[외부 서비스]
  ├─ Clerk (인증)
  ├─ Supabase (PostgreSQL)
  ├─ Google Gemini (AI 뉴스 분석 및 해설)
  ├─ Stripe (결제)
  ├─ FRED API (경제 지표)
  └─ n8n (자동화 워크플로우)

```

**핵심 원칙:**

- 모든 데이터는 API Routes를 통해서만 접근
- 클라이언트는 인증 토큰만 관리
- RLS 미사용, API 레벨에서 보안 처리

### 1.2 폴더 구조

**💡 쉽게 설명:**

- `app/` 폴더 안에 있는 폴더 이름 = 웹사이트 주소
- 예: `app/dashboard/page.tsx` = `웹사이트.com/dashboard`

**App Router란?**
Next.js에서 페이지를 만드는 **최신 방식**입니다. (구버전인 Pages Router는 사용하지 않습니다)
웹/앱 구분이 아니라, **페이지 관리 방법**의 차이입니다!

```
news-in-flight/
├── app/                        ← 모든 페이지가 여기 들어감
│   ├── (auth)/                 ← 괄호: 주소에 안 나타남 (그룹핑용)
│   │   ├── login/
│   │   │   └── page.tsx        → /login (로그인 페이지)
│   │   └── signup/
│   │       └── page.tsx        → /signup (회원가입 페이지)
│   │
│   ├── (dashboard)/            ← 로그인 후 보는 페이지들
│   │   ├── dashboard/
│   │   │   └── page.tsx        → /dashboard (메인 대시보드)
│   │   ├── news/[id]/
│   │   │   └── page.tsx        → /news/123 (뉴스 상세)
│   │   ├── cycle/
│   │   │   └── page.tsx        → /cycle (경제 순환기 지도)
│   │   └── settings/
│   │       └── page.tsx        → /settings (설정)
│   │
│   ├── onboarding/             ← 가입 후 처음 하는 설정
│   │   ├── interests/
│   │   │   └── page.tsx        → /onboarding/interests
│   │   ├── contexts/
│   │   │   └── page.tsx        → /onboarding/contexts
│   │   └── level/
│   │       └── page.tsx        → /onboarding/level
│   │
│   ├── api/                    ← 뒤에서 작동하는 기능들 (화면 없음)
│   │   ├── auth/
│   │   │   └── route.ts        → 로그인 처리
│   │   ├── news/
│   │   │   └── route.ts        → 뉴스 목록 가져오기
│   │   ├── news/[id]/
│   │   │   └── route.ts        → 뉴스 상세 가져오기
│   │   ├── onboarding/
│   │   │   └── complete/
│   │   │       └── route.ts    → 온보딩 완료 저장
│   │   ├── cycle/
│   │   │   └── current/
│   │   │       └── route.ts    → 경제 순환기 데이터 가져오기
│   │   ├── subscription/
│   │   │   ├── status/
│   │   │   │   └── route.ts    → 구독 상태 확인
│   │   │   └── checkout/
│   │   │       └── route.ts    → 결제 페이지 생성
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts    → Stripe에서 결제 완료 알림 받기
│   │
│   ├── layout.tsx              ← 모든 페이지에 공통으로 들어가는 틀
│   └── page.tsx                → / (홈 = 랜딩 페이지)
│
├── components/                 ← 재사용하는 UI 조각들
│   ├── ui/                     ← shadcn/ui 버튼, 모달 등
│   ├── news-card.tsx           ← 뉴스 카드 (제목 + 날짜)
│   ├── paywall-modal.tsx       ← "구독하세요" 팝업
│   └── cycle-chart.tsx         ← 경제 순환기 차트
│
├── lib/                        ← 외부 서비스 연결 코드
│   ├── supabase.ts             ← 데이터베이스 연결
│   ├── clerk.ts                ← 로그인 연결
│   ├── stripe.ts               ← 결제 연결
│   ├── gemini.ts               ← AI(Google Gemini) 연결
│   └── fred.ts                 ← FRED API 연결 (경제 지표)
│
├── hooks/                      ← 자주 쓰는 기능 모음
│   └── use-auth.ts             ← 로그인 상태 확인
│
└── middleware.ts               ← 로그인 안 한 사람 차단

```

---

## 2. 기술 스택 상세

### 2.1 Frontend

**Next.js 15.5.9**

- App Router (Pages Router 미사용)
- React Server Components 활용
- Server Actions으로 폼 제출 처리

**UI 라이브러리**

**💡 쉽게 설명:** 버튼, 모달(팝업), 드롭다운 같은 예쁜 UI 부품들을 가져다 쓰기 위한 설치

```bash
# Radix UI: 접근성 좋은 UI 컴포넌트
pnpm add @radix-ui/react-dialog
pnpm add @radix-ui/react-select

# Tailwind CSS: 스타일링 도구
pnpm add tailwindcss

# 유틸리티: 클래스 이름 관리
pnpm add class-variance-authority
pnpm add clsx tailwind-merge

```

**상태 관리: Zustand**

**💡 쉽게 설명:**
"로그인한 사용자 정보"처럼 여러 페이지에서 공통으로 쓰는 데이터를 한 곳에 저장하는 도구

```tsx
// store/auth-store.ts
import { create } from "zustand";

// 사용자 정보 타입 (이메일, 이름 등)
interface AuthState {
  user: User | null; // 현재 로그인한 사용자
  setUser: (user: User | null) => void; // 사용자 정보 업데이트 함수
}

// 전역 상태 만들기
export const useAuthStore = create<AuthState>((set) => ({
  user: null, // 초기값: 아무도 로그인 안 함
  setUser: (user) => set({ user }), // 로그인하면 user 저장
}));

// 사용 예시: 어떤 페이지에서든
// const { user } = useAuthStore()  → 로그인한 사람 정보 가져오기
```

### 2.2 Backend

**Next.js API Routes**

- RESTful API 구조
- `/api/*` 경로에 모든 엔드포인트 배치
- middleware.ts로 인증 처리

**Supabase Client 설정**

**💡 쉽게 설명:**
Supabase = 우리 데이터베이스가 있는 곳
이 코드로 데이터베이스에 접속해서 데이터를 읽고 쓸 수 있습니다.

```tsx
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Supabase 연결 생성
export const supabase = createClient(
  process.env.SUPABASE_URL!, // 데이터베이스 주소
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // 마스터 키 (모든 권한)
  // ⚠️ RLS 미사용이므로 Service Role Key 사용 (보안은 API에서 처리)
);

// 사용 예시:
// const { data } = await supabase.from('users').select('*')
// → users 테이블의 모든 데이터 가져오기
```

### 2.3 인증 (Clerk)

**💡 쉽게 설명:**
Clerk = 로그인/회원가입 기능을 대신 만들어주는 서비스
직접 만들면 몇 주 걸리는 걸 5분 만에 연동 가능!

**설치**

```bash
pnpm add @clerk/nextjs

```

**Middleware 설정**

**💡 쉽게 설명:**
Middleware = 경비원 같은 역할
"로그인 안 한 사람은 못 들어가!" 자동으로 막아줌

```tsx
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 로그인 없이 볼 수 있는 페이지 목록
const isPublicRoute = createRouteMatcher([
  "/", // 홈 (랜딩 페이지)
  "/login(.*)", // 로그인 페이지
  "/signup(.*)", // 회원가입 페이지
  "/api/webhooks/(.*)", // Stripe 결제 알림 받는 곳
]);

// 모든 요청에서 실행됨
export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect(); // 로그인 안 했으면 → 로그인 페이지로 튕김
  }
});

// 어떤 경로에서 middleware를 실행할지 설정
export const config = {
  matcher: [
    // 거의 모든 페이지에서 실행 (이미지, CSS 같은 파일은 제외)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

**사용자 정보 가져오기**

**💡 쉽게 설명:**
"지금 이 페이지를 보는 사람이 누구지?" 확인하는 코드

```tsx
// API Route에서 (app/api/news/route.ts 같은 곳)
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  // 1. 현재 로그인한 사람 확인
  const { userId } = await auth();

  // 2. 로그인 안 했으면 에러 반환
  if (!userId) {
    return Response.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  // 3. 데이터베이스에서 사용자 정보 조회
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", userId) // Clerk ID로 찾기
    .single(); // 1명만 가져오기

  // 4. 사용자 정보 반환
  return Response.json(data);
}
```

### 2.4 결제 (Stripe)

**💡 쉽게 설명:**
Stripe = 카드 결제를 대신 처리해주는 서비스
직접 카드 정보를 다루면 법적으로 복잡한데, Stripe가 다 해줌!

**설치**

```bash
pnpm add stripe              # 서버에서 사용 (결제 생성, Webhook 처리)
pnpm add @stripe/stripe-js   # 브라우저에서 사용 (결제 페이지 열기)

```

**서버 설정**

**💡 쉽게 설명:**
Stripe API에 접속하기 위한 연결 코드

```tsx
// lib/stripe.ts
import Stripe from "stripe";

// Stripe 연결 생성
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!, // Stripe 비밀 키
  {
    apiVersion: "2024-11-20.acacia", // API 버전 (Stripe가 자주 업데이트됨)
  },
);
```

**Checkout Session 생성**

**💡 쉽게 설명:**
"구독하기" 버튼을 누르면 → Stripe 결제 페이지를 만들어주는 코드

```tsx
// app/api/subscription/checkout/route.ts
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  // 1. 로그인한 사용자 확인
  const { userId } = await auth();
  const { plan } = await request.json();

  // 2. Stripe 결제 페이지 생성
  const session = await stripe.checkout.sessions.create({
    mode: "subscription", // 정기 구독
    payment_method_types: ["card"], // 카드 결제만
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID, // 월 5,900원 상품 ID
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`, // 결제 성공 시
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/paywall`, // 취소 시
    metadata: {
      userId, // 누가 결제했는지 기록
      plan,
    },
  });

  // 3. 결제 페이지 주소 반환
  return Response.json({ url: session.url });
}

// 사용자가 받는 응답:
// { url: "https://checkout.stripe.com/..." }
// → 이 주소로 이동하면 카드 입력 페이지가 나옴
```

**Webhook 처리**

**💡 쉽게 설명:**
Webhook = Stripe가 우리한테 보내는 알림
"이 사람 결제 완료했어요!" → 자동으로 DB 업데이트

```tsx
// app/api/webhooks/stripe/route.ts
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";

export async function POST(request: Request) {
  // 1. Stripe에서 보낸 데이터 읽기
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature")!;

  // 2. 진짜 Stripe에서 보낸 게 맞는지 확인 (보안)
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );

  // 3. "결제 완료" 이벤트일 때만 처리
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId } = session.metadata;

    // 4. 데이터베이스 업데이트: 무료 → 유료 전환
    await supabase
      .from("subscriptions")
      .update({
        plan: "premium", // 유료 플랜
        active: true, // 활성화
        stripe_subscription_id: session.subscription, // Stripe 구독 ID 저장
      })
      .eq("user_id", userId);
  }

  // 5. Stripe에게 "잘 받았어요" 응답
  return Response.json({ received: true });
}

// 📌 실행 흐름:
// 사용자가 카드 입력 → Stripe가 결제 처리 → Stripe가 이 코드 호출 → DB 자동 업데이트
```

### 2.5 AI (Google Gemini 2.5 Flash)

**💡 쉽게 설명:**
Google Gemini = 뉴스를 쉽게 설명해주는 AI
"어려운 경제 뉴스 → 중학생도 이해 가능한 설명"으로 바꿔줌

**설치**

```bash
pnpm add @google/generative-ai

```

**뉴스 분석 함수**

**💡 쉽게 설명:**
뉴스 원문을 Google Gemini에게 보내면 → 쉬운 해설을 받아오는 코드

````tsx
// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Google Gemini API 연결
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 뉴스 분석 함수
export async function analyzeNews(
  newsContent: string, // 뉴스 원문
  level: 1 | 2 | 3, // AI 레벨 (1=초보자, 2=일반, 3=전문가)
  userContexts: string[], // 사용자 상황 (예: ['대출보유', '직장인'])
) {
  // Google Gemini에게 보낼 요청 만들기
  const prompt = `
당신은 경제 뉴스 해설자입니다.
다음 뉴스를 ${
    level === 1 ? "중학생" : level === 2 ? "일반 직장인" : "경제 전문가"
  }도 이해할 수 있게 분석해주세요.

뉴스 내용:
${newsContent}

사용자 상황: ${userContexts.join(", ")}

다음 형식으로 JSON 응답해주세요:
{
  "easy_title": "쉬운 제목 (10자 이내)",
  "summary": "뉴스 해설 (10줄 이내)",
  "worst_scenario": "사용자 상황 기반 최악의 시나리오",
  "user_action_tip": "구체적인 행동 가이드"
}
  `;

  // Google Gemini API 호출
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // JSON 응답 추출 (마크다운 코드 블록 제거)
  const jsonMatch =
    response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/);
  const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : response;

  return JSON.parse(jsonText);
}

// 📌 사용 예시:
// const analysis = await analyzeNews(
//   "한국은행이 기준금리를 3.5%로 동결했다...",
//   2,  // Lv.2 (일반)
//   ['대출보유', '직장인']
// )
// 결과: { easy_title: "금리 그대로", summary: "...", ... }
````

### 2.6 FRED API (경제 지표 수집) - v2

**💡 쉽게 설명:**
FRED (Federal Reserve Economic Data) = 미국 연방준비은행에서 제공하는 경제 지표 데이터
금리, 실업률, 환율 같은 경제 데이터를 무료로 제공함

**설치**

```bash
# FRED API는 fetch로 직접 호출 (별도 SDK 불필요)
```

**FRED API 연결**

```tsx
// lib/fred.ts

// FRED API 호출 함수
async function fetchFredData(seriesId: string) {
  const apiKey = process.env.FRED_API_KEY!;
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=1&sort_order=desc`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`FRED API 호출 실패: ${response.statusText}`);
  }

  const data = await response.json();
  return data.observations[0]; // 최신 데이터 1개만 반환
}

// 경제 지표 수집 함수
export async function collectEconomicIndicators() {
  try {
    // 1. 장단기 금리차 (T10Y2Y)
    const yieldCurve = await fetchFredData("T10Y2Y");

    // 2. 미국 실업률 (UNRATE)
    const unemployment = await fetchFredData("UNRATE");

    // 3. 원/달러 환율 (DEXKOUS)
    const usdKrw = await fetchFredData("DEXKOUS");

    return {
      yield_curve: {
        value: parseFloat(yieldCurve.value),
        unit: "%p",
        date: yieldCurve.date,
        source: "FRED:T10Y2Y",
      },
      unemployment_rate: {
        value: parseFloat(unemployment.value),
        unit: "%",
        date: unemployment.date,
        source: "FRED:UNRATE",
      },
      usd_krw: {
        value: parseFloat(usdKrw.value),
        unit: "KRW",
        date: usdKrw.date,
        source: "FRED:DEXKOUS",
      },
    };
  } catch (error) {
    console.error("FRED API 호출 실패:", error);
    throw error;
  }
}

// 📌 사용 예시:
// const indicators = await collectEconomicIndicators()
// 결과: { yield_curve: {...}, unemployment_rate: {...}, usd_krw: {...} }
```

**신호등 색상 계산 (규칙 기반)**

```tsx
// lib/fred.ts (계속)

// 신호등 색상 결정 함수
export function determineStatusColor(
  indicators: any,
): "Red" | "Yellow" | "Green" {
  const { yield_curve, unemployment_rate, usd_krw } = indicators;

  let riskScore = 0;

  // 1. 장단기 금리차 (가장 중요한 지표)
  const yieldCurveDiff = yield_curve.value;
  if (yieldCurveDiff < -0.5) riskScore += 3; // 심각한 역전
  else if (yieldCurveDiff < 0) riskScore += 2; // 역전
  else if (yieldCurveDiff < 0.3) riskScore += 1; // 좁혀짐

  // 2. 실업률 (전월 대비 증가폭이 있다면 추가 계산 필요)
  // 여기서는 단순화를 위해 절대값으로 판단
  const unemploymentRate = unemployment_rate.value;
  if (unemploymentRate > 5.0) riskScore += 2;
  else if (unemploymentRate > 4.5) riskScore += 1;

  // 3. 원/달러 환율 (전월 대비 급등 - 여기서는 단순화)
  const usdKrwRate = usd_krw.value;
  if (usdKrwRate > 1400) riskScore += 2;
  else if (usdKrwRate > 1350) riskScore += 1;

  // 신호등 결정
  if (riskScore >= 5) return "Red"; // 위험
  if (riskScore >= 3) return "Yellow"; // 주의
  return "Green"; // 양호
}

// 📌 사용 예시:
// const color = determineStatusColor(indicators)
// 결과: 'Red', 'Yellow', 또는 'Green'
```

**경제 순환기 AI 분석 함수**

````tsx
// lib/gemini.ts (추가)

// 경제 순환기 요약 생성
export async function generateCycleSummary(
  statusColor: "Red" | "Yellow" | "Green",
  indicators: any,
) {
  const prompt = `
당신은 경제 분석 전문가입니다.
현재 신호등 색상은 ${
    statusColor === "Red"
      ? "빨강(위험)"
      : statusColor === "Yellow"
      ? "노랑(주의)"
      : "초록(양호)"
  }입니다.

다음 경제 지표를 바탕으로:
- 장단기 금리차: ${indicators.yield_curve.value}%p (${
    indicators.yield_curve.date
  })
- 미국 실업률: ${indicators.unemployment_rate.value}% (${
    indicators.unemployment_rate.date
  })
- 원/달러 환율: ${indicators.usd_krw.value}원 (${indicators.usd_krw.date})

1. 현재 상황을 2~3문장으로 요약해주세요 (summary_text)
2. 과거 유사 사례와 패턴을 찾아 3~4문장으로 설명해주세요 (historical_pattern)

다음 JSON 형식으로 응답해주세요:
{
  "summary_text": "현재 상황 요약",
  "historical_pattern": "역사적 패턴 설명"
}
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // JSON 응답 추출
  const jsonMatch =
    response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/);
  const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : response;

  return JSON.parse(jsonText);
}

// 📌 사용 예시:
// const analysis = await generateCycleSummary('Yellow', indicators)
// 결과: { summary_text: "...", historical_pattern: "..." }
````

---

## 3. 데이터베이스 설계

### 3.1 Supabase 초기 설정

**데이터베이스 설계 도구:** ERD Cloud를 사용하여 데이터베이스 스키마 설계 및 SQL 추출

**1단계: 프로젝트 생성**

- supabase.com 접속
- "New Project" 클릭
- Region: Northeast Asia (Seoul) 선택

**2단계: RLS 비활성화**

```sql
-- 모든 테이블에 대해 실행
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE interests DISABLE ROW LEVEL SECURITY;
ALTER TABLE contexts DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_contexts DISABLE ROW LEVEL SECURITY;
ALTER TABLE news DISABLE ROW LEVEL SECURITY;
ALTER TABLE news_analysis_levels DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE sources DISABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_explanations DISABLE ROW LEVEL SECURITY;

```

**3단계: 테이블 생성**

- PRD의 "5. 데이터 스키마" 섹션 SQL 실행
- 또는 `/home/claude/news_in_flight_schema_optimized.sql` 파일 실행

### 3.2 주요 쿼리 패턴

**사용자 맞춤 뉴스 조회**

```tsx
// app/api/news/route.ts
export async function GET(request: Request) {
  const { userId } = await auth();
  const { searchParams } = new URL(request.url);
  const date =
    searchParams.get("date") || new Date().toISOString().split("T")[0];

  // 1. 사용자 프로필 조회
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("ai_level")
    .eq("user_id", userId)
    .single();

  // 2. 사용자 관심사 조회
  const { data: userInterests } = await supabase
    .from("user_interests")
    .select("interest_id, interests(slug)")
    .eq("user_id", userId);

  const interestSlugs = userInterests.map((ui) => ui.interests.slug);

  // 3. 뉴스 + 분석 조회
  const { data: news } = await supabase
    .from("news")
    .select(
      `
      id,
      title,
      published_at,
      category,
      news_analysis_levels!inner(
        easy_title,
        summary,
        worst_scenario,
        user_action_tip
      )
    `,
    )
    .in("category", interestSlugs)
    .eq("news_analysis_levels.level", profile.ai_level)
    .gte("published_at", `${date}T00:00:00`)
    .lte("published_at", `${date}T23:59:59`)
    .eq("is_curated", true)
    .order("published_at", { ascending: false })
    .limit(5);

  return Response.json({ news });
}
```

**구독 상태 확인**

```tsx
// lib/subscription.ts
export async function checkSubscription(userId: string) {
  const { data } = await supabase
    .from("subscriptions")
    .select("plan, active, ends_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const now = new Date();
  const endsAt = new Date(data.ends_at);

  return {
    isActive: data.active && endsAt > now,
    plan: data.plan,
    daysRemaining: Math.ceil((endsAt - now) / (1000 * 60 * 60 * 24)),
  };
}
```

**경제 순환기 데이터 조회 (v2)**

```tsx
// lib/cycle.ts
export async function getLatestCycleData() {
  const { data } = await supabase
    .from("cycle_explanations")
    .select(
      "status_color, summary_text, historical_pattern, indicators_snapshot, recorded_at",
    )
    .eq("is_latest", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data;
}

// 📌 사용 예시:
// const cycleData = await getLatestCycleData()
// 결과: { status_color: 'Yellow', summary_text: "...", ... }
```

### 3.3 Seed 데이터

**관심사 초기 데이터**

```sql
INSERT INTO interests (name, slug, display_order) VALUES
  ('부동산', 'real-estate', 1),
  ('가상화폐', 'crypto', 2),
  ('ETF', 'etf', 3),
  ('주식', 'stock', 4),
  ('환율', 'forex', 5);

```

**상황 초기 데이터**

```sql
INSERT INTO contexts (name, slug, display_order) VALUES
  ('대출보유', 'loan-holder', 1),
  ('예적금만함', 'savings-only', 2),
  ('달러보유', 'usd-holder', 3),
  ('사업가', 'business-owner', 4),
  ('직장인', 'employee', 5),
  ('해외여행', 'traveler', 6);

```

---

## 4. API 명세서

### 📱 서비스 개요

**경제 뉴스를 사용자 맞춤형으로 해설해주는 서비스**

### 🔄 백엔드 작업 (n8n) - 매일 아침 8시 자동 실행:

1. **뉴스 수집**

   - RSS에서 경제 뉴스 가져오기
   - 어제 날짜 뉴스만 필터링

2. **AI 해설 생성** (관심분야별)

   - 뉴스가 "주식"과 관련있으면 → 주식 버전 해설 생성
   - 뉴스가 "부동산"과 관련있으면 → 부동산 버전 해설 생성
   - 관련 없으면 → 그 관심분야로는 저장 안 함

3. **레벨별 해설 생성** (각 뉴스마다)

   - 레벨1 제목 + 내용
   - 레벨2 제목 + 내용
   - 레벨3 제목 + 내용

4. **상황별 해설 생성** (6개 전부)

   - 최악의 시나리오:

     - 직장인인 당신은...
     - 대출보유한 당신은...
     - 예적금하는 당신은...
     - 달러보유한 당신은...
     - 사업가인 당신은...
     - 해외여행 준비하는 당신은...

   - 액션 팁:
     - 직장인인 당신은...
     - 대출보유한 당신은...
     - (위와 동일하게 6개)

5. **DB 저장**
   - 1개 뉴스 × 관련된 관심분야 개수 = N개 행 저장
   - 예: 주식+부동산 관련 뉴스 → 2개 행

### 💻 프론트엔드 화면

#### 뉴스 목록 페이지

**상단 카테고리 탭:**

- 사용자가 선택한 관심분야만 표시
- 예: [주식] [부동산] [ETF] 버튼

**동작:**

- [주식] 클릭 → 주식 관련 뉴스만 표시
- [부동산] 클릭 → 부동산 관련 뉴스만 표시

#### 뉴스 상세 페이지

**사용자 설정:**

- 레벨: 2
- 관심분야: 주식, 부동산
- 상황: 직장인, 대출보유

**화면 표시:**

```
# 직장인을 위한 실전 제목
(레벨2 제목)

경제 해설 3문장...
(레벨2 내용)

━━━━━━━━━━━━━━━━

최악의 시나리오:

😱 직장인인 당신은, 이 정책을 모르면...
😱 대출보유한 당신은, 금리 변동으로...

━━━━━━━━━━━━━━━━

액션 팁:

✅ 직장인인 당신은, 지금 당장 포트폴리오를...
✅ 대출보유한 당신은, 금리 고정 상품을...
```

**핵심:**

- 6개 상황이 DB에 다 저장되어 있지만
- **사용자가 선택한 2개만** 화면에 표시
- 다른 사용자(예: 사업가, 해외여행 선택)는 그 2개만 보임

### 4.1 인증 API

**POST `/api/auth/webhook`**

- Clerk Webhook으로 사용자 생성 시 DB 동기화

```tsx
export async function POST(request: Request) {
  const payload = await request.json();
  const { type, data } = payload;

  if (type === "user.created") {
    await supabase.from("users").insert({
      clerk_id: data.id,
      email: data.email_addresses[0].email_address,
      name: data.first_name,
    });
  }

  return Response.json({ success: true });
}
```

### 4.2 온보딩 API

**POST `/api/onboarding/complete`**

```tsx
// Request Body
{
  "level": 2,
  "interests": ["stock", "etf"],
  "contexts": ["loan-holder", "employee"]
}

// Response
{
  "success": true,
  "profile_id": "uuid"
}

```

**구현**

```tsx
export async function POST(request: Request) {
  const { userId } = await auth();
  const { level, interests, contexts } = await request.json();

  // 1. 프로필 생성
  const { data: profile } = await supabase
    .from("user_profiles")
    .insert({
      user_id: userId,
      ai_level: level,
      onboarded_at: new Date().toISOString(),
    })
    .select()
    .single();

  // 2. 관심사 연결
  const interestRecords = await supabase
    .from("interests")
    .select("id")
    .in("slug", interests);

  await supabase.from("user_interests").insert(
    interestRecords.data.map((i) => ({
      user_id: userId,
      interest_id: i.id,
    })),
  );

  // 3. 상황 연결
  const contextRecords = await supabase
    .from("contexts")
    .select("id")
    .in("slug", contexts);

  await supabase.from("user_contexts").insert(
    contextRecords.data.map((c) => ({
      user_id: userId,
      context_id: c.id,
    })),
  );

  // 4. 무료 구독 시작
  await supabase.from("subscriptions").insert({
    user_id: userId,
    plan: "free",
    started_at: new Date().toISOString(),
    ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
  });

  return Response.json({ success: true, profile_id: profile.id });
}
```

### 4.3 뉴스 API

**GET `/api/news?date=2025-01-15&category=stock`**

```tsx
// Response
{
  "news": [
    {
      "id": "uuid",
      "title": "한은 기준금리 동결",
      "category": "stock",
      "published_at": "2025-01-15T09:00:00Z",
      "analysis": {
        "easy_title": "금리 그대로 유지",
        "summary": "한국은행이...",
        "worst_scenario": "대출 이자 계속 부담...",
        "should_blur": false
      }
    }
  ],
  "subscription": {
    "active": true,
    "days_remaining": 15
  }
}

```

**GET `/api/news/[id]`**

```tsx
// Response
{
  "id": "uuid",
  "title": "한은 기준금리 동결",
  "url": "https://news.com/...",
  "published_at": "2025-01-15T09:00:00Z",
  "source": "조선일보",
  "analysis": {
    "level": 2,
    "easy_title": "금리 그대로 유지",
    "summary": "한국은행이...",
    "worst_scenario": "대출 이자 계속 부담...",
    "user_action_tip": "구체적인 행동 가이드",
    "should_blur": false
  },
  "subscription": {
    "active": true,
    "days_remaining": 15
  }
}

```

### 4.4 구독 API

**GET `/api/subscription/status`**

```tsx
// Response
{
  "plan": "free",
  "active": true,
  "ends_at": "2025-02-14T00:00:00Z",
  "days_remaining": 15
}

```

**POST `/api/subscription/checkout`**

```tsx
// Request
{ "plan": "premium" }

// Response
{ "url": "https://checkout.stripe.com/..." }

```

### 4.5 경제 순환기 API (v2)

**GET `/api/cycle/current`**

```tsx
// Response
{
  "status_color": "Yellow",  // Red/Yellow/Green (규칙 기반 자동 계산)
  "summary_text": "미국 장단기 금리차가 -0.4%p로 역전된 상태가 지속되고 있습니다.",
  "historical_pattern": "과거 1980년 이후 금리차가 역전된 사례에서, 평균 12~18개월 후 경기 침체(Recession)가 뒤따랐던 역사적 패턴이 있습니다.",
  "indicators_snapshot": {
    "yield_curve": {
      "value": -0.42,
      "unit": "%p",
      "date": "2025-12-11",
      "source": "FRED:T10Y2Y"
    },
    "unemployment_rate": {
      "value": 4.2,
      "unit": "%",
      "date": "2025-11-30",
      "source": "FRED:UNRATE"
    },
    "usd_krw": {
      "value": 1330.5,
      "unit": "KRW",
      "date": "2025-12-11",
      "source": "FRED:DEXKOUS"
    }
  },
  "updated_at": "2025-12-12T09:00:00Z"
}
```

**구현 (n8n 워크플로우)**

**💡 쉽게 설명:**
n8n = 코드 없이 자동화를 만들 수 있는 도구
매일 아침 9시에 자동으로 FRED API에서 데이터 수집 → 신호등 색상 계산 → Google Gemini에게 요약 요청 → DB 저장

```
[n8n 워크플로우 - 매일 09:00 자동 실행]

1. Schedule Trigger (매일 09:00)
   ↓
2. HTTP Request (FRED API)
   - 장단기 금리차, 실업률, 환율 수집
   ↓
3. Function Node (신호등 색상 계산)
   - determineStatusColor() 로직 실행
   ↓
4. HTTP Request (Google Gemini API)
   - Input: status_color + indicators
   - Output: summary_text + historical_pattern
   ↓
5. Database Update (Supabase)
   - 이전 레코드의 is_latest = false
   - 새 레코드 INSERT (is_latest = true)
```

**API Route 구현**

```tsx
// app/api/cycle/current/route.ts
import { getLatestCycleData } from "@/lib/cycle";

export async function GET(request: Request) {
  try {
    const data = await getLatestCycleData();

    if (!data) {
      return Response.json(
        { error: "경제 순환기 데이터가 없습니다" },
        { status: 404 },
      );
    }

    return Response.json({
      status_color: data.status_color,
      summary_text: data.summary_text,
      historical_pattern: data.historical_pattern,
      indicators_snapshot: data.indicators_snapshot,
      updated_at: data.recorded_at,
    });
  } catch (error) {
    console.error("경제 순환기 데이터 조회 실패:", error);
    return Response.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}

// 📌 실행 흐름:
// 사용자가 /cycle 페이지 접속 → GET /api/cycle/current 호출 → 최신 데이터 반환
```

---

## 5. 보안 요구사항

### 5.1 인증 미들웨어 (필수)

**모든 API에 적용**

```tsx
// lib/auth-middleware.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function withAuth(
  handler: (request: Request, userId: string) => Promise<Response>,
) {
  return async (request: Request) => {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "로그인이 필요합니다" },
        { status: 401 },
      );
    }

    return handler(request, userId);
  };
}

// 사용 예시
export const GET = withAuth(async (request, userId) => {
  // userId로 본인 데이터만 조회
  const data = await supabase.from("news").select("*").eq("user_id", userId);

  return Response.json(data);
});
```

### 5.2 환경 변수 관리

**Vercel 설정**

```bash
# Production
GEMINI_API_KEY=AIza... (Google Gemini 2.5 Flash - 뉴스 분석 및 해설용)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLERK_SECRET_KEY=sk_live_...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
FRED_API_KEY=xxx... (경제 지표 수집용)
NEXT_PUBLIC_URL=https://newsin.flight

# Development
GEMINI_API_KEY=AIza... (Google Gemini 2.5 Flash - 뉴스 분석 및 해설용)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLERK_SECRET_KEY=sk_test_...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
FRED_API_KEY=xxx... (경제 지표 수집용)
NEXT_PUBLIC_URL=http://localhost:3000

```

**로컬 개발 (.env.local)**

```bash
# ⚠️ 절대 GitHub에 업로드 금지!
GEMINI_API_KEY=AIza... (Google Gemini 2.5 Flash - 뉴스 분석 및 해설용)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLERK_SECRET_KEY=sk_test_...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
FRED_API_KEY=xxx... (경제 지표 수집용)
NEXT_PUBLIC_URL=http://localhost:3000

```

### 5.3 보안 체크리스트

**코드 레벨:**

- [ ] 모든 API Route에 `withAuth` 적용
- [ ] `user_id` 필터링으로 본인 데이터만 접근
- [ ] `SUPABASE_SERVICE_ROLE_KEY`는 서버 코드에서만 사용
- [ ] 클라이언트 컴포넌트에 `NEXT_PUBLIC_` 없는 환경 변수 사용 금지

**배포 레벨:**

- [ ] Vercel Environment Variables 모두 설정
- [ ] `.env.local` 파일 `.gitignore`에 추가
- [ ] GitHub에 실제 키 노출 안 됨 확인
- [ ] Stripe Webhook 엔드포인트 등록

---

## 6. 성능 최적화

### 6.1 캐싱 전략

**뉴스 데이터 캐싱**

```tsx
// app/api/news/route.ts
import { unstable_cache } from "next/cache";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const date =
    searchParams.get("date") || new Date().toISOString().split("T")[0];

  // 날짜별로 1시간 캐싱
  const cachedNews = unstable_cache(
    async () => {
      return await supabase.from("news").select("*").eq("published_at", date);
    },
    [`news-${date}`],
    { revalidate: 3600 }, // 1시간
  );

  const news = await cachedNews();
  return Response.json(news);
};
```

**정적 페이지 생성**

```tsx
// app/page.tsx (랜딩 페이지)
export const metadata = {
  title: "News In Flight - 경제 뉴스 AI 해석 서비스",
  description: "AI가 내 상황에 맞춰 경제 뉴스를 쉽게 해석해드립니다",
};

export default function LandingPage() {
  return <div>...</div>;
}

// 정적으로 빌드
export const dynamic = "force-static";
```

### 6.2 이미지 최적화

**Next.js Image 컴포넌트 사용**

```tsx
import Image from "next/image";

export function NewsCard({ thumbnail }) {
  return (
    <Image
      src={thumbnail}
      alt="뉴스 썸네일"
      width={400}
      height={300}
      loading="lazy"
      placeholder="blur"
      blurDataURL="/placeholder.jpg"
    />
  );
}
```

### 6.3 번들 최적화

**동적 임포트**

```tsx
// 무거운 컴포넌트는 동적 임포트
import dynamic from "next/dynamic";

const CycleChart = dynamic(() => import("@/components/cycle-chart"), {
  loading: () => <div>로딩 중...</div>,
  ssr: false,
});

export default function CyclePage() {
  return <CycleChart />;
}
```

---

## 7. 테스트 전략

### 7.1 단위 테스트

**설치**

```bash
pnpm add --save-dev vitest @testing-library/react @testing-library/jest-dom

```

**API 함수 테스트**

```tsx
// __tests__/lib/subscription.test.ts
import { describe, it, expect } from "vitest";
import { checkSubscription } from "@/lib/subscription";

describe("checkSubscription", () => {
  it("활성 구독은 true 반환", async () => {
    const result = await checkSubscription("user-123");
    expect(result.isActive).toBe(true);
  });

  it("만료된 구독은 false 반환", async () => {
    const result = await checkSubscription("user-expired");
    expect(result.isActive).toBe(false);
  });
});
```

### 7.2 E2E 테스트

**Playwright 설치**

```bash
pnpm add --save-dev @playwright/test

```

**회원가입 플로우 테스트**

```tsx
// e2e/onboarding.spec.ts
import { test, expect } from "@playwright/test";

test("온보딩 완료 후 대시보드 이동", async ({ page }) => {
  await page.goto("/signup");

  // 회원가입
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');

  // 관심사 선택
  await page.click("text=주식");
  await page.click("text=ETF");
  await page.click('button:has-text("다음")');

  // 상황 선택
  await page.click("text=대출보유");
  await page.click("text=직장인");
  await page.click('button:has-text("다음")');

  // AI 레벨 선택
  await page.click("text=Lv.2");
  await page.click('button:has-text("완료")');

  // 대시보드 확인
  await expect(page).toHaveURL("/dashboard");
  await expect(page.locator("h1")).toContainText("오늘의 뉴스");
});
```

### 7.3 성능 테스트

**Lighthouse CI**

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm add && pnpm build
      - run: pnpm add -g @lhci/cli
      - run: lhci autorun
```

---

## 8. 배포 가이드

### 8.1 Vercel 배포

**1단계: GitHub 연동**

1. Vercel 로그인
2. "New Project" 클릭
3. GitHub 저장소 선택

**2단계: 환경 변수 설정**

- Settings → Environment Variables
- Production, Preview, Development 모두 설정

**3단계: 빌드 설정**

```
Framework Preset: Next.js
Build Command: pnpm build
Output Directory: .next
Install Command: pnpm add

```

**4단계: 도메인 설정**

- Settings → Domains
- 커스텀 도메인 추가 (예: newsin.flight)

### 8.2 Stripe Webhook 설정

1. Stripe Dashboard → Developers → Webhooks
2. "Add endpoint" 클릭
3. Endpoint URL: `https://newsin.flight/api/webhooks/stripe`
4. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. Webhook Secret 복사 → Vercel 환경 변수에 추가

### 8.3 Clerk Webhook 설정

1. Clerk Dashboard → Webhooks
2. "Add Endpoint" 클릭
3. Endpoint URL: `https://newsin.flight/api/auth/webhook`
4. Events:
   - `user.created`
   - `user.updated`
5. Signing Secret 복사 → Vercel 환경 변수에 추가

---

## 9. 모니터링 및 로깅

### 9.1 Sentry 설정

**설치**

```bash
pnpm add @sentry/nextjs

```

**초기화**

```tsx
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

**에러 추적**

```tsx
// API Route에서
try {
  const result = await riskyOperation();
} catch (error) {
  Sentry.captureException(error);
  return Response.json({ error: "서버 오류" }, { status: 500 });
}
```

### 9.2 PostHog 설정

**설치**

```bash
pnpm add posthog-js

```

**이벤트 추적**

```tsx
// lib/analytics.ts
import posthog from "posthog-js";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "https://app.posthog.com",
  });
}

export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>,
) => {
  posthog.capture(eventName, properties);
};

// 사용 예시
trackEvent("news_clicked", { news_id: "123", category: "stock" });
trackEvent("subscription_completed", { plan: "premium" });
```

---

## 10. 개발 워크플로우

### 10.1 로컬 개발

**1단계: 저장소 클론**

```bash
git clone https://github.com/yourname/news-in-flight.git
cd news-in-flight

```

**2단계: 의존성 설치**

```bash
pnpm add

```

**3단계: 환경 변수 설정**

```bash
cp .env.example .env.local
# .env.local 파일 수정 (실제 키 입력)

```

**4단계: 개발 서버 실행**

```bash
pnpm dev

```

**5단계: 브라우저 접속**

```
http://localhost:3000

```

### 10.2 Git 브랜치 전략

**브랜치 구조**

```
main (프로덕션)
  ↓
develop (개발)
  ↓
feature/온보딩-ui (기능 개발)
feature/결제-연동
hotfix/로그인-버그수정

```

**커밋 메시지 규칙**

```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 코드
chore: 빌드 설정

예시:
feat: 온보딩 관심사 선택 UI 추가
fix: 뉴스 상세 페이지 블러 로직 수정

```

### 10.3 배포 플로우

```
1. feature 브랜치에서 개발
2. develop에 PR (Pull Request)
3. 코드 리뷰 + 테스트 통과
4. develop 머지
5. develop → main PR (주간 배포)
6. main 머지 → Vercel 자동 배포

```

---

## 11. 트러블슈팅

### 11.1 자주 발생하는 오류

**1. Clerk 인증 실패**

```
Error: Unable to authenticate user

```

**해결:**

- Clerk Secret Key 확인
- middleware.ts에서 공개 라우트 설정 확인
- 쿠키 설정 확인 (sameSite, secure)

**2. Supabase 연결 오류**

```
Error: Failed to connect to Supabase

```

**해결:**

- `SUPABASE_URL` 환경 변수 확인
- `SUPABASE_SERVICE_ROLE_KEY` 확인 (anon key 아님!)
- Supabase 프로젝트가 활성화되어 있는지 확인

**3. Stripe Webhook 실패**

```
Error: Webhook signature verification failed

```

**해결:**

- `STRIPE_WEBHOOK_SECRET` 확인
- Stripe Dashboard에서 Webhook 엔드포인트 URL 확인
- 로컬 테스트 시 `stripe listen --forward-to localhost:3000/api/webhooks/stripe` 사용

**4. Google Gemini API 할당량 초과**

```
Error: Rate limit exceeded

```

**해결:**

- Google Cloud Console에서 사용량 확인
- 뉴스 분석을 배치로 처리 (한 번에 15개)
- 캐싱으로 중복 호출 방지

**5. FRED API 호출 실패 (v2)**

```
Error: Failed to fetch FRED data

```

**해결:**

- `FRED_API_KEY` 환경 변수 확인
- FRED API 상태 확인 (https://fred.stlouisfed.org)
- 요청 횟수 제한 확인 (하루 120,000회)
- n8n 워크플로우에서 재시도 로직 추가

**6. n8n 워크플로우 실행 실패 (v2)**

```
Error: Workflow execution failed

```

**해결:**

- n8n 로그 확인
- FRED API, Google Gemini API 키 확인
- Supabase 연결 확인
- 수동 실행으로 각 노드 개별 테스트

### 11.2 성능 이슈

**느린 페이지 로딩**

- Lighthouse로 병목 지점 확인
- 이미지 최적화 (Next.js Image 사용)
- 불필요한 JavaScript 제거
- 서버 컴포넌트 활용

**높은 API 비용**

- Google Gemini API 호출 최소화 (캐싱)
- Stripe API는 webhook 이벤트만 처리
- Supabase 쿼리 최적화 (필요한 컬럼만 select)

---

## 12. 부록

### 12.1 유용한 명령어

**💡 쉽게 설명:** 터미널(명령 프롬프트)에서 입력하는 명령어들

```bash
# 개발 서버 실행 (내 컴퓨터에서 테스트)
pnpm dev

# 프로덕션 빌드 (실제 배포용 파일 만들기)
pnpm build

# 프로덕션 서버 로컬 실행 (빌드한 파일 테스트)
pnpm start

# 린트 체크 (코드에 문제 있는지 검사)
pnpm lint

---

## 🎯 최종 목표

1. **개인화:** 내가 선택한 관심분야, 상황, 레벨에 딱 맞는 뉴스
2. **자동화:** 매일 자동으로 최신 뉴스 해설 생성
3. **필터링:** 관련 없는 뉴스는 안 보임
4. **실용성:** "나"에게 필요한 정보만 간결하게

# 타입 체크 (TypeScript 오류 확인)
pnpm type-check

# 테스트 실행 (자동 테스트 돌리기)
pnpm test

# E2E 테스트 (실제 사용자처럼 클릭해보는 테스트)
pnpm test:e2e

# 데이터베이스 마이그레이션 (DB 구조 업데이트)
pnpm db:migrate

# Stripe CLI로 Webhook 테스트 (로컬에서 결제 테스트)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# n8n 로컬 실행 (v2 - 자동화 워크플로우 테스트)
npx n8n

```

### 12.2 참고 문서

**공식 문서:**

- Next.js: https://nextjs.org/docs
- Clerk: https://clerk.com/docs
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs/api
- Google Gemini: https://ai.google.dev/docs
- FRED API: https://fred.stlouisfed.org/docs/api/fred/
- n8n: https://docs.n8n.io
- ERD Cloud: https://www.erdcloud.com

**커뮤니티:**

- Next.js Discord
- Clerk Discord
- Supabase Discord
- n8n Community Forum

### 12.3 개발 일정 체크포인트

**Week 1 (12/11~12/17):**

- [ ] Next.js 15.5.9 프로젝트 생성
- [ ] Clerk 인증 연동
- [ ] ERD Cloud로 데이터베이스 스키마 설계 및 SQL 추출
- [ ] Supabase 테이블 생성
- [ ] Google Gemini API 테스트 코드 작성
- [ ] 온보딩 UI 기본 구조

**Week 2 (12/18~12/24):**

- [ ] 메인 대시보드 UI
- [ ] 뉴스 상세 페이지
- [ ] API Routes 전체 구현
- [ ] 인증 미들웨어 적용

**Week 3 (12/25~12/31):**

- [ ] 경제 순환기 지도 (v2)
  - [ ] FRED API 연동 (장단기 금리차, 실업률, 환율)
  - [ ] 신호등 색상 로직 구현 (determineStatusColor)
  - [ ] n8n 워크플로우 설정 (매일 09:00 자동 실행)
  - [ ] Google Gemini API로 요약 생성
  - [ ] cycle_explanations 테이블 구축
  - [ ] GET /api/cycle/current API 구현
- [ ] 개인화 알고리즘
- [ ] 통합 테스트

**Week 4 (01/01~01/07):**

- [ ] Stripe 결제 연동
- [ ] Webhook 처리
- [ ] 프로필 설정 페이지

**Week 5 (01/08~01/13):**

- [ ] 전체 QA
- [ ] 성능 최적화
- [ ] 법적 문서 작성
- [ ] 프로덕션 배포

---

이 TRD는 개발 진행 중 변경될 수 있으며, 중요한 기술적 결정은 문서에 즉시 반영합니다.
