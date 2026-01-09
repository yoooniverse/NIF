# PRD: News In Flight

> 경제 뉴스 AI 해석 및 개인화 서비스

**개발 기간:** 33일 (2025.12.11 ~ 2026.01.13, 약 5주)

**현재 진행 상황:** 2026.01.07 (Week 4, Day 27) - Week 1-3 완료, QA 및 최적화 진행 중

**목표:** AI 기반 경제 뉴스 해석으로 사용자 맞춤 인사이트 제공

**비즈니스 모델:** 30일 무료 체험 → 월 5,900원 구독

---

## 📱 서비스 개요

**경제 뉴스를 사용자 맞춤형으로 해설해주는 서비스**

---

## 1. 핵심 가치 제안

**문제:** 경제 뉴스는 어렵고, 내 삶과의 연결고리를 모르겠다
**해결:** AI가 내 상황(대출보유, 주식투자 등)에 맞춰 쉽게 해석해줌
**차별점:** 카테고리별 Top 5만 엄선 + 개인화된 위험 시나리오 + 경제 순환기 시각화
**접근성:** URL 접속만으로 이용 가능 (설치 불필요)

---

## 👤 사용자 온보딩

사용자가 회원가입 시 선택:

1. **관심분야** (1~5개 선택 가능)

   - 주식, 부동산, ETF, 환율, 가상화폐

2. **상황** (1~6개 선택 가능)

   - 직장인, 대출보유, 예적금, 달러보유, 사업가, 해외여행

3. **레벨** (1개 선택)
   - 레벨1: 초등학생도 이해 (쉬운 해설)
   - 레벨2: 직장인 3040 (실전 해설)
   - 레벨3: 투자자 (전문 해설)

---

## 2. MVP 기능 정의

### v1 기능 (Week 1-2, 필수 - Day 1-16)

**F1. 사용자 인증** ✅ 구현 완료

- Clerk 소셜 로그인 (구글, 카카오) ✅ 설정 완료
- 이메일 회원가입 ✅ 구현 완료
- 자동 users 테이블 생성 ✅ 구현 완료
- 사용자 동기화 API ✅ 디버깅 완료

**F2. 온보딩** ✅ 구현 완료

- 관심 자산 선택: 부동산, 가상화폐, ETF, 주식, 환율 (멀티 선택) ✅ 구현 완료
- 나의 상황 선택: 대출보유, 예적금만함, 달러보유, 사업가, 직장인, 해외여행 (멀티 선택) ✅ 구현 완료
- AI 레벨 선택: Lv.1 (초보자), Lv.2 (일반), Lv.3 (전문가) 중 택1 ✅ 구현 완료
- user_profiles, user_interests, user_contexts 테이블에 저장 ✅ 구현 완료

**F3. AI 뉴스 파이프라인** ✅ 구현 완료 (n8n 워크플로우 정상 작동)

### ✅ 백엔드 작업 (n8n) - 매일 자동 실행:

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

- n8n RSS 노드로 뉴스 수집 ✅ 완료
- Google Gemini 2.5 Flash로 분석 ✅ 완료 (뉴스 자동 분석 정상 작동)
- 레벨별 분석 생성 (1개 뉴스 → 3개 레코드) ✅ 완료
- news, news_analysis_levels 테이블에 저장 ✅ 완료
- 관심분야별 뉴스 필터링 및 카테고리 분류 ✅ 완료

**F4. 메인 대시보드 (In Flight Map 컨셉)** ✅ 구현 완료

- **3D 지구 기반 배경 시스템** ✅ 구현 완료 (GlobeCanvas 컴포넌트)
- **좌측 사이드바 레이아웃** ✅ 구현 완료 (유저 정보 + 구독 상태 + 3개 주요 섹션)
- **"이달의 뉴스" 섹션** ✅ 구현 완료 (카테고리별 필터링)
- **"오늘의 뉴스" 섹션** ✅ 구현 완료 (관심분야별 필터링)
- **경제 순환기 지도 모달** ✅ 구현 완료 (중앙 글래스 모달 디자인)
- **Boarding Pass Modal** ✅ 구현 완료 (프로필 수정 및 구독 정보)
- **뉴스 카드 컴포넌트** ✅ 구현 완료 (NewsCard.tsx)

**F5. 뉴스 상세** ✅ 구현 완료

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

- Block 1: AI 뉴스 해설 (10줄 이내, 쉬운 설명) ✅ 구현 완료
- Block 2: 최악의 시나리오 (사용자 상황 기반 개인화) ✅ 구현 완료
- Block 3: 행동 가이드 (Action Item) ✅ 구현 완료
  - 무료 체험 중(30일): **전체 공개** (블러 없음) ✅ 구현 완료
  - 31일차 이후: **블러 처리** → 클릭 시 Paywall ✅ 구현 완료
- 출처 링크, 원문 링크 ✅ 구현 완료

**F6. 구독 시스템** ✅ 기본 로직 완료 (토스페이먼츠 연동은 v3: Post-Launch로 연기)

