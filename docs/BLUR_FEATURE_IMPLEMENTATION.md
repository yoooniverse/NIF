# 액션팁 블러 처리 기능 구현 가이드

## 📋 개요

**문제:** 30일 무료체험이 끝나도 액션팁(행동 가이드)이 블러 처리되지 않고 계속 보임

**목표:** 무료체험 종료 후 구독하지 않은 사용자는 액션팁을 블러 처리하여 유료 전환 유도

**구현일:** 2026-01-09

---

## 🎯 요구사항

### 액션팁을 볼 수 있는 사용자 (블러 해제)

- ✅ 무료체험 중 (가입 후 30일 이내)
- ✅ 유료 구독자 (plan='premium' AND active=true AND ends_at > 현재시각)

### 액션팁이 블러 처리되는 사용자

- ❌ 무료체험 종료 (31일 이상)
- ❌ 무료 플랜 (plan='free' 또는 구독 없음)

---

## 🔧 구현 내용

### 1. API 수정 (`app/api/news/[id]/route.ts`)

#### 변경 1: Subscriptions 테이블 조회 추가

**위치:** 사용자 정보 조회 직후

```typescript
// 2. 구독 정보 조회 (subscriptions 테이블)
console.group("[API][NEWS_DETAIL] 📋 구독 상태 확인");
const { data: subscriptionData, error: subscriptionError } = await supabase
  .from("subscriptions")
  .select("plan, active, ends_at")
  .eq("clerk_id", userId)
  .order("started_at", { ascending: false }) // ⚠️ created_at이 없어서 started_at 사용
  .limit(1)
  .single();

console.log("[API][NEWS_DETAIL] Subscription data:", subscriptionData);
console.log("[API][NEWS_DETAIL] Subscription error:", subscriptionError);

// 유료 구독자 확인 (plan='premium' AND active=true AND ends_at > now)
const isPremiumSubscriber =
  subscriptionData &&
  subscriptionData.plan === "premium" &&
  subscriptionData.active === true &&
  new Date(subscriptionData.ends_at) > now;

console.log("[API][NEWS_DETAIL] 📊 블러 판단 로직:");
console.log("[API][NEWS_DETAIL]   - 무료체험 중:", isTrialPeriod);
console.log("[API][NEWS_DETAIL]   - 유료 구독자:", isPremiumSubscriber);
console.log("[API][NEWS_DETAIL]   - 구독 플랜:", subscriptionData?.plan);
console.log("[API][NEWS_DETAIL]   - 구독 활성:", subscriptionData?.active);
console.log("[API][NEWS_DETAIL]   - 구독 만료:", subscriptionData?.ends_at);
console.groupEnd();
```

#### 변경 2: 블러 로직 수정

**기존 코드:**

```typescript
// 무료 체험 기간이면 블러 처리 해제, 아니면 데이터베이스 설정값 사용
const shouldBlur = isTrialPeriod ? false : analysis?.action_blurred !== false;
```

**수정된 코드:**

```typescript
// 🔒 블러 처리 로직
// ✅ 액션팁 볼 수 있는 사람: 무료체험 중 OR 유료 구독자
// ❌ 액션팁 블러되는 사람: 무료체험 종료 AND 무료 플랜
const canViewActionTips = isTrialPeriod || isPremiumSubscriber;
const shouldBlur = canViewActionTips
  ? false
  : analysis?.action_blurred !== false;

console.log("[API][NEWS_DETAIL] 🔒 블러 처리 결과:");
console.log("[API][NEWS_DETAIL]   - 액션팁 볼 수 있음:", canViewActionTips);
console.log("[API][NEWS_DETAIL]   - 블러 적용:", shouldBlur);
console.log(
  "[API][NEWS_DETAIL]   - 이유:",
  canViewActionTips
    ? isTrialPeriod
      ? "무료체험 중"
      : "유료 구독자"
    : "무료체험 종료 + 무료 플랜",
);
```

---

## 🧪 테스트 방법

### 준비: 현재 사용자의 clerk_id 확인

```sql
-- users 테이블에서 본인의 clerk_id 확인
SELECT clerk_id, name, email, onboarded_at
FROM users
ORDER BY onboarded_at DESC
LIMIT 5;
```

### 시나리오 1: 무료체험 종료 + 구독 안함 (블러 적용)

#### Step 1: subscriptions 테이블에 데이터 추가

```sql
INSERT INTO subscriptions (
  clerk_id,
  plan,
  started_at,
  ends_at,
  active
) VALUES (
  'user_YOUR_CLERK_ID',        -- ⚠️ 본인 clerk_id로 변경
  'free',                      -- 무료 플랜
  NOW() - INTERVAL '31 days',  -- 31일 전 시작
  NOW() - INTERVAL '1 day',    -- 어제 만료
  false                        -- 비활성
);
```

#### Step 2: users 테이블의 onboarded_at 수정

```sql
-- onboarded_at을 31일 이전으로 변경
UPDATE users
SET onboarded_at = NOW() - INTERVAL '31 days'
WHERE clerk_id = 'user_YOUR_CLERK_ID';  -- ⚠️ 본인 clerk_id로 변경
```

#### Step 3: 확인

```sql
-- subscriptions 확인
SELECT clerk_id, plan, active, ends_at,
  CASE
    WHEN plan = 'premium' AND active = true AND ends_at > NOW()
    THEN '✅ 유료 구독 활성'
    WHEN plan = 'free' AND active = false AND ends_at < NOW()
    THEN '❌ 무료체험 종료'
    ELSE '⏰ 기타'
  END as status
FROM subscriptions
WHERE clerk_id = 'user_YOUR_CLERK_ID'
ORDER BY started_at DESC;

-- users 확인
SELECT clerk_id, onboarded_at, NOW() - onboarded_at as "경과시간"
FROM users
WHERE clerk_id = 'user_YOUR_CLERK_ID';
```

