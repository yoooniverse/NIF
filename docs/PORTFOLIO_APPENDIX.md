# 포트폴리오 부록 (Portfolio Appendix)

## News In Flight - 경제 뉴스 AI 해석 서비스

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택 상세](#2-기술-스택-상세)
3. [시스템 아키텍처](#3-시스템-아키텍처)
4. [주요 기능 구현](#4-주요-기능-구현)
5. [데이터베이스 설계](#5-데이터베이스-설계)
6. [API 설계](#6-api-설계)
7. [트러블슈팅 및 문제 해결](#7-트러블슈팅-및-문제-해결)
8. [성능 최적화](#8-성능-최적화)
9. [개발 프로세스 및 의사결정](#9-개발-프로세스-및-의사결정)
10. [성과 및 학습](#10-성과-및-학습)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 소개

**News In Flight**는 AI 기반 경제 뉴스 해석 서비스로, 복잡한 경제 뉴스를 사용자의 관심사와 이해 수준에 맞춰 쉽게 풀어서 제공하는 웹 애플리케이션입니다.

### 1.2 개발 기간 및 현황

- **개발 기간:** 33일 (2025.12.11 ~ 2026.01.13)
- **현재 진행 상황:** Day 27 (Week 4, QA 및 최적화 진행 중)
- **개발 진행률:** Week 1-3 완료 (100%), Week 4 진행 중 (70%)

### 1.3 핵심 가치 제안

- **문제점:** 경제 뉴스가 어렵고, 개인의 삶과의 연결고리를 파악하기 어려움
- **해결책:** AI가 사용자의 상황(대출 보유, 주식 투자 등)에 맞춰 뉴스를 쉽게 해석
- **차별점:**
  - 카테고리별 Top 5만 엄선
  - 개인화된 위험 시나리오 제공
  - 경제 순환기 시각화
  - 3D 지구 기반 In Flight Map 컨셉의 독특한 UX

### 1.4 비즈니스 모델

- **무료 체험:** 30일 무료 체험 제공
- **유료 구독:** 월 5,900원 (얼리버드 가격)
- **결제 시스템:** 토스페이먼츠 (v3: Post-Launch로 연기)

---

## 2. 기술 스택 상세

### 2.1 Frontend

| 기술                  | 버전     | 용도             | 선택 이유                                         |
| --------------------- | -------- | ---------------- | ------------------------------------------------- |
| **Next.js**           | 15.5.9   | React 프레임워크 | App Router, Server Components, 최신 React 19 지원 |
| **React**             | 19.0.0   | UI 라이브러리    | 최신 동시성 기능, Server Components 지원          |
| **TypeScript**        | 5.x      | 정적 타입 체크   | 타입 안전성, 개발 생산성 향상                     |
| **Tailwind CSS**      | v4       | 스타일링         | 빠른 스타일링, 유틸리티 우선 접근법               |
| **Three.js**          | 0.182.0  | 3D 그래픽        | 3D 지구 시각화                                    |
| **React Three Fiber** | 9.4.2    | React용 Three.js | React와 Three.js 통합                             |
| **Framer Motion**     | 12.23.26 | 애니메이션       | 부드러운 페이지 전환, 인터랙션                    |

### 2.2 Backend & Database

| 기술                   | 용도                    | 선택 이유                                      |
| ---------------------- | ----------------------- | ---------------------------------------------- |
| **Next.js API Routes** | RESTful API             | 서버리스 함수, 간단한 배포                     |
| **Supabase**           | PostgreSQL 데이터베이스 | 완전 관리형 DB, 실시간 기능                    |
| **n8n**                | 워크플로우 자동화       | 노코드 자동화, 뉴스 수집 및 AI 분석 파이프라인 |

### 2.3 인증 & 결제

| 기술             | 용도        | 선택 이유                                  |
| ---------------- | ----------- | ------------------------------------------ |
| **Clerk**        | 사용자 인증 | 소셜 로그인, 한국어 지원, 간단한 연동      |
| **토스페이먼츠** | 결제 시스템 | 국내 사용자 친화적, 자동결제(Billing) 지원 |

### 2.4 AI & 데이터 소스

| 기술                        | 용도              | 선택 이유                                |
| --------------------------- | ----------------- | ---------------------------------------- |
| **Google Gemini 2.5 Flash** | 뉴스 분석 및 해설 | 빠른 응답 속도, 한국어 지원, 비용 효율적 |
| **FRED API**                | 경제 지표 수집    | 무료, 신뢰성 높은 경제 데이터            |
| **RSS**                     | 뉴스 수집         | 표준화된 뉴스 피드                       |

### 2.5 호스팅 & 모니터링

| 기술                 | 용도                     | 선택 이유                             |
| -------------------- | ------------------------ | ------------------------------------- |
| **Vercel**           | 프론트엔드 및 API 호스팅 | Next.js 최적화, 자동 배포, 글로벌 CDN |
| **Supabase Cloud**   | 데이터베이스 호스팅      | 완전 관리형, 백업 자동화              |
| **Vercel Analytics** | 성능 모니터링            | 실시간 성능 지표                      |
| **PostHog**          | 이벤트 트래킹            | 사용자 행동 분석                      |

### 2.6 UI 컴포넌트 라이브러리

| 기술                | 용도                                                  |
| ------------------- | ----------------------------------------------------- |
| **Radix UI**        | 접근성 좋은 UI 컴포넌트 (Dialog, Accordion, Label 등) |
| **shadcn/ui**       | 커스터마이징 가능한 UI 컴포넌트                       |
| **React Hook Form** | 폼 상태 관리 및 유효성 검사                           |
| **Zod**             | 스키마 검증                                           |

---

## 3. 시스템 아키텍처

### 3.1 전체 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                        사용자 브라우저                        │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Next.js 15.5.9)                  │
│  ┌─────────────┬──────────────────┬────────────────────┐    │
│  │  Frontend   │   API Routes     │ Server Actions     │    │
│  │  (React 19) │   (/api/*)       │                    │    │
│  └─────────────┴──────────────────┴────────────────────┘    │
└──────────────────┬──────────────────┬───────────────────────┘
                   │                  │
       ┌───────────┴──────────┬───────┴────────┬─────────────┐
       │                      │                │             │
       ▼                      ▼                ▼             ▼
┌──────────────┐   ┌─────────────────┐   ┌─────────┐   ┌────────────┐
│    Clerk     │   │    Supabase     │   │  FRED   │   │   n8n      │
│   (인증)     │   │  (PostgreSQL)   │   │  API    │   │ (자동화)   │
└──────────────┘   └─────────────────┘   └─────────┘   └────────────┘
                            │                                 │
                            │                                 ▼
                            │                    ┌────────────────────┐
                            │                    │  Google Gemini     │
                            │                    │  2.5 Flash         │
                            │                    │  (뉴스 분석)       │
                            │                    └────────────────────┘
                            │                                 │
                            └─────────────────────────────────┘
```

### 3.2 데이터 플로우

#### 3.2.1 사용자 온보딩 플로우

```
1. 회원가입 (Clerk)
   ↓
2. Clerk Webhook → /api/sync-user → users 테이블 생성
   ↓
3. 온보딩 단계 1: 관심사 선택 (부동산, 주식, ETF 등)
   ↓
4. 온보딩 단계 2: 상황 선택 (대출보유, 직장인 등)
   ↓
5. 온보딩 단계 3: AI 레벨 선택 (Lv.1, 2, 3)
   ↓
6. /api/onboarding/complete → DB에 프로필 저장
   - user_profiles 테이블
   - user_interests 연결 테이블
   - user_contexts 연결 테이블
   - subscriptions 테이블 (30일 무료 체험)
   ↓
7. 대시보드로 리다이렉트
```

#### 3.2.2 뉴스 수집 및 AI 분석 플로우 (자동화 - n8n)

```
┌────────────────────────────────────────────────────────────┐
│            n8n 워크플로우 (매일 아침 8시 실행)              │
└────────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  1. RSS에서 경제 뉴스 수집           │
        │     (조선일보, 한경, 머니투데이 등)  │
        └──────────────┬───────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────┐
        │  2. 어제 날짜 뉴스만 필터링          │
        └──────────────┬───────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────┐
        │  3. Google Gemini 2.5 Flash 호출     │
        │     뉴스 원문 → AI 분석               │
        │     - 카테고리 분류 (주식, 부동산 등)│
        │     - 레벨별 해설 생성 (Lv.1, 2, 3)  │
        │     - 상황별 시나리오 생성 (6개)     │
        └──────────────┬───────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────┐
        │  4. Supabase DB 저장                 │
        │     - news 테이블                    │
        │     - news_analysis_levels 테이블    │
        │     (1개 뉴스 × 관심분야 N개 = N행)  │
        └──────────────────────────────────────┘
```

#### 3.2.3 사용자 뉴스 조회 플로우

```
사용자 → /news/today 페이지 접속
        ↓
GET /api/news?date=today
        ↓
1. Clerk에서 userId 확인
        ↓
2. user_profiles에서 AI 레벨 조회 (예: Lv.2)
        ↓
3. user_interests에서 관심사 조회 (예: 주식, ETF)
        ↓
4. news JOIN news_analysis_levels
   WHERE category IN ('주식', 'ETF')
   AND level = 2
   AND published_at = today
        ↓
5. 구독 상태 확인 (무료 체험 남은 기간)
        ↓
6. 결과 반환 (뉴스 목록 + 구독 정보)
```

### 3.3 보안 아키텍처

#### 3.3.1 인증 및 권한 관리

```
모든 API 요청
    ↓
Clerk Middleware (middleware.ts)
    ↓
로그인 여부 확인
    ↓
    ├─ 로그인 안 함 → 401 Unauthorized → /login으로 리다이렉트
    │
    └─ 로그인 확인 → userId 획득
                    ↓
                API Route에서 userId로 필터링
                    ↓
                본인 데이터만 조회/수정 가능
```

#### 3.3.2 환경 변수 관리

| 환경 변수                           | 노출 여부 | 사용 위치    | 용도               |
| ----------------------------------- | --------- | ------------ | ------------------ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ 공개   | 클라이언트   | Clerk 초기화       |
| `CLERK_SECRET_KEY`                  | ❌ 비공개 | 서버         | Clerk API 호출     |
| `NEXT_PUBLIC_SUPABASE_URL`          | ✅ 공개   | 클라이언트   | Supabase 연결      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | ✅ 공개   | 클라이언트   | Supabase 익명 접근 |
| `SUPABASE_SERVICE_ROLE_KEY`         | ❌ 비공개 | 서버 (필수!) | Supabase 전체 권한 |
| `GEMINI_API_KEY`                    | ❌ 비공개 | 서버/n8n     | Google Gemini API  |
| `FRED_API_KEY`                      | ❌ 비공개 | 서버/n8n     | FRED API           |

**⚠️ 중요:**

- `SUPABASE_SERVICE_ROLE_KEY`는 **절대** 클라이언트에 노출 금지
- RLS(Row Level Security) 미사용 → API 레벨에서 보안 처리

---

## 4. 주요 기능 구현

### 4.1 3D 지구 기반 In Flight Map 대시보드

**구현 기술:** Three.js + React Three Fiber

```typescript
// components/dashboard/GlobeCanvas.tsx (핵심 로직)
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export function GlobeCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <Globe
        textures={{
          day: "/earth/textures/earth-day.png",
          night: "/earth/textures/earth-night.png",
          clouds: "/earth/textures/earth-cloud.png",
        }}
        autoRotate={true}
      />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={2}
        maxDistance={5}
      />
    </Canvas>
  );
}
```

**최적화:**

- **Dynamic Import:** 3D 컴포넌트는 초기 번들에서 제외 (`next/dynamic` 사용)
- **SSR 비활성화:** `{ ssr: false }` 설정으로 서버 렌더링 방지
- **텍스처 최적화:** 이미지 압축 및 최적화된 해상도 사용

```typescript
// app/dashboard/page.tsx
import dynamic from "next/dynamic";

// 3D 컴포넌트는 클라이언트에서만 로드
const GlobeCanvas = dynamic(
  () => import("@/components/dashboard/GlobeCanvas"),
  {
    ssr: false,
    loading: () => <div className="loading-placeholder">지구 로딩 중...</div>,
  },
);
```

### 4.2 개인화된 뉴스 필터링 시스템

**핵심 알고리즘:**

```typescript
// lib/news.ts
export async function getPersonalizedNews(userId: string) {
  // 1. 사용자 프로필 조회
  const profile = await supabase
    .from("user_profiles")
    .select("ai_level")
    .eq("user_id", userId)
    .single();

  // 2. 사용자 관심사 조회
  const interests = await supabase
    .from("user_interests")
    .select("interests(slug)")
    .eq("user_id", userId);

  const interestSlugs = interests.data.map((i) => i.interests.slug);

  // 3. 사용자 상황 조회
  const contexts = await supabase
    .from("user_contexts")
    .select("contexts(slug)")
    .eq("user_id", userId);

  const contextSlugs = contexts.data.map((c) => c.contexts.slug);

  // 4. 맞춤형 뉴스 조회
  const news = await supabase
    .from("news")
    .select(
      `
      id,
      title,
      published_at,
      metadata,
      news_analysis_levels!inner(
        easy_title,
        summary,
        worst_scenario,
        user_action_tip
      )
    `,
    )
    .in("metadata->category", interestSlugs) // 관심사 필터링
    .eq("news_analysis_levels.level", profile.data.ai_level) // AI 레벨 필터링
    .gte("published_at", new Date().toISOString().split("T")[0])
    .order("published_at", { ascending: false })
    .limit(5);

  return {
    news: news.data,
    userLevel: profile.data.ai_level,
    userContexts: contextSlugs, // 최악의 시나리오 필터링에 사용
  };
}
```

**개인화 전략:**

1. **3단계 AI 레벨:**

   - Lv.1: 초등학생도 이해 가능 (쉬운 표현)
   - Lv.2: 직장인 대상 (실전 중심)
   - Lv.3: 투자자/전문가 (전문 용어 사용)

2. **관심사 기반 필터링:**

   - 사용자가 선택한 카테고리만 표시
   - 예: 주식, ETF 선택 → 부동산 뉴스는 안 보임

3. **상황별 시나리오:**
   - DB에는 6개 상황 모두 저장
   - 화면에는 사용자가 선택한 2~3개만 표시
   - 예: 직장인, 대출보유 선택 → 해당 시나리오만 노출

### 4.3 경제 순환기 지도 (v2 기능)

**구현 흐름:**

```typescript
// lib/cycle/determine-status.ts
export function determineStatusColor(
  indicators: any,
): "Red" | "Yellow" | "Green" {
  let riskScore = 0;

  // 1. 장단기 금리차 (가장 중요한 지표)
  const yieldCurveDiff = indicators.yield_curve.value;
  if (yieldCurveDiff < -0.5) riskScore += 3; // 심각한 역전
  else if (yieldCurveDiff < 0) riskScore += 2; // 역전
  else if (yieldCurveDiff < 0.3) riskScore += 1; // 좁혀짐

  // 2. 실업률
  const unemploymentRate = indicators.unemployment_rate.value;
  if (unemploymentRate > 5.0) riskScore += 2;
  else if (unemploymentRate > 4.5) riskScore += 1;

  // 3. 원/달러 환율
  const usdKrwRate = indicators.usd_krw.value;
  if (usdKrwRate > 1400) riskScore += 2;
  else if (usdKrwRate > 1350) riskScore += 1;

  // 신호등 결정
  if (riskScore >= 5) return "Red"; // 위험
  if (riskScore >= 3) return "Yellow"; // 주의
  return "Green"; // 양호
}
```

**n8n 워크플로우 구성:**

```yaml
Workflow: "경제 순환기 데이터 수집 및 분석"
Trigger: Schedule (매일 09:00 KST)

Nodes:
  1. HTTP Request (FRED API - 장단기 금리차)
     URL: https://api.stlouisfed.org/fred/series/observations
     Series: T10Y2Y

  2. HTTP Request (FRED API - 실업률)
     URL: https://api.stlouisfed.org/fred/series/observations
     Series: UNRATE

  3. HTTP Request (FRED API - 원/달러 환율)
     URL: https://api.stlouisfed.org/fred/series/observations
     Series: DEXKOUS

  4. Function Node (신호등 색상 계산)
     Code: determineStatusColor() 로직

  5. HTTP Request (Google Gemini API)
     Prompt: "현재 신호등은 {color}입니다. 상황을 요약하고 역사적 패턴을 찾아주세요."

  6. Supabase Update
     - 이전 레코드의 is_latest = false
     - 새 레코드 INSERT (is_latest = true)
```

### 4.4 Paywall 시스템 (무료 체험 관리)

**구독 상태 체크 로직:**

```typescript
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
  const daysRemaining = Math.ceil(
    (endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    isActive: data.active && endsAt > now,
    plan: data.plan,
    daysRemaining,
    shouldBlur: daysRemaining <= 0, // 0일 이하면 블러 처리
  };
}
```

**뉴스 상세 페이지에서 블러 적용:**

```tsx
// app/news/[id]/page.tsx
export default async function NewsDetailPage({ params }) {
  const { id } = await params;
  const { userId } = await auth();

  // 구독 상태 확인
  const subscription = await checkSubscription(userId);

  // 뉴스 데이터 조회
  const news = await getNewsById(id, userId);

  return (
    <div>
      {/* Block 1: AI 해설 (항상 공개) */}
      <NewsSummary data={news.analysis.summary} />

      {/* Block 2: 최악의 시나리오 (항상 공개) */}
      <WorstScenario data={news.analysis.worst_scenario} />

      {/* Block 3: 액션 아이템 (구독 만료 시 블러) */}
      <ActionItem
        data={news.analysis.user_action_tip}
        shouldBlur={subscription.shouldBlur}
        onBlurClick={() => router.push("/paywall")}
      />
    </div>
  );
}
```

### 4.5 Clerk + Supabase 사용자 동기화

**Webhook 처리:**

```typescript
// app/api/sync-user/route.ts
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "인증 필요" }, { status: 401 });
  }

  // Clerk에서 사용자 정보 가져오기
  const { clerkClient } = await import("@clerk/nextjs/server");
  const user = await clerkClient.users.getUser(userId);

  // Supabase에 사용자 생성 또는 업데이트
  const { data, error } = await supabase.from("users").upsert(
    {
      clerk_id: userId,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName || user.username,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "clerk_id",
    },
  );

  if (error) {
    console.error("사용자 동기화 실패:", error);
    return Response.json({ error: "동기화 실패" }, { status: 500 });
  }

  return Response.json({ success: true, user: data });
}
```

---

## 5. 데이터베이스 설계

### 5.1 ERD (Entity Relationship Diagram)

**설계 도구:** ERD Cloud

**테이블 구조:**

```
┌─────────────┐         ┌──────────────────┐         ┌──────────────┐
│   users     │◄────────┤ user_profiles    │         │  interests   │
│             │         │                  │         │  (마스터)    │
│ id (PK)     │         │ id (PK)          │         │              │
│ clerk_id    │         │ user_id (FK)     │         │ id (PK)      │
│ email       │         │ ai_level         │         │ name         │
│ name        │         │ onboarded_at     │         │ slug         │
└─────┬───────┘         └──────────────────┘         └──────┬───────┘
      │                                                       │
      │                 ┌──────────────────┐                 │
      └─────────────────┤ user_interests   ├─────────────────┘
                        │  (N:M 연결)      │
                        │                  │
                        │ id (PK)          │
                        │ user_id (FK)     │
                        │ interest_id (FK) │
                        └──────────────────┘

┌─────────────┐         ┌──────────────────┐         ┌──────────────┐
│  contexts   │         │ user_contexts    │         │    users     │
│  (마스터)   ├─────────┤  (N:M 연결)      ├─────────┤              │
│             │         │                  │         │              │
│ id (PK)     │         │ id (PK)          │         │ id (PK)      │
│ name        │         │ user_id (FK)     │         │ ...          │
│ slug        │         │ context_id (FK)  │         │              │
└─────────────┘         └──────────────────┘         └──────────────┘

┌─────────────┐         ┌──────────────────────────┐
│    news     │◄────────┤ news_analysis_levels     │
│             │         │  (1개 뉴스 = 3개 레코드) │
│ id (PK)     │         │                          │
│ title       │         │ id (PK)                  │
│ url         │         │ news_id (FK)             │
│ content     │         │ level (1, 2, 3)          │
│ published_at│         │ easy_title               │
│ metadata    │         │ summary                  │
└─────────────┘         │ worst_scenario           │
                        │ user_action_tip          │
                        └──────────────────────────┘

┌─────────────┐         ┌──────────────────┐
│   users     │◄────────┤ subscriptions    │
│             │         │                  │
│ id (PK)     │         │ id (PK)          │
│ ...         │         │ user_id (FK)     │
│             │         │ plan             │
│             │         │ started_at       │
│             │         │ ends_at          │
│             │         │ active           │
└─────────────┘         └──────────────────┘

┌────────────────────┐
│ cycle_explanations │  (v2 - 경제 순환기)
│                    │
│ id (PK)            │
│ status_color       │  ('Red', 'Yellow', 'Green')
│ summary_text       │  (AI 작성)
│ historical_pattern │  (AI 작성)
│ indicators_snapshot│  (JSONB - FRED 데이터)
│ recorded_at        │
│ is_latest          │  (최신 버전 표시)
└────────────────────┘
```

### 5.2 주요 테이블 상세

#### 5.2.1 users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
```

#### 5.2.2 news_analysis_levels

```sql
CREATE TABLE news_analysis_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level IN (1, 2, 3)),
  easy_title TEXT NOT NULL,
  summary TEXT NOT NULL,
  worst_scenario JSONB,  -- 6개 상황별 시나리오
  user_action_tip JSONB, -- 6개 상황별 액션 팁
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_analysis_news_level ON news_analysis_levels(news_id, level);
```

**worst_scenario JSONB 구조:**

```json
{
  "loan-holder": "대출 보유자님께는...",
  "employee": "직장인인 당신은...",
  "savings-only": "예적금만 하는 당신은...",
  "usd-holder": "달러 보유자님께는...",
  "business-owner": "사업가인 당신은...",
  "traveler": "해외여행 준비 중인 당신은..."
}
```

#### 5.2.3 cycle_explanations (v2)

```sql
CREATE TABLE cycle_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  recorded_at TIMESTAMPTZ NOT NULL,
  is_latest BOOLEAN DEFAULT true,

  -- 신호등 색상 (규칙 기반 자동 계산)
  status_color TEXT NOT NULL CHECK (status_color IN ('Red', 'Yellow', 'Green')),

  -- AI 작성 텍스트
  summary_text TEXT NOT NULL,
  historical_pattern TEXT NOT NULL,

  -- FRED API 데이터
  indicators_snapshot JSONB NOT NULL
);

CREATE INDEX idx_cycle_latest ON cycle_explanations(is_latest) WHERE is_latest = true;
```

**indicators_snapshot JSONB 구조:**

```json
{
  "yield_curve": {
    "value": -0.42,
    "unit": "%p",
    "date": "2025-12-11",
    "source": "FRED:T10Y2Y"
  },
  "unemployment_rate": {
    "value": 4.2,
    "unit": "%",
    "mom_change": 0.1,
    "date": "2025-11-30",
    "source": "FRED:UNRATE"
  },
  "usd_krw": {
    "value": 1330.5,
    "unit": "KRW",
    "mom_change": 35.2,
    "date": "2025-12-11",
    "source": "FRED:DEXKOUS"
  }
}
```

### 5.3 인덱스 전략

| 테이블                 | 인덱스              | 이유                         |
| ---------------------- | ------------------- | ---------------------------- |
| `users`                | `clerk_id`          | Clerk 인증 시 빠른 조회      |
| `user_interests`       | `user_id`           | 사용자의 관심사 조회         |
| `news`                 | `published_at`      | 날짜별 뉴스 조회             |
| `news_analysis_levels` | `(news_id, level)`  | 뉴스별 레벨 조회 최적화      |
| `subscriptions`        | `(user_id, active)` | 구독 상태 빠른 확인          |
| `cycle_explanations`   | `is_latest`         | 최신 경제 순환기 데이터 조회 |

---

## 6. API 설계

### 6.1 API 엔드포인트 목록

| 메서드 | 경로                       | 용도                           | 인증 필요      |
| ------ | -------------------------- | ------------------------------ | -------------- |
| POST   | `/api/sync-user`           | Clerk → Supabase 사용자 동기화 | ✅             |
| POST   | `/api/onboarding/complete` | 온보딩 완료 (프로필 저장)      | ✅             |
| GET    | `/api/news`                | 맞춤형 뉴스 목록 조회          | ✅             |
| GET    | `/api/news/[id]`           | 뉴스 상세 조회                 | ✅             |
| GET    | `/api/news/monthly`        | 이달의 뉴스 조회               | ✅             |
| GET    | `/api/cycle/current`       | 경제 순환기 최신 데이터        | ✅             |
| GET    | `/api/subscription/status` | 구독 상태 확인                 | ✅             |
| POST   | `/api/webhooks/stripe`     | Stripe 결제 Webhook            | ❌ (서명 검증) |

### 6.2 API 응답 예시

#### GET `/api/news`

**Request:**

```
GET /api/news?date=2025-01-15&category=stock
Authorization: Bearer {clerk_token}
```

**Response (200):**

```json
{
  "news": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "한국은행, 기준금리 3.5% 동결 결정",
      "category": "stock",
      "published_at": "2025-01-15T09:00:00Z",
      "analysis": {
        "easy_title": "금리 그대로 유지됩니다",
        "summary": "한국은행이 기준금리를 3.5%로 동결했습니다...",
        "worst_scenario": "대출 이자 부담이 계속됩니다...",
        "should_blur": false
      }
    }
    // ... 최대 5개
  ],
  "subscription": {
    "active": true,
    "days_remaining": 15,
    "plan": "free"
  }
}
```

#### GET `/api/cycle/current`

**Response (200):**

```json
{
  "status_color": "Yellow",
  "summary_text": "미국 장단기 금리차가 -0.4%p로 역전된 상태가 지속되고 있습니다.",
  "historical_pattern": "과거 1980년 이후 금리차가 역전된 사례에서, 평균 12~18개월 후 경기 침체가 뒤따랐습니다.",
  "indicators_snapshot": {
    "yield_curve": {
      "value": -0.42,
      "unit": "%p",
      "date": "2025-12-11"
    },
    "unemployment_rate": {
      "value": 4.2,
      "unit": "%",
      "date": "2025-11-30"
    },
    "usd_krw": {
      "value": 1330.5,
      "unit": "KRW",
      "date": "2025-12-11"
    }
  },
  "updated_at": "2025-12-12T09:00:00Z"
}
```

### 6.3 에러 처리

**표준 에러 응답:**

```json
{
  "error": "에러 메시지",
  "code": "ERROR_CODE",
  "details": {}
}
```

**HTTP 상태 코드:**

| 코드 | 의미         | 사용 예시                    |
| ---- | ------------ | ---------------------------- |
| 200  | 성공         | 정상 응답                    |
| 400  | 잘못된 요청  | 필수 파라미터 누락           |
| 401  | 인증 필요    | 로그인하지 않음              |
| 403  | 권한 없음    | 다른 사용자 데이터 접근 시도 |
| 404  | 찾을 수 없음 | 존재하지 않는 뉴스 ID        |
| 500  | 서버 오류    | DB 연결 실패, AI API 오류 등 |

---

## 7. 트러블슈팅 및 문제 해결

### 7.1 Clerk + Supabase 사용자 동기화 이슈 (2025.12.28 해결)

**문제:**

- Clerk로 회원가입 후 Supabase `users` 테이블에 사용자 정보가 자동 생성되지 않음
- 온보딩 진행 시 `user_id` FK 제약 조건 위반 에러 발생

**원인 분석:**

- Clerk Webhook이 제대로 설정되지 않음
- 로컬 개발 환경에서 Webhook 수신 불가

**해결 방법:**

1. **SyncUserProvider 컴포넌트 생성:**

   ```tsx
   // components/providers/sync-user-provider.tsx
   "use client";
   import { useUser } from "@clerk/nextjs";
   import { useEffect } from "react";

   export function SyncUserProvider({ children }) {
     const { user, isLoaded } = useUser();

     useEffect(() => {
       if (isLoaded && user) {
         // 로그인 시 자동으로 사용자 동기화
         fetch("/api/sync-user", { method: "POST" });
       }
     }, [user, isLoaded]);

     return children;
   }
   ```

2. **RootLayout에 Provider 추가:**
   ```tsx
   // app/layout.tsx
   export default function RootLayout({ children }) {
     return (
       <ClerkProvider>
         <SyncUserProvider>{children}</SyncUserProvider>
       </ClerkProvider>
     );
   }
   ```

**결과:**

- 회원가입 즉시 Supabase에 사용자 자동 생성
- 온보딩 정상 진행
- 참고: `docs/SYNC_USER_API_DEBUG_20251228.md`

### 7.2 뉴스 카테고리 필터링 버그 (2025.12.30 해결)

**문제:**

- 사용자가 선택한 관심사와 무관한 뉴스도 표시됨
- 예: 주식만 선택했는데 부동산 뉴스도 나옴

**원인 분석:**

```typescript
// ❌ 잘못된 쿼리 (OR 조건으로 작동)
.or(`metadata->category.eq.stock,metadata->category.eq.real-estate`)
// → 주식 OR 부동산 뉴스 모두 반환
```

**해결 방법:**

```typescript
// ✅ 올바른 쿼리 (IN 조건 사용)
const { data: news } = await supabase
  .from("news")
  .select("*")
  .in("metadata->>category", interestSlugs) // JSON 필드 추출 연산자
  .eq("news_analysis_levels.level", userLevel);
```

**추가 개선:**

- `metadata` 컬럼을 JSONB에서 TEXT로 변경 고려
- 카테고리별 인덱스 추가로 쿼리 성능 향상

**결과:**

- 사용자가 선택한 관심사 뉴스만 정확히 표시
- 참고: `docs/20251230_news_filtering_fix_report.md`

### 7.3 n8n 뉴스 워크플로우 자동 실행 실패 (2025.12.29 해결)

**문제:**

- n8n 워크플로우가 수동 실행은 되지만 자동 실행(Schedule) 안 됨
- 매일 아침 8시에 뉴스 수집 안 됨

**원인 분석:**

- n8n의 Schedule Trigger 설정 오류
- Timezone 설정이 UTC로 되어 있음 (한국 시간 +9시간)

**해결 방법:**

1. **Schedule Trigger 재설정:**

   ```yaml
   Schedule:
     Cron Expression: "0 8 * * *" # 매일 08:00
     Timezone: Asia/Seoul
   ```

2. **워크플로우 재활성화:**

   - n8n 대시보드에서 워크플로우 비활성화 → 활성화

3. **수동 테스트:**
   - "Test Workflow" 버튼으로 전체 플로우 검증
   - 각 노드별 출력 확인

**결과:**

- 매일 아침 8시 정각에 자동 실행 정상화
- 참고: `docs/251229n8n_workflow_update.md`

### 7.4 경제 순환기 AI 분석 품질 저하 (2026.01.06 해결)

**문제:**

- Google Gemini API가 간혹 일관성 없는 분석 결과 반환
- JSON 형식 오류 (마크다운 코드 블록 포함)

**원인 분석:**

- 프롬프트가 불명확함
- JSON 응답 파싱 로직 미흡

**해결 방법:**

1. **프롬프트 개선:**

   ```python
   # n8n Function Node
   prompt = f"""
   당신은 경제 분석 전문가입니다.

   현재 신호등 색상: {status_color}

   다음 경제 지표를 바탕으로 분석해주세요:
   - 장단기 금리차: {indicators['yield_curve']['value']}%p
   - 미국 실업률: {indicators['unemployment_rate']['value']}%
   - 원/달러 환율: {indicators['usd_krw']['value']}원

   다음 JSON 형식으로만 응답해주세요 (다른 텍스트 포함하지 마세요):
   {{
     "summary_text": "현재 상황 요약 (2~3문장)",
     "historical_pattern": "과거 유사 사례 (3~4문장)"
   }}
   """
   ```

2. **JSON 파싱 개선:**

   ````javascript
   // n8n Function Node
   const response = $input.item.json.response;

   // 마크다운 코드 블록 제거
   const jsonMatch =
     response.match(/```json\n([\s\S]*?)\n```/) ||
     response.match(/\{[\s\S]*\}/);

   const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : response;
   const parsedData = JSON.parse(jsonText);

   return { json: parsedData };
   ````

**결과:**

- AI 분석 품질 향상
- JSON 파싱 오류 제로화

### 7.5 3D 지구 렌더링 성능 이슈 (2025.12.25 해결)

**문제:**

- 대시보드 로딩 시간 5초 이상
- 모바일 기기에서 프레임 드롭

**원인 분석:**

- Three.js 번들이 초기 로드에 포함됨 (600KB+)
- 고해상도 텍스처 사용 (8K)

**해결 방법:**

1. **Dynamic Import + SSR 비활성화:**

   ```tsx
   // app/dashboard/page.tsx
   const GlobeCanvas = dynamic(
     () => import("@/components/dashboard/GlobeCanvas"),
     {
       ssr: false,
       loading: () => <LoadingSpinner />,
     },
   );
   ```

2. **텍스처 최적화:**

   ```bash
   # 8K → 2K 해상도 변경
   convert earth-day-8k.png -resize 2048x1024 earth-day-2k.png

   # WebP 포맷으로 변환 (50% 용량 감소)
   cwebp earth-day-2k.png -o earth-day.webp -q 80
   ```

3. **메모리 최적화:**
   ```typescript
   // components/dashboard/GlobeCanvas.tsx
   useEffect(() => {
     return () => {
       // 컴포넌트 언마운트 시 텍스처 메모리 해제
       if (earthTexture) earthTexture.dispose();
       if (geometry) geometry.dispose();
       if (material) material.dispose();
     };
   }, []);
   ```

**결과:**

- 대시보드 로딩 시간: 5초 → 1.5초 (70% 개선)
- 모바일 FPS: 15fps → 45fps
- 번들 크기: 600KB → 150KB (분할 로딩)

---

## 8. 성능 최적화

### 8.1 Lighthouse 점수

**목표:** 모든 지표 80점 이상

| 지표           | 현재 점수 | 목표 | 상태       |
| -------------- | --------- | ---- | ---------- |
| Performance    | 75        | 90+  | 🔄 진행 중 |
| Accessibility  | 92        | 90+  | ✅ 완료    |
| Best Practices | 100       | 90+  | ✅ 완료    |
| SEO            | 100       | 90+  | ✅ 완료    |

### 8.2 성능 최적화 전략

#### 8.2.1 Code Splitting

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: ["three", "@react-three/fiber", "framer-motion"],
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: "all",
      cacheGroups: {
        three: {
          test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
          name: "three",
          priority: 10,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          priority: 5,
        },
      },
    };
    return config;
  },
};
```

#### 8.2.2 이미지 최적화

```tsx
// components/news/NewsCard.tsx
import Image from "next/image";