- Supabase에서 subscriptions 테이블 생성 ✅ 완료
- 가입 시 Clerk 메타데이터에 plan='free', ends_at=now()+30일 자동 생성 ✅ 구현 완료
- 31일차 active=false → Paywall (콘텐츠 접근 차단 및 결제 유도) ✅ 구현 완료
- **토스페이먼츠(Toss Payments) 연동** 🔄 **v3: Post-Launch로 연기**
  - 런칭 후 필수 기능으로 구현 예정
  - 방식: '카드 자동결제(Billing)' 시스템 사용
  - 프로세스: 사용자가 결제창에서 카드 등록 → 빌링키(Billing Key) 발급 및 DB 저장
  - 가격: 월 9,900원 / 얼리버드 5,900원

```sql
-- Supabase에서 실행할 SQL
CREATE TABLE "subscriptions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "plan" TEXT NOT NULL CHECK (plan IN ('free', 'premium')),
  "started_at" TIMESTAMP DEFAULT now() NOT NULL,
  "ends_at" TIMESTAMP NOT NULL,
  "active" BOOLEAN DEFAULT true NOT NULL,
  "billing_key" TEXT,  -- 토스페이먼츠 빌링키 저장용
  "created_at" TIMESTAMP DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT now() NOT NULL
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_active ON subscriptions(active);

```

### v2 기능 (Week 3-4, 선택 - Day 17-28)

**F7. 경제 순환기 지도** ✅ 구현 완료 (2026.01.06)

- **좌측: 순환기별 특징 표** ✅ 구현 완료 (회복기, 확장기, 둔화기, 침체기)
- **우측: 근거 지표 시각화** ✅ 구현 완료
  - **신호등 색상**: 규칙 기반 자동 계산 (Red/Yellow/Green) ✅ 완료
  - **현재 상황 요약**: AI 작성 ✅ 완료
  - **역사적 패턴/팩트**: AI 작성 ✅ 완료
  - **근거 지표**: FRED API에서 수집 (장단기 금리차, 미국 실업률, 원/달러 환율) ✅ 완료
- **n8n 워크플로우** ✅ 구현 완료 (매일 자동 업데이트)
- **경제 순환기 페이지** ✅ 완료 (`/cycle`)
- **경제 순환기 API** ✅ 완료 (`/api/cycle/current`)

**신호등 색상 로직 (규칙 기반):**

```javascript
// 예시 로직 (n8n 또는 Next.js API에서 실행)
function determineStatusColor(indicators) {
  const { yieldCurveDiff, unemploymentRate, usdKrwChange } = indicators;

  let riskScore = 0;

  // 1. 장단기 금리차 (가장 중요한 지표)
  if (yieldCurveDiff < -0.5) riskScore += 3; // 심각한 역전
  else if (yieldCurveDiff < 0) riskScore += 2; // 역전
  else if (yieldCurveDiff < 0.3) riskScore += 1; // 좁혀짐

  // 2. 실업률 (전월 대비 증가폭)
  if (unemploymentRate > 0.3) riskScore += 2;
  else if (unemploymentRate > 0.1) riskScore += 1;

  // 3. 원/달러 환율 (전월 대비 급등)
  if (usdKrwChange > 50) riskScore += 2;
  else if (usdKrwChange > 30) riskScore += 1;

  // 신호등 결정
  if (riskScore >= 5) return "Red"; // 위험
  if (riskScore >= 3) return "Yellow"; // 주의
  return "Green"; // 양호
}
```

**AI 역할:**

- 신호등 색상은 규칙 기반으로 먼저 결정
- AI는 그 색상에 맞춰 `summary_text`와 `historical_pattern`만 작성
- 프롬프트 예: "현재 신호등은 Yellow입니다. 이 지표들을 보고 현재 상황을 요약하고, 과거 유사 사례를 찾아 패턴을 설명해주세요."

### v3 기능 (Post-Launch)

- **토스페이먼츠 결제 시스템** (최우선) - 카드 자동결제(Billing) 연동
- n8n 자동화 워크플로우 고도화 (프롬프트 최적화, 50개 뉴스 대량 처리)
- CMS 어드민 대시보드
- 웹 푸시 알림 (브라우저 알림) 또는 이메일 알림
- 소셜 공유 기능 (카카오톡, 페이스북, 트위터)
- PWA (Progressive Web App) 변환 (홈 화면 추가 가능)
- Lighthouse 성능 최적화 (90점 이상)

---

## 3. 페이지 목록

### 3.1 Public Pages (인증 불필요)

**P1. 랜딩 페이지 (`/`)**

- Hero: "경제 뉴스는 정보가 아니라 생존입니다"
- CTA: "30일 무료로 시작하기"
- 소셜 프루프, 기능 소개

**P2. 로그인/회원가입 (`/login`, `/signup`)**

- Clerk UI 호출
- 소셜 로그인, 이메일 가입

### 3.2 Authenticated Pages (인증 필요)

**P3. 온보딩 (`/onboarding`)**

