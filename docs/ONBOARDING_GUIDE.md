# 온보딩 플로우 구현 가이드

## 개요

News In Flight의 온보딩 플로우가 완성되었습니다! 여권 디자인 컨셉과 Apple의 미니멀한 UI를 결합하여 사용자 친화적인 경험을 제공합니다.

## 구현된 기능

### 1. **온보딩 레이아웃** (`app/onboarding/layout.tsx`)

- 여권 디자인 컨셉: 엠보싱 패턴, 스탬프 스타일, 클래식한 테두리
- Apple 컨셉: 깔끔한 타이포그래피, 미니멀한 레이아웃, 부드러운 애니메이션
- 스텝 인디케이터: 현재 진행 상황을 시각적으로 표시
- 프로그레스 바: 온보딩 진행률 표시

### 2. **Step 1: 관심 자산 선택** (`app/onboarding/interests/page.tsx`)

- 5개 관심사: 부동산, 가상화폐, ETF, 주식, 환율
- 멀티 선택 UI: 여러 개 선택 가능
- 유효성 검사: 최소 1개 이상 선택 필수
- 스탬프 스타일 선택 효과: 선택 시 애니메이션과 체크마크 표시

### 3. **Step 2: 나의 상황 선택** (`app/onboarding/contexts/page.tsx`)

- 6개 상황: 대출보유, 예적금만함, 달러보유, 사업가, 직장인, 해외여행
- 멀티 선택 UI: 여러 개 선택 가능
- 유효성 검사: 최소 1개 이상 선택 필수
- 이전/다음 버튼: 단계 간 이동 가능

### 4. **Step 3: AI 레벨 선택** (`app/onboarding/level/page.tsx`)

- 3개 레벨: Lv.1 (초보자), Lv.2 (일반), Lv.3 (전문가)
- 라디오 버튼 UI: 단일 선택
- 각 레벨 설명 표시: 특징과 혜택 상세 안내
- 온보딩 완료 처리: API 호출 및 대시보드 리다이렉트

### 5. **마스터 데이터 API**

- `GET /api/interests`: 관심사 목록 조회
- `GET /api/contexts`: 상황 목록 조회
- 로깅 기능: 모든 요청/응답 로그 기록

### 6. **온보딩 완료 API** (`app/api/onboarding/complete/route.ts`)

- `POST /api/onboarding/complete`: 온보딩 데이터 저장
- 다음 테이블에 저장:
  - `user_profiles`: 사용자 프로필 및 AI 레벨
  - `user_interests`: 선택한 관심사
  - `user_contexts`: 선택한 상황
  - `subscriptions`: 무료 구독 시작 (30일)
- 트랜잭션 처리: 순차적 저장 및 오류 처리
- 로깅 기능: 모든 단계별 로그 기록

### 7. **대시보드 페이지** (`app/dashboard/page.tsx`)

- 온보딩 완료 후 리다이렉트 대상
- 환영 메시지 및 상태 표시
- 무료 체험 활성화 안내

## 디자인 컨셉

### 여권 디자인 요소

- **외부 테두리**: 진한 남색 그라데이션 (여권 커버)
- **엠보싱 패턴**: 반복되는 대각선 패턴
- **스탬프 스타일**: 원형 스텝 인디케이터, 점선 테두리
- **시리얼 넘버**: 하단에 여권 스타일 고유번호 (NIF-01/03)
- **페이지 느낌**: 흰색-슬레이트 그라데이션 배경

### Apple 디자인 요소

- **타이포그래피**: SF Pro Display/Text 폰트 (fallback)
- **미니멀한 레이아웃**: 충분한 여백, 깔끔한 정렬
- **부드러운 애니메이션**: scale, opacity, transform 트랜지션
- **색상 팔레트**: 인디고-블루 그라데이션, 슬레이트 중성 톤
- **카드 스타일**: 라운드 코너, 부드러운 그림자, 호버 효과

## 설치 및 실행

### 1. 데이터베이스 마이그레이션 실행

Supabase에서 다음 마이그레이션을 순서대로 실행하세요:

```bash
# 1. 기본 스키마 생성
supabase migration up update_setup_newsinflight_schema

# 2. 온보딩 스키마 수정
supabase migration up fix_onboarding_schema
```

또는 Supabase 대시보드의 SQL Editor에서 직접 실행:

1. `workplace/supabase/migrations/update_setup_newsinflight_schema.sql`
2. `workplace/supabase/migrations/fix_onboarding_schema.sql`

### 2. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수가 설정되어 있는지 확인:

```env
# Clerk (인증)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  # 필수! 서버 전용
```

### 3. 개발 서버 실행

```bash
# 패키지 설치 (처음 한 번만)
npm install

# 개발 서버 시작
npm run dev
```

서버가 실행되면 `http://localhost:3000`에서 확인할 수 있습니다.

## 사용 방법

### 1. 회원가입/로그인

1. 홈페이지 접속: `http://localhost:3000`
2. "로그인" 또는 "회원가입" 버튼 클릭
3. Clerk 인증 완료

### 2. 온보딩 시작

1. 온보딩 페이지 접속: `http://localhost:3000/onboarding`
2. 자동으로 Step 1로 리다이렉트됨

### 3. Step 1: 관심 자산 선택

1. 관심 있는 자산 클릭 (여러 개 선택 가능)
2. 최소 1개 이상 선택
3. "다음 단계로" 버튼 클릭

### 4. Step 2: 나의 상황 선택

1. 자신의 상황에 맞는 항목 클릭 (여러 개 선택 가능)
2. 최소 1개 이상 선택
3. "다음 단계로" 버튼 클릭