export function NewsCard({ thumbnail, title }) {
  return (
    <div className="news-card">
      <Image
        src={thumbnail}
        alt={title}
        width={400}
        height={300}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
        sizes="(max-width: 768px) 100vw, 400px"
      />
    </div>
  );
}
```

#### 8.2.3 API 응답 캐싱

```typescript
// app/api/news/route.ts
import { unstable_cache } from "next/cache";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const date =
    searchParams.get("date") || new Date().toISOString().split("T")[0];

  // 날짜별로 1시간 캐싱
  const getNews = unstable_cache(
    async (date) => {
      return await supabase.from("news").select("*").eq("published_at", date);
    },
    [`news-${date}`],
    { revalidate: 3600 }, // 1시간
  );

  const news = await getNews(date);
  return Response.json(news);
};
```

#### 8.2.4 Database 쿼리 최적화

**Before (N+1 문제):**

```typescript
// ❌ 각 뉴스마다 별도 쿼리 (N+1)
const news = await supabase.from("news").select("*");
for (const item of news.data) {
  const analysis = await supabase
    .from("news_analysis_levels")
    .select("*")
    .eq("news_id", item.id);
  // ...
}
```

**After (JOIN 사용):**

```typescript
// ✅ 한 번의 쿼리로 모든 데이터 조회
const news = await supabase
  .from("news")
  .select(
    `
    *,
    news_analysis_levels!inner(
      easy_title,
      summary,
      worst_scenario,
      user_action_tip
    )
  `,
  )
  .eq("news_analysis_levels.level", userLevel);