- Step 1: 관심 자산 선택 (`/onboarding/interests`)
- Step 2: 나의 상황 선택 (`/onboarding/contexts`)
- Step 3: AI 레벨 선택 (`/onboarding/level`)
- Step 4: 완료 → 대시보드로 리다이렉트

**P4. 메인 대시보드 (`/dashboard`)** ✅ 구현 완료

- **3D 지구 기반 배경** (GlobeCanvas 컴포넌트)
- **좌측 사이드바**: 유저 정보, 구독 상태, 3개 주요 섹션 버튼
- **Boarding Pass Modal**: 프로필 수정 및 구독 정보 확인
- "이달의 뉴스" 버튼 → `/news/monthly` 페이지 이동
- "오늘의 뉴스" 버튼 → `/news/today` 페이지 이동
- 경제 순환기 지도 모달 (중앙 글래스 모달)

**P5. 뉴스 상세 (`/news/[id]`)** ✅ 구현 완료

- **Block 1: AI 뉴스 해설** (쉬운 제목 + 요약)
- **Block 2: 최악의 시나리오** (사용자 상황 기반 개인화)
- **Block 3: Action Item** (무료 체험 중: 전체 공개, 만료 후: 블러)
- **Block 4: 뉴스 제목 카드**
- **출처 및 원문 링크**

**P6. 경제 순환기 지도 (`/cycle`)** ✅ 구현 완료 (v2)

- **좌측: 순환기 특징 표** (회복기, 확장기, 둔화기, 침체기)
- **우측: 근거 지표 시각화**
  - 신호등 색상 표시 (Red/Yellow/Green)
  - 레이더 차트 애니메이션
  - 계기판 디자인
  - 현재 상황 요약 (AI 작성)
  - 역사적 패턴/팩트 (AI 작성)
  - 근거 지표 숫자 (장단기 금리차, 실업률, 원/달러 환율)

**P7. 프로필 설정** ✅ Boarding Pass Modal에서 구현됨

- Boarding Pass의 "환경설정" 버튼으로 온보딩 플로우 재진입
- 관심사/상황/AI 레벨 재설정 가능
- 구독 정보 표시 (무료 체험 남은 기간)

**P8. Paywall (`/paywall`)**

- "체험 비행이 종료되었습니다"
- 토스페이먼츠 결제창(카드 등록) 연결

### 3.3 Legal Pages

**P9. 개인정보 처리방침 (`/privacy`)P10. 이용약관 (`/terms`)**

---

## 4. API 목록

### 4.1 인증 API (Clerk 제공)

**POST `/api/auth/signup`**

- Request: email, password
- Response: user_id, session_token

**POST `/api/auth/login`**

- Request: email, password
- Response: session_token

**GET `/api/auth/me`**

- Headers: Authorization: Bearer {token}
- Response: user 정보

### 4.2 온보딩 API

**POST `/api/onboarding/complete`**

```json
Request:
{
  "user_id": "uuid",
  "level": 2,  // 1, 2, 또는 3
  "interests": ["stock", "etf"],
  "contexts": ["loan-holder", "employee"]
}

Response:
{
  "success": true,
  "profile_id": "uuid"
}

```

### 4.3 뉴스 API ✅ 구현 완료

**GET `/api/news`** ✅

```json
Query Params:
- user_id: uuid (필수)
- date: YYYY-MM-DD (선택, 기본 오늘)
- category: string (선택, 관심분야)
- limit: integer (선택, 기본 5)

Response:
{
  "news": [
    {
      "id": "uuid",
      "title": "한은 기준금리 동결",
      "category": "stock",
      "published_at": "2025-01-15T09:00:00Z"
    }
  ]
}

```

**GET `/api/news/[id]`** ✅

```json
Query Params:
- user_id: uuid (필수)

Response:
{
  "id": "uuid",
  "title": "한은 기준금리 동결",
  "url": "https://news.com/...",
  "content": "원문 내용...",
  "published_at": "2025-01-15T09:00:00Z",
  "source": "조선일보",
  "analysis": {
    "level": 2,
    "easy_title": "금리가 그대로 유지됩니다",
    "summary": "한국은행이 기준금리를...",
    "worst_scenario": "대출 보유자님께는 월 이자 부담이 유지되며...",
    "user_action_tip": "구체적인 행동 지침...",
    "should_blur": false  // 무료 체험 중: false, 만료 후: true
  },
  "subscription": {
    "active": true,
    "days_remaining": 15
  }
}

```

### 4.4 구독 API 🔄 v3: Post-Launch로 연기

**GET `/api/subscription/status`** ✅ 기본 로직 완료

- 현재 구독 상태 조회 (무료 체험 남은 기간)
- Clerk 메타데이터에서 구독 정보 조회

**POST `/api/subscription/register-card`** 🔄 v3로 이동

- 토스페이먼츠 카드 등록 API
- 빌링키(Billing Key) 발급 및 저장

**POST `/api/webhooks/toss`** 🔄 v3로 이동