#### Step 4: 웹사이트 테스트

1. 개발 서버 실행 (`pnpm dev`)
2. 브라우저에서 뉴스 상세 페이지 접속
3. 액션팁(행동 가이드)이 **블러 처리**되는지 확인
4. 터미널에서 로그 확인:

```
[API][NEWS_DETAIL] 📋 구독 상태 확인
[API][NEWS_DETAIL] Subscription data: { plan: 'free', active: false, ends_at: '...' }
[API][NEWS_DETAIL] 📊 블러 판단 로직:
[API][NEWS_DETAIL]   - 무료체험 중: false
[API][NEWS_DETAIL]   - 유료 구독자: false
[API][NEWS_DETAIL] 🔒 블러 처리 결과:
[API][NEWS_DETAIL]   - 액션팁 볼 수 있음: false
[API][NEWS_DETAIL]   - 블러 적용: true  ✅
[API][NEWS_DETAIL]   - 이유: 무료체험 종료 + 무료 플랜
```

### 시나리오 2: 유료 구독자 (블러 해제)

```sql
-- 유료 구독 데이터 추가
INSERT INTO subscriptions (
  clerk_id,
  plan,
  started_at,
  ends_at,
  active
) VALUES (
  'user_YOUR_CLERK_ID',
  'premium',                   -- 유료 플랜
  NOW() - INTERVAL '5 days',   -- 5일 전 시작
  NOW() + INTERVAL '25 days',  -- 25일 후 만료
  true                         -- 활성
);
```

**기대 결과:**

```
[API][NEWS_DETAIL]   - 유료 구독자: true
[API][NEWS_DETAIL]   - 블러 적용: false  ✅
[API][NEWS_DETAIL]   - 이유: 유료 구독자
```

### 테스트 데이터 삭제

테스트 완료 후:

```sql
-- subscriptions 테스트 데이터 삭제
DELETE FROM subscriptions
WHERE clerk_id = 'user_YOUR_CLERK_ID';

-- users 원래대로 복구
UPDATE users
SET onboarded_at = NOW()
WHERE clerk_id = 'user_YOUR_CLERK_ID';
```

---

## 🐛 트러블슈팅

### 문제 1: `created_at does not exist` 에러

**에러 메시지:**

```
column subscriptions.created_at does not exist
```

**원인:** subscriptions 테이블에 `created_at` 컬럼이 없음

**해결:** `order('started_at', ...)` 사용

---

### 문제 2: 블러가 적용되지 않음

**체크리스트:**

1. **서버 재시작 확인**

   ```bash
   # Ctrl+C로 중지 후
   pnpm dev
   ```

2. **올바른 clerk_id 사용 확인**

   - 터미널 로그에서 실제 사용자 ID 확인
   - 로그인한 사용자의 ID와 SQL의 ID가 일치하는지 확인

3. **무료체험 기간 확인**

   ```sql
   SELECT clerk_id, onboarded_at, NOW() - onboarded_at as "경과시간"
   FROM users
   WHERE clerk_id = 'user_YOUR_CLERK_ID';
   ```

   - 경과시간이 30일 이상이어야 함

4. **구독 데이터 확인**

   ```sql
   SELECT * FROM subscriptions
   WHERE clerk_id = 'user_YOUR_CLERK_ID';
   ```

   - plan='free', active=false, ends_at < NOW()

5. **브라우저 캐시 삭제**
   - 하드 새로고침: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

---

## 📊 데이터베이스 스키마

### subscriptions 테이블

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT NOT NULL,
  plan TEXT NOT NULL,          -- 'free' | 'premium'
  started_at TIMESTAMP NOT NULL DEFAULT now(),
  ends_at TIMESTAMP NOT NULL,
  active BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT FK_users_TO_subscriptions
    FOREIGN KEY (clerk_id)
    REFERENCES users(clerk_id)
    ON DELETE CASCADE
);
```

### users 테이블 (관련 컬럼)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  onboarded_at TIMESTAMP NOT NULL DEFAULT now()
);
```

---

## 🎯 블러 판단 로직 플로우차트

```
사용자 접속
    ↓
users.onboarded_at 확인
    ↓
무료체험 중? (30일 이내)
    ├─ YES → 액션팁 볼 수 있음 ✅
    └─ NO → subscriptions 테이블 확인
              ↓
        plan='premium' AND active=true AND ends_at>NOW()?
              ├─ YES → 액션팁 볼 수 있음 ✅
              └─ NO → 액션팁 블러 처리 ❌
```

---

## 📝 향후 개선 사항

1. **토스페이먼츠 결제 연동** (v3: Post-Launch)

   - 카드 자동결제(Billing) 시스템
   - 빌링키 발급 및 저장
   - Webhook 처리

2. **Paywall UI 개선**

   - 블러 클릭 시 결제 모달 표시
   - 구독 혜택 안내

3. **구독 만료 알림**

   - 만료 7일 전 이메일 발송
   - 브라우저 알림

4. **구독 관리 페이지**
   - 구독 정보 확인
   - 결제 수단 변경
   - 구독 해지

---

## 📚 참고 문서

- [PRD.md](./PRD.md) - 제품 요구사항 (F6. 구독 시스템)
- [TRD.md](./TRD.md) - 기술 요구사항 (Stripe 결제 연동)
- [app/api/news/[id]/route.ts](../app/api/news/[id]/route.ts) - 실제 구현 코드

---

**작성일:** 2026-01-09  
**작성자:** AI + User  
**버전:** 1.0