```

**결과:** 쿼리 시간 1500ms → 200ms (87% 개선)

### 8.3 번들 크기 최적화

**Before:**

```
Page                              Size     First Load JS
┌ ○ /                            5.2 kB         120 kB
├ ○ /dashboard                   45 kB          950 kB   ← Three.js 포함
└ ○ /news/[id]                   12 kB          150 kB
```

**After (Dynamic Import 적용):**

```
Page                              Size     First Load JS
┌ ○ /                            5.2 kB         120 kB
├ ○ /dashboard                   8 kB           150 kB   ← 85% 감소
│  └─ three (lazy loaded)        600 kB         (분리)
└ ○ /news/[id]                   12 kB          150 kB
```

---

## 9. 개발 프로세스 및 의사결정

### 9.1 기술 선택 의사결정

#### 9.1.1 Next.js 15 App Router 선택

**고려 사항:**

- ✅ React Server Components로 초기 로딩 속도 향상
- ✅ 파일 기반 라우팅으로 직관적인 구조
- ✅ API Routes로 풀스택 개발 가능
- ❌ Pages Router 대비 학습 곡선 높음

**결정:** App Router 채택

- **이유:** 최신 React 19 기능 활용, 서버 컴포넌트로 번들 크기 감소

#### 9.1.2 Clerk vs NextAuth.js

| 기준            | Clerk             | NextAuth.js     |
| --------------- | ----------------- | --------------- |
| 소셜 로그인     | ✅ 즉시 사용      | 🔧 직접 설정    |
| 한국어 지원     | ✅ 공식 지원      | ❌ 직접 번역    |
| UI 커스터마이징 | 🔧 제한적         | ✅ 완전 자유    |
| 가격            | 무료 (10,000 MAU) | 무료 (오픈소스) |
| 개발 시간       | 1일               | 3~5일           |

**결정:** Clerk 채택

- **이유:** 개발 기간 단축 (33일), 한국어 UI 즉시 사용 가능

#### 9.1.3 Google Gemini vs OpenAI GPT-4

| 기준           | Gemini 2.5 Flash             | GPT-4 Turbo             |
| -------------- | ---------------------------- | ----------------------- |
| 응답 속도      | ⚡ 0.5~1초                   | 🐢 2~3초                |
| 가격 (1M 토큰) | $0.075 (입력) / $0.30 (출력) | $10 (입력) / $30 (출력) |
| 한국어 품질    | ✅ 우수                      | ✅ 우수                 |
| 컨텍스트 길이  | 1M 토큰                      | 128K 토큰               |
| 무료 할당량    | ✅ 50 RPM                    | ❌ 없음                 |

**결정:** Google Gemini 2.5 Flash 채택

- **이유:**
  - 비용: OpenAI 대비 1/100 수준
  - 속도: 2~3배 빠름
  - 무료 할당량으로 초기 개발 비용 절감

#### 9.1.4 RLS 미사용 결정

**고려 사항:**

- ✅ RLS 사용 시: 데이터베이스 레벨 보안, 강력한 보호
- ❌ RLS 사용 시: 복잡한 정책 관리, 디버깅 어려움, 개발 속도 저하
- ✅ API 레벨 보안: 간단한 구현, 빠른 개발
- ❌ API 레벨 보안: 실수 시 보안 취약점

**결정:** RLS 미사용, API 레벨 보안

- **이유:**
  - 개발 기간 33일로 제한됨
  - 모든 데이터 접근이 API Routes를 통해서만 이루어짐
  - Clerk 인증 + API 미들웨어로 충분한 보안 확보
- **추후 개선:** v2에서 RLS 적용 검토

### 9.2 개발 일정 관리

**주차별 진행 상황:**

| 주차   | 기간        | 목표                        | 완료율 | 주요 이슈                 |
| ------ | ----------- | --------------------------- | ------ | ------------------------- |
| Week 1 | 12/11~12/17 | 프로젝트 셋업, 인증, 온보딩 | 100%   | Clerk Webhook 설정        |
| Week 2 | 12/18~12/24 | 대시보드, 뉴스 상세 페이지  | 100%   | 3D 지구 성능 이슈         |
| Week 3 | 12/25~12/31 | v2 기능 (경제 순환기), n8n  | 100%   | FRED API 연동, n8n 자동화 |
| Week 4 | 01/01~01/07 | QA, 최적화, 보안 강화       | 70%    | 카테고리 필터링 버그 수정 |
| Week 5 | 01/08~01/13 | 최종 QA, 법적 문서, 배포    | 예정   | -                         |

**주요 마일스톤:**

- ✅ 2025.12.17: v1 기본 기능 완료
- ✅ 2025.12.31: v2 경제 순환기 완료
- ✅ 2026.01.06: n8n 자동화 완료
- 🔄 2026.01.10: QA 1차 완료 예정
- 📋 2026.01.13: 프로덕션 배포 예정

### 9.3 코드 품질 관리

**적용 도구:**

- **ESLint:** 코드 스타일 통일
- **TypeScript:** 정적 타입 체크
- **Prettier:** 자동 포맷팅 (미사용 - ESLint로 통합)

**컨벤션:**

- 파일명: kebab-case (`user-profile.tsx`)
- 컴포넌트: PascalCase (`UserProfile`)
- 함수/변수: camelCase (`getUserProfile`)
- 타입/인터페이스: PascalCase (`UserProfile`)

---

## 10. 성과 및 학습

### 10.1 주요 성과

**기술적 성과:**

1. **풀스택 개발 역량:**

   - Next.js 15 App Router + Server Components 활용
   - TypeScript로 타입 안전한 코드 작성
   - Supabase PostgreSQL 데이터베이스 설계 및 최적화

2. **AI 통합 경험:**

   - Google Gemini 2.5 Flash API 연동
   - 프롬프트 엔지니어링으로 일관된 JSON 응답 확보
   - n8n으로 AI 파이프라인 자동화

3. **3D 웹 그래픽:**

   - Three.js + React Three Fiber로 3D 지구 시각화
   - 성능 최적화 (번들 크기 85% 감소, FPS 3배 향상)

4. **인증 시스템 구축:**

   - Clerk와 Supabase 연동
   - 사용자 동기화 자동화

5. **자동화 워크플로우:**
   - n8n으로 뉴스 수집 및 AI 분석 파이프라인 구축
   - 매일 자동 실행으로 수동 작업 제로화

**비즈니스 성과:**

- ✅ 33일 내 MVP 완성 (진행률 85%)
- ✅ 독특한 3D 지구 기반 UX로 차별화
- ✅ AI 기반 개인화로 사용자 경험 향상
- ✅ 자동화로 운영 비용 최소화

### 10.2 기술적 학습

**1. Next.js 15 & React 19:**

- Server Components와 Client Components 분리 전략
- Dynamic Import로 번들 크기 최적화
- Async Request APIs (`await params`, `await cookies`)

**2. AI API 활용:**

- 프롬프트 엔지니어링 기법
- JSON 응답 파싱 및 오류 처리
- API 비용 최적화 (캐싱, 배치 처리)

**3. 데이터베이스 설계:**

- ERD 도구(ERD Cloud)로 스키마 설계
- N:M 관계 설계 (user_interests, user_contexts)
- JSONB 활용으로 유연한 데이터 구조

**4. 성능 최적화:**

- Lighthouse 기반 성능 측정
- Three.js 메모리 관리
- SQL 쿼리 최적화 (N+1 문제 해결)

### 10.3 개선이 필요한 부분

**1. 테스트 코드 부재:**

- 현재: 테스트 코드 없음
- 개선 방향: Vitest + Playwright로 E2E 테스트 추가

**2. RLS 미적용:**

- 현재: API 레벨 보안만 사용
- 개선 방향: v2에서 RLS 정책 추가로 2중 보안

**3. 토스페이먼츠 미연동:**

- 현재: v3로 연기됨
- 개선 방향: 런칭 후 최우선 개발

**4. 모니터링 미흡:**

- 현재: 기본 로깅만 사용
- 개선 방향: Sentry + PostHog 연동

### 10.4 배운 교훈

**1. 기술 선택의 중요성:**

- Clerk 선택으로 인증 개발 시간 3~5일 → 1일로 단축
- Google Gemini 선택으로 AI 비용 1/100 절감
- **교훈:** 초기 기술 선택이 전체 개발 속도와 비용에 큰 영향

**2. 조기 최적화 지양:**

- Week 1~2: 기능 구현에 집중
- Week 3: 성능 이슈 발견 (3D 지구)
- Week 4: 집중 최적화로 성능 70% 개선
- **교훈:** 기능 완성 후 성능 최적화가 더 효율적

**3. 문서화의 중요성:**

- 매일 디버깅 리포트 작성 (`docs/`)
- 트러블슈팅 사례 문서화
- **교훈:** 문서화로 동일한 문제 재발 방지

**4. 자동화의 가치:**

- n8n으로 뉴스 수집/분석 자동화
- 수동 작업 시간: 1일 2시간 → 0시간
- **교훈:** 반복 작업은 초기에 자동화 투자

### 10.5 향후 개선 계획

**단기 (런칭 후 1개월):**

- [ ] 토스페이먼츠 결제 시스템 연동
- [ ] Sentry 에러 트래킹
- [ ] PostHog 사용자 행동 분석
- [ ] RLS 정책 적용
- [ ] **AI 기반 뉴스 중요도 평가 시스템**
  - 현재: 최신순으로만 정렬
  - 개선: 뉴스별 impact_score 계산 (AI 또는 규칙 기반)
  - 목표: 사용자에게 정말 중요한 뉴스 Top 5 제공
- [ ] **사용자 맞춤 뉴스 추천 알고리즘**
  - 현재: 관심사 기반 필터링만
  - 개선: 읽은 뉴스 패턴 학습, 클릭률 기반 추천
  - 목표: 개인화된 뉴스 큐레이션

**중기 (3개월):**

- [ ] PWA (Progressive Web App) 변환
- [ ] 웹 푸시 알림 또는 이메일 알림
- [ ] 소셜 공유 기능 (카카오톡, 트위터)
- [ ] CMS 어드민 대시보드
- [ ] **뉴스 읽기 시간 및 스크롤 깊이 트래킹**
  - 사용자 선호도 학습을 위한 데이터 수집
  - PostHog 이벤트 트래킹 연동

**장기 (6개월):**

- [ ] 모바일 앱 개발 (React Native)
- [ ] AI 프롬프트 A/B 테스트
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 프리미엄 기능 추가
- [ ] **머신러닝 기반 개인화 엔진**
  - 사용자별 뉴스 중요도 예측 모델
  - 협업 필터링으로 유사 사용자 추천

---

## 11. 참고 자료

### 11.1 프로젝트 문서

- **PRD (Product Requirements Document):** `docs/PRD.md`
- **TRD (Technical Requirements Document):** `docs/TRD.md`
- **CLAUDE.md:** 프로젝트 가이드 (AGENTS.md 기반)
- **디버깅 리포트:** `docs/20251229_debug_report.md` 등

### 11.2 기술 스택 공식 문서

| 기술          | 문서 링크                                  |
| ------------- | ------------------------------------------ |
| Next.js 15    | https://nextjs.org/docs                    |
| React 19      | https://react.dev                          |
| Clerk         | https://clerk.com/docs                     |
| Supabase      | https://supabase.com/docs                  |
| Google Gemini | https://ai.google.dev/docs                 |
| Three.js      | https://threejs.org/docs                   |
| FRED API      | https://fred.stlouisfed.org/docs/api/fred/ |
| n8n           | https://docs.n8n.io                        |

### 11.3 관련 블로그 포스트 (예정)

- [ ] "Next.js 15 App Router로 풀스택 앱 만들기"
- [ ] "Google Gemini로 뉴스 AI 분석 시스템 구축"
- [ ] "Three.js 성능 최적화: 번들 크기 85% 줄이기"
- [ ] "Clerk + Supabase 사용자 동기화 패턴"

---

## 12. 연락처

**프로젝트 데모:** https://newsin.flight (예정)

**GitHub:** [프로젝트 저장소 링크]

**이메일:** [연락처]

---

**마지막 업데이트:** 2026.01.10

**작성자:** [이름]

**버전:** 1.0.0