- 토스페이먼츠 Webhook 처리 (결제 성공/실패)
- 결제 성공 → subscriptions 업데이트

### 4.5 마스터 데이터 API

**GET `/api/interests`**

```json
Response:
{
  "interests": [
    {"id": "uuid", "name": "부동산", "slug": "real-estate"},
    {"id": "uuid", "name": "주식", "slug": "stock"}
  ]
}

```

**GET `/api/contexts`**

```json
Response:
{
  "contexts": [
    {"id": "uuid", "name": "대출보유", "slug": "loan-holder"},
    {"id": "uuid", "name": "직장인", "slug": "employee"}
  ]
}

```

### 4.6 경제 순환기 API (v2) ✅ 구현 완료

**GET `/api/cycle/current`** ✅

```json
Response:
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
  },
  "updated_at": "2025-12-12T09:00:00Z"
}

```

**구현 상태:**

- n8n 워크플로우로 매일 자동 업데이트
- FRED API 연동 완료
- 신호등 색상 규칙 기반 자동 계산
- Claude AI로 요약 및 역사적 패턴 자동 생성

---

## 5. 데이터 스키마

**디자인 도구:** ERD Cloud를 사용하여 데이터베이스 스키마 설계 및 SQL 추출

**보안 전략:**

- **RLS(Row Level Security) 미사용**
- **API 레벨 보안**: 모든 DB 작업은 Next.js API Routes를 통해서만 실행
- **인증 방식**: Clerk로 사용자 인증 후 본인 데이터만 접근 허용
- **Service Role Key**: 서버에서만 사용 (클라이언트 노출 금지)

### 5.1 Core Tables

**users**

```sql
id: uuid PRIMARY KEY
clerk_id: text UNIQUE
email: text UNIQUE
created_at: timestamp

```

**user_profiles**

```sql
id: uuid PRIMARY KEY
user_id: uuid FK(users) UNIQUE
level: integer (1~3)
onboarded_at: timestamp

```

**interests** (마스터 테이블)

```sql
id: uuid PRIMARY KEY
name: text (부동산, 가상화폐, ETF, 주식, 환율)
slug: text UNIQUE
description: text
is_active: boolean
created_at: timestamp

```

**contexts** (마스터 테이블)

```sql
id: uuid PRIMARY KEY
name: text (대출보유, 예적금만함, 달러보유, 사업가, 직장인, 해외여행)
slug: text UNIQUE
description: text
is_active: boolean
created_at: timestamp

```

**user_interests** (N:M 연결)

```sql
id: uuid PRIMARY KEY
user_id: uuid FK(users)
interest_id: uuid FK(interests)
created_at: timestamp
UNIQUE(user_id, interest_id)

```

**user_contexts** (N:M 연결)

```sql
id: uuid PRIMARY KEY
user_id: uuid FK(users)
context_id: uuid FK(contexts)
created_at: timestamp
UNIQUE(user_id, context_id)

```

### 5.2 News Tables

**sources**

```sql
id: uuid PRIMARY KEY
rss_url: text
homepage_url: text
last_ingested_at: timestamp
created_at: timestamp

```

**news**

```sql
id: uuid PRIMARY KEY
source_id: uuid FK(sources)
title: text
url: text UNIQUE
content: text
published_at: timestamp
ingested_at: timestamp
metadata: json
  - category: string
  - thumbnail_url: string
  - impact_score: integer
  - is_curated: boolean

```

**news_analysis_levels** (1개 뉴스 = 3개 레코드)

```sql
id: uuid PRIMARY KEY
news_id: uuid FK(news)
level: integer (1~3)
easy_title: text
summary: text (350자)
worst_scenario: text (또는 JSON으로 context별 시나리오)
user_action_tip: text
action_blurred: boolean DEFAULT true
created_at: timestamp

```

### 5.3 Subscription Tables

**subscriptions**

```sql
id: uuid PRIMARY KEY
user_id: uuid FK(users) ON DELETE CASCADE
plan: text ('free' or 'premium')
started_at: timestamp
ends_at: timestamp
active: boolean DEFAULT true
tosspayments_subscription_id: text (nullable)
created_at: timestamp
updated_at: timestamp

```

**인덱스:**

- idx_subscriptions_user_id
- idx_subscriptions_active

### 5.4 v2 Tables

**cycle_explanations** (경제 순환기 근거 지표 및 AI 분석)