### 5. Step 3: AI 레벨 선택

1. 원하는 AI 설명 레벨 선택
   - Lv.1: 초보자 (쉬운 설명)
   - Lv.2: 일반 (적당한 설명)
   - Lv.3: 전문가 (심층 분석)
2. "완료하고 시작하기" 버튼 클릭

### 6. 온보딩 완료

1. API가 데이터를 저장 (약 1-2초)
2. 자동으로 대시보드로 리다이렉트
3. 무료 구독 30일 시작

## API 엔드포인트

### GET /api/interests

관심사 목록을 조회합니다.

**Response:**

```json
{
  "interests": [
    {
      "id": "real-estate",
      "name": "부동산",
      "slug": "real-estate",
      "description": "부동산 시장 및 정책",
      "emoji": "🏡",
      "is_active": true
    }
    // ...
  ],
  "total": 5
}
```

### GET /api/contexts

상황 목록을 조회합니다.

**Response:**

```json
{
  "contexts": [
    {
      "id": "loan-holder",
      "name": "대출보유",
      "slug": "loan-holder",
      "description": "주택담보대출, 신용대출 등 보유",
      "emoji": "🏦",
      "is_active": true
    }
    // ...
  ],
  "total": 6
}
```

### POST /api/onboarding/complete

온보딩을 완료하고 데이터를 저장합니다.

**Request:**

```json
{
  "level": 2,
  "interests": ["stock", "etf"],
  "contexts": ["loan-holder", "employee"]
}
```

**Response:**

```json
{
  "success": true,
  "profile_id": "uuid",
  "message": "온보딩이 완료되었습니다!"
}
```

## 로깅

모든 API와 페이지에서 상세한 로그를 남깁니다:

### 클라이언트 로그 (브라우저 콘솔)

- `[온보딩]` 접두사로 시작
- 페이지 로드, 선택/해제, API 호출 등

### 서버 로그 (터미널)

- `[API]` 접두사로 시작
- API 요청/응답, 데이터베이스 작업, 오류 등

**예시:**

```
[온보딩] Step 1: 관심사 선택 페이지 로드
[온보딩] 관심사 목록 로드 완료: 5
[온보딩] 관심사 선택: stock
[온보딩] Step 1 완료 - 선택된 관심사: stock, etf
[API] GET /api/interests - 관심사 목록 조회 시작
[API] 관심사 목록 조회 완료: 5개 항목
[API] POST /api/onboarding/complete - 온보딩 완료 처리 시작
[API] 인증된 사용자: user_xxx
[API] 온보딩 완료 처리 성공
```

## 데이터베이스 스키마

### user_profiles

```sql
CREATE TABLE "user_profiles" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL UNIQUE REFERENCES users(id),
  "level" INTEGER NOT NULL CHECK (level BETWEEN 1 AND 3),
  "onboarded_at" TIMESTAMP DEFAULT now() NOT NULL
);
```

### user_interests

```sql
CREATE TABLE "user_interests" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES users(id),
  "interest_slug" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT now() NOT NULL,
  UNIQUE("user_id", "interest_slug")
);
```

### user_contexts

```sql
CREATE TABLE "user_contexts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES users(id),
  "context_slug" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT now() NOT NULL,
  UNIQUE("user_id", "context_slug")
);
```

### subscriptions

```sql
CREATE TABLE "subscriptions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES users(id),
  "plan" TEXT NOT NULL,  -- 'free' or 'premium'
  "started_at" TIMESTAMP DEFAULT now() NOT NULL,
  "ends_at" TIMESTAMP NOT NULL,
  "active" BOOLEAN DEFAULT false NOT NULL,
  CHECK (ends_at > started_at)
);
```

## 문제 해결

### 1. "인증이 필요합니다" 오류

- Clerk 로그인이 완료되지 않았을 수 있습니다.
- 브라우저 쿠키/캐시를 삭제하고 다시 로그인해보세요.

### 2. "사용자 정보를 찾을 수 없습니다" 오류

- Clerk에서 회원가입은 했지만 Supabase에 동기화되지 않았을 수 있습니다.
- `/api/sync-user` API가 제대로 실행되고 있는지 확인하세요.

### 3. API 호출 실패

- 환경 변수가 제대로 설정되어 있는지 확인하세요.
- `SUPABASE_SERVICE_ROLE_KEY`가 설정되어 있는지 확인하세요.
- 데이터베이스 마이그레이션이 실행되었는지 확인하세요.

### 4. 스타일이 제대로 적용되지 않음

- `npm run dev`로 개발 서버를 재시작해보세요.
- 브라우저 캐시를 삭제해보세요.

## 다음 단계

온보딩이 완료되면 다음 기능들을 구현할 수 있습니다:

1. **대시보드**: 오늘의 뉴스, 이달의 뉴스 표시
2. **뉴스 목록**: 관심사별 뉴스 필터링
3. **뉴스 상세**: AI 분석, 최악의 시나리오, 행동 가이드
4. **프로필 설정**: 온보딩 정보 수정
5. **구독 관리**: 유료 전환, 결제 관리

## 참고 자료

- [PRD.md](./PRD.md): 전체 프로젝트 요구사항
- [TODO.md](./TODO.md): 전체 개발 체크리스트
- [TRD.md](./TRD.md): 기술 요구사항
- [Clerk 문서](https://clerk.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Next.js 문서](https://nextjs.org/docs)

## 라이선스

이 프로젝트는 News In Flight의 일부입니다.