```sql
-- Supabase에서 실행할 SQL
CREATE TABLE public.cycle_explanations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),

  -- 버전 관리
  recorded_at timestamp with time zone NOT NULL, -- FRED 데이터 기준 시점
  is_latest boolean DEFAULT true, -- 최신 버전 표시

  -- 1. 신호등 색상 (규칙 기반 자동 계산)
  status_color text NOT NULL, -- 'Red', 'Yellow', 'Green'

  -- 2. 현재 상황 요약 (AI 작성)
  summary_text text NOT NULL,
  -- 예: "미국 장단기 금리차가 -0.4%p로 역전된 상태가 지속되고 있습니다."

  -- 3. 역사적 패턴/팩트 (AI 작성)
  historical_pattern text NOT NULL,
  -- 예: "과거 1980년 이후 금리차가 역전된 사례에서, 평균 12~18개월 후 경기 침체(Recession)가 뒤따랐던 역사적 패턴이 있습니다."

  -- 4. 근거 지표 모음 (FRED API에서 수집한 숫자 데이터)
  indicators_snapshot jsonb NOT NULL,
  -- 구조 예:
  -- {
  --   "yield_curve": {"value": -0.42, "unit": "%p", "date": "2025-12-11", "source": "FRED:T10Y2Y"},
  --   "unemployment_rate": {"value": 4.2, "unit": "%", "mom_change": 0.1, "date": "2025-11-30", "source": "FRED:UNRATE"},
  --   "usd_krw": {"value": 1330.5, "unit": "KRW", "mom_change": 35.2, "date": "2025-12-11", "source": "FRED:DEXKOUS"}
  -- }

  CONSTRAINT cycle_explanations_pkey PRIMARY KEY (id)
);

-- 인덱스 생성
CREATE INDEX idx_cycle_latest ON public.cycle_explanations(is_latest)
WHERE is_latest = true;

CREATE INDEX idx_cycle_created ON public.cycle_explanations(created_at DESC);

```

**admin_edits** (v3)

```sql
id: uuid PRIMARY KEY
analysis_level_id: uuid FK(news_analysis_levels)
admin_id: uuid FK(users)
note: text
edited_at: timestamp

```

### 5.5 핵심 쿼리

**사용자 맞춤 뉴스 리스트:**

```sql
SELECT
  n.id, n.title, n.published_at,
  nal.summary, nal.worst_scenario
FROM news n
JOIN news_analysis_levels nal ON n.id = nal.news_id
JOIN user_profiles up ON nal.level = up.level
JOIN user_interests ui ON ui.user_id = up.user_id
JOIN interests i ON ui.interest_id = i.id
WHERE up.user_id = $1
  AND n.metadata->>'category' = i.slug
  AND n.published_at >= NOW() - INTERVAL '1 day'
  AND (n.metadata->>'is_curated')::boolean = true
ORDER BY n.published_at DESC
LIMIT 5;

```

**온보딩 완료:**

```sql
-- 1. 프로필 생성
INSERT INTO user_profiles (user_id, level, onboarded_at)
VALUES ($1, 2, NOW());

-- 2. 관심사 연결
INSERT INTO user_interests (user_id, interest_id)
SELECT $1, id FROM interests WHERE slug = ANY($2::text[]);

-- 3. 상황 연결
INSERT INTO user_contexts (user_id, context_id)
SELECT $1, id FROM contexts WHERE slug = ANY($3::text[]);

-- 4. 무료 구독 시작
INSERT INTO subscriptions (user_id, plan, started_at, ends_at, active)
VALUES ($1, 'free', NOW(), NOW() + INTERVAL '30 days', true);

```

**Paywall 체크:**

```sql
SELECT active FROM subscriptions
WHERE user_id = $1
ORDER BY started_at DESC
LIMIT 1;

```

**최신 경제 순환기 데이터 조회:**

```sql
SELECT
  status_color,
  summary_text,
  historical_pattern,
  indicators_snapshot,
  recorded_at
FROM cycle_explanations
WHERE is_latest = true
ORDER BY created_at DESC
LIMIT 1;

```

---

## 6. 유저 플로우

### 6.1 신규 사용자 온보딩

```
1. 랜딩 페이지
   ↓ [30일 무료 시작 클릭]
2. 회원가입 (Clerk)
   ↓ [이메일/소셜 가입]
3. 온보딩 - 관심 자산 선택
   ↓ [주식, ETF 선택]
4. 온보딩 - 나의 상황 선택
   ↓ [대출보유, 직장인 선택]
5. 온보딩 - AI 레벨 선택
   ↓ [Lv.2 (일반) 선택]
6. 메인 대시보드
   ↓ [오늘의 뉴스 자동 노출]

```

**DB 변화:**

```
users → user_profiles (level 저장) → user_interests → user_contexts → subscriptions

```

### 6.2 일상 뉴스 소비

```
1. 웹사이트 직접 접속 (또는 북마크)
   ↓
2. 메인 대시보드
   - "이달의 뉴스" 확인
   - "오늘의 뉴스" 클릭 → 관심분야별 TOP 5 목록
   ↓ [뉴스 제목 클릭]
3. 뉴스 상세
   - Block 1: 해설 읽기
   - Block 2: 최악의 시나리오 확인
   - Block 3: Action Item
     → 무료 체험 중(30일): 전체 공개
     → 31일차 이후: 블러 처리
   ↓ [31일차 이후 블러 클릭]
4. Paywall → 토스페이먼츠 카드 등록

```

### 6.3 유료 전환

```
1. 30일차 웹사이트 접속
   ↓ [팝업: "내일 종료, 지금 구독?"]
2. 31일차 웹사이트 접속
   ↓ [Paywall: "체험 종료"]
3. 토스페이먼츠 결제창
   ↓ [카드 결제]
4. Webhook 처리
   ↓ [subscriptions.active = true]
5. 메인 대시보드 복귀

```

### 6.4 경제 순환기 데이터 업데이트 플로우 (v2)

```
[n8n 워크플로우 - 매일 09:00 자동 실행]

1. FRED API 호출
   ↓ 3개 지표 수집 (장단기 금리차, 미국 실업률, 원/달러 환율)

2. 규칙 기반 신호등 색상 계산
   ↓ determineStatusColor() 함수 실행
   ↓ 점수 계산 → Red/Yellow/Green 결정

3. Claude API 호출
   ↓ Input: status_color + indicators_snapshot
   ↓ Output: summary_text + historical_pattern

4. DB 저장
   ↓ cycle_explanations 테이블에 INSERT
   ↓ 이전 레코드의 is_latest = false 업데이트

5. 사용자 접속 시
   ↓ GET /api/cycle/current 호출
   ↓ is_latest=true인 최신 데이터 반환
```

---

## 7. 엣지 케이스

### 7.1 인증 관련

**E1. 이미 가입된 이메일로 재가입 시도**

- Clerk 자동 처리: "이미 계정이 있습니다" 표시
- 로그인 페이지로 유도

**E2. 소셜 로그인 실패**

- 에러 메시지: "일시적 오류입니다. 다시 시도해주세요"
- 재시도 버튼 제공

**E3. 온보딩 중도 이탈**

- 상태 저장: user_profiles에 onboarded_at NULL 유지
- 다음 웹사이트 접속 시 온보딩 이어서 진행

### 7.2 뉴스 관련

**E4. 뉴스 분석 미완료**

- 뉴스는 표시하되 "분석 중입니다" 메시지
- 5분 후 자동 새로고침 유도

**E5. 관심사에 해당하는 뉴스 0건**

- Empty State: "오늘은 새로운 뉴스가 없어요 ☁️"
- 다른 관심사 추천 버튼

**E6. 네트워크 오류로 뉴스 로딩 실패**

- 스켈레톤 UI 표시
- "연결이 불안정합니다" 토스트
- 재시도 버튼

**E7. 뉴스 URL 원문이 404**

- "원문 링크가 만료되었습니다" 표시
- AI 해석은 정상 제공

### 7.3 구독 관련

**E8. 토스페이먼츠 결제/카드등록 실패**

- 토스 결제 에러 메시지 표시
- "다른 결제 수단 시도" 버튼

**E9. 결제 중 이탈**

- subscriptions 테이블 변화 없음
- 다음 접속 시 Paywall 재표시

**E10. 31일차 정확한 시각 계산**

- Cron Job 매일 00:00 실행
- ends_at < NOW() 조건으로 active=false 업데이트
- 다음 웹사이트 접속 시 Paywall 자동 표시

**E11. 구독 취소 후 재구독**

- 이전 구독 데이터 유지
- 새 subscriptions 레코드 생성

### 7.4 데이터 관련

**E12. 관심사 선택 안 하고 다음 버튼**

- 버튼 비활성화
- "최소 1개 이상 선택해주세요" 토스트

**E13. interests/contexts 테이블에 새 항목 추가**

- is_active=false로 시작
- 운영자 검토 후 is_active=true

**E14. 사용자 삭제 요청 (GDPR)**

- users 삭제 시 CASCADE로 모든 연결 데이터 삭제
- subscriptions도 자동 삭제

### 7.5 AI 파이프라인 관련

**E15. Claude API 할당량 초과**

- 에러 로그 기록
- 관리자 이메일 알림
- 해당 날짜 뉴스는 수동 분석 대체

**E16. RSS 피드 다운**

- 다른 소스로 폴백
- 최소 10개 뉴스 확보 목표

**E17. 뉴스에 전문 용어가 많아 Lv.1 설명도 어려움**

- 프롬프트에 "중학생도 이해 가능하게" 명시
- 2차 검수 후 재생성

### 7.6 보안 관련

**E18. 인증되지 않은 API 요청**

- 401 Unauthorized 에러 반환
- "로그인이 필요합니다" 메시지 표시
- 로그인 페이지로 리다이렉트

**E19. 다른 사용자 데이터 접근 시도**

- API에서 user_id 불일치 감지
- 403 Forbidden 에러 반환
- 접근 시도 로그 기록 (악의적 패턴 모니터링)

**E20. Service Role Key 노출 시도**

- 클라이언트 코드에서 절대 사용 금지
- 서버 환경 변수로만 접근
- GitHub Secrets Scanning 활성화

### 7.7 경제 순환기 관련 (v2)

**E21. FRED API 호출 실패**

- 에러 로그 기록
- 이전 데이터 유지 (is_latest 그대로)
- 1시간 후 재시도

**E22. FRED API에서 일부 지표만 수집 실패**

- 수집된 지표로만 신호등 색상 계산
- summary_text에 "일부 지표 미수집" 명시
- 누락된 지표는 "N/A" 표시

**E23. AI 분석 실패 (Claude API 오류)**

- 신호등 색상은 유지 (규칙 기반이므로 영향 없음)
- summary_text와 historical_pattern은 이전 데이터 재사용
- 재시도 스케줄링

**E24. 신호등 색상 계산 로직 버그**

- 기본값 "Yellow" 반환
- 에러 로그 기록 및 관리자 알림
- 수동 확인 후 수정

---

## 🎯 최종 목표

1. **개인화:** 내가 선택한 관심분야, 상황, 레벨에 딱 맞는 뉴스
2. **자동화:** 매일 자동으로 최신 뉴스 해설 생성
3. **필터링:** 관련 없는 뉴스는 안 보임
4. **실용성:** "나"에게 필요한 정보만 간결하게

---

## 8. 개발 우선순위 및 일정

**총 개발 기간: 33일 (2025.12.11 ~ 2026.01.13)**

### Week 1 (Day 1-7: 12/11 ~ 12/17) ✅ 100% 완료

- ✅ Day 1-2: 프로젝트 셋업 (Next.js, Supabase, Clerk)
- ✅ Day 3-5: AI 파이프라인 (Gemini 2.5 Flash API 연동, n8n 뉴스 수집)
- ✅ Day 6-7: 인증 + 온보딩 UI (관심사/상황/AI 레벨 선택)

### Week 2 (Day 8-14: 12/18 ~ 12/24) ✅ 100% 완료

- ✅ Day 8-10: 메인 대시보드 (3D 지구 기반 In Flight Map 컨셉)
- ✅ Day 11-13: 뉴스 상세 페이지
- ✅ Day 14: v1 중간 테스트

### Week 3 (Day 15-21: 12/25 ~ 12/31) ✅ 100% 완료

- ✅ Day 15-16: v1 통합 테스트 및 버그 수정
- ✅ Day 17-19: 경제 순환기 지도 (v2)
  - ✅ FRED API 연동
  - ✅ 신호등 색상 로직 구현
  - ✅ AI 요약 생성 (Claude 3.5 Sonnet)
  - ✅ cycle_explanations 테이블 구축
- ✅ Day 20-21: n8n 워크플로우 완성

### Week 4 (Day 22-28: 2026.01/01 ~ 01/07) 🔄 진행 중 (현재 Day 27)

- 🔄 Day 22-23: 토스페이먼츠 결제 시스템 → **v3: Post-Launch로 연기**
- ✅ Day 24-25: 프로필 설정 → **Boarding Pass Modal에서 구현됨**
- 🔄 Day 26-27: 전체 QA 1차 및 보안 강화 (RLS 정책)
- 🔄 Day 28: 성능 최적화 (Lighthouse 점검)

### Week 5 (Day 29-33: 01/08 ~ 01/13) 📋 예정

- 📋 Day 29-30: 전체 QA 2차 (크로스 브라우저, 모바일)
- 📋 Day 31: 법적 문서 작성 (개인정보 처리방침, 이용약관)
- 📋 Day 32: 최종 버그 수정 및 배포 준비
- 📋 Day 33: 프로덕션 배포 및 런칭 🚀

**개발 진행률:**

- Week 1-3: ✅ **100% 완료**
- Week 4: 🔄 **70% 진행 중** (QA 및 최적화)
- Week 5: 📋 **예정** (최종 준비 및 런칭)

---

## 9. 기술 스택

**Frontend:** Next.js 15.5.9 (Web), shadcn/ui, Tailwind CSS v4, Three.js (3D 지구)
**Backend:** Next.js API Routes, Supabase (PostgreSQL)
**Auth:** Clerk (소셜 로그인, 이메일 인증) - 한국어 로컬라이제이션
**Payment:** 토스페이먼츠 (Toss Payments) - v3: Post-Launch로 연기
**AI:** Google Gemini 2.5 Flash (뉴스 분석 및 해설)
**Data Sources:** FRED API (경제 지표)
**Automation:** n8n (뉴스 수집, FRED API 수집, AI 분석 트리거, DB 저장)
**Hosting:** Vercel (Frontend + API), Supabase Cloud (Database)
**Analytics:** Vercel Analytics, PostHog
**Web 최적화:**

- 반응형 디자인 (PC 위주)
- PWA Ready (v3에서 구현 시 홈 화면 추가 가능)
- 크로스 브라우저 지원 (Chrome, Safari, Firefox, Edge)

**필수 환경 변수:**

```
# AI APIs
GEMINI_API_KEY=AIza... (Google Gemini 2.5 Flash - 뉴스 분석 및 해설용)

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... (필수! 서버 사이드 전용)

# Data Sources
FRED_API_KEY=xxx... (경제 지표 수집용)

# Payment (v3: Post-Launch로 연기)
# TOSS_PAYMENTS_CLIENT_KEY=test_ck_... (클라이언트용)
# TOSS_PAYMENTS_SECRET_KEY=test_sk_... (서버용)

```

**⚠️ 보안 주의:**

- `SUPABASE_SERVICE_ROLE_KEY`는 반드시 서버 환경 변수에만 저장
- 클라이언트(브라우저)에 절대 노출 금지
- GitHub 코드에 업로드 금지 (`.env` 파일 `.gitignore`에 포함)

---

## 10. 성공 지표

**Week 1 (출시 직후):**

- 가입자 100명
- DAU 50명
- 크리티컬 버그 0건

**Month 1 (출시 후 1개월):**

- MAU 1,000명
- 뉴스 완독률 65%+
- 유료 전환율 15%+
- NPS 50+

**Month 3 (성장기):**

- 유료 구독자 200명
- MRR 120만원
- Churn Rate 10% 이하

---

## 11. 체크리스트

**개발 완료 전 필수:**

- [ ] 모든 API 엔드포인트 테스트 완료
- [ ] **모든 API에 인증 미들웨어 적용 확인** (Clerk 인증 체크)
- [ ] API별 user_id 검증 (본인 데이터만 접근)
- [x] Paywall 로직 동작 확인 (31일차 차단) ✅
- [ ] ~~토스페이먼츠 Webhook 테스트~~ → **v3: Post-Launch로 연기**
- [ ] ~~토스페이먼츠 상점 관리자 확인~~ → **v3: Post-Launch로 연기**
- [x] 모바일 반응형 100% (스마트폰 브라우저 최적화) ✅
- [ ] 크로스 브라우저 테스트 (Chrome, Safari, Firefox, Edge)
- [ ] Lighthouse 점수 80+
- [ ] 개인정보 처리방침 작성
- [ ] 이용약관 작성
- [ ] DB 백업 설정
- [x] 환경 변수 보안 확인 (Service Role Key 서버 전용) ✅
- [x] `.env` 파일 GitHub 업로드 안 됨 확인 ✅

**보안 체크리스트 (추가):**

- [ ] **RLS(Row Level Security) 정책 적용** (최우선)
- [x] `SUPABASE_SERVICE_ROLE_KEY`가 클라이언트 코드에 노출되지 않음 ✅
- [x] 모든 API 라우트에서 Clerk 인증 확인 ✅
- [x] 사용자가 본인 데이터만 조회/수정 가능 (user_id 필터링) ✅
- [ ] RLS 정책 테스트 (Anon vs Authenticated vs Service Role)

**v2 기능 체크리스트 (경제 순환기):** ✅ 완료

- [x] FRED API 연동 테스트 (3개 지표 수집) ✅
- [x] 신호등 색상 로직 검증 (determineStatusColor 함수) ✅
- [x] n8n 워크플로우 설정 (매일 자동 실행) ✅
- [x] Claude API로 summary_text, historical_pattern 생성 테스트 ✅
- [x] cycle_explanations 테이블 데이터 저장 확인 ✅
- [x] is_latest 플래그 업데이트 로직 검증 ✅
- [x] GET /api/cycle/current API 응답 확인 ✅

**AI 뉴스 파이프라인 체크리스트:** ✅ 완료

- [x] n8n 뉴스 수집 워크플로우 완성 ✅
- [x] Google Gemini 2.5 Flash API 연동 ✅
- [x] 뉴스 데이터 DB 저장 정상 작동 확인 ✅
- [x] 웹사이트 뉴스 표시 정상화 ✅
- [x] 관심분야별 카테고리 필터링 작동 ✅

**런칭 후 모니터링:**

- [ ] Sentry 에러 트래킹
- [ ] PostHog 이벤트 수집 확인
- [ ] ~~토스페이먼츠 상점 관리자 결제 내역 확인~~ → **v3: Post-Launch로 연기**
- [ ] 사용자 피드백 수집 (Typeform 또는 웹 내 피드백 폼)
- [x] FRED API 호출 성공률 모니터링 ✅
- [x] 경제순환기 데이터 업데이트 로그 확인 ✅
- [x] n8n 뉴스 워크플로우 실행 로그 확인 ✅

---

## 📝 문서 변경 이력

**2026.01.07 (Day 27) - 최신 업데이트:**

- ✅ Week 1-3 완료 상태 반영 (100%)
- ✅ AI 뉴스 파이프라인 완료 (Google Gemini 2.5 Flash + n8n)
- ✅ 경제 순환기 지도 완료 (FRED API + Claude 3.5 Sonnet)
- ✅ 3D 지구 기반 In Flight Map 대시보드 완료
- ✅ Boarding Pass Modal 구현 완료
- 🔄 토스페이먼츠 결제 시스템 → v3: Post-Launch로 연기
- 🔄 Week 4: QA 및 최적화 진행 중

**다음 단계:**

- RLS(Row Level Security) 정책 적용
- Lighthouse 성능 최적화
- 법적 문서 작성
- 프로덕션 배포 준비

---

이 PRD는 Cursor, Claude, n8n이 참조할 단일 진실 공급원(Single Source of Truth)입니다.
모든 개발 결정은 이 문서를 기준으로 합니다.
