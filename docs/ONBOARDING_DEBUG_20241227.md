# 온보딩 디버깅 보고서 - 2024년 12월 27일

## 🚨 문제 상황

온보딩 프로세스에서 **관심분야 선택항목과 나의 상황 선택항목이 바뀌어 표시**되는 문제가 발생했습니다.

### 증상

- 관심분야 선택 페이지에서 나의 상황 관련 항목들이 표시됨
- 나의 상황 선택 페이지에서 관심분야 관련 항목들이 표시됨

### 사용자 영향

- 온보딩 사용자가 잘못된 카테고리에서 선택하게 되어 데이터 일관성이 깨짐
- 사용자 경험 저하 및 데이터 신뢰성 문제

## 🔍 디버깅 과정

### 1. 초기 분석 (코드 레벨)

```typescript
// 각 페이지의 쿼리 확인
// interests 페이지
const { data: interestsData } = await supabase
  .from("interests") // ✅ 올바른 테이블
  .select("*");

// contexts 페이지
const { data: contextsData } = await supabase
  .from("contexts") // ✅ 올바른 테이블
  .select("*");
```

**결과**: 프론트엔드 코드는 정상. 각 페이지가 올바른 테이블을 조회하고 있음.

### 2. UI 레벨 확인

- 페이지 제목과 설명 텍스트 확인
- 관심분야 페이지: "DEPARTURES: 관심분야 선택하기" ✅
- 나의 상황 페이지: "DEPARTURES: 나의 상황 선택하기" ✅

**결과**: UI 텍스트도 정상.

### 3. 데이터베이스 레벨 분석

Supabase 대시보드에서 직접 테이블 확인 결과:

**발견된 문제**: 테이블 이름이 서로 바뀌어 있었음!

- `contexts` 테이블에 관심분야 데이터 저장됨 ("주식", "채권", "부동산" 등)
- `interests` 테이블에 나의 상황 데이터 저장됨 ("직장인", "학생", "투자 초보자" 등)

## 🎯 근본 원인

**데이터베이스 스키마 문제**

- 테이블 생성 시점에 이름이 잘못 지정되었거나
- 마이그레이션 과정에서 테이블 이름이 서로 바뀌었을 가능성
- 초기 데이터 시딩 시 테이블이 잘못 매핑되었을 가능성

## ✅ 해결 방법

### Supabase 대시보드에서 직접 수정

1. Supabase 대시보드 접속
2. Table Editor에서 테이블 이름 확인
3. `contexts` ↔ `interests` 테이블 이름 서로 교환
4. 데이터 일관성 검증

### 코드 레벨 검증

```typescript
// 수정 후 각 페이지에서 올바른 데이터 표시 확인
// interests 페이지: "주식", "채권", "부동산" 등 관심분야 표시 ✅
// contexts 페이지: "직장인", "학생", "투자 초보자" 등 상황 표시 ✅
```

## 📊 결과

### 수정 전

- 관심분야 페이지: 직장인, 학생, 투자 초보자... ❌
- 나의 상황 페이지: 주식, 채권, 부동산... ❌

### 수정 후

- 관심분야 페이지: 주식, 채권, 부동산... ✅
- 나의 상황 페이지: 직장인, 학생, 투자 초보자... ✅

## 🔄 오늘 추가 해결 내용 (2024년 12월 27일)

### 1. 사용자 데이터 DB 저장 구현 ✅

**문제 상황**: Clerk 인증 후 Supabase users 테이블에 사용자 정보가 저장되지 않는 문제

**해결 내용**:

- `hooks/use-sync-user.ts` 훅 구현
- `components/providers/sync-user-provider.tsx` Provider 컴포넌트 생성
- `app/api/sync-user/route.ts` API 라우트 구현
- Clerk 사용자 정보를 Supabase users 테이블에 자동 동기화

**기술적 세부사항**:

```typescript
// use-sync-user.ts
export function useSyncUser() {
  const { user: clerkUser } = useUser();
  const supabase = useSupabaseClient();

  // Clerk → Supabase 동기화 로직
  const syncUser = async () => {
    if (!clerkUser) return;

    const { data, error } = await supabase.from("users").upsert({
      clerk_id: clerkUser.id,
      name: clerkUser.fullName || clerkUser.username,
      email: clerkUser.primaryEmailAddress?.emailAddress,
    });

    if (error) {
      console.error("사용자 동기화 실패:", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  return { syncUser };
}
```

**결과**: 회원가입 시 자동으로 사용자 데이터가 Supabase DB에 저장됨

### 2. AI 해설 데이터 DB 저장 구현 ✅

**문제 상황**: Claude API로 생성한 뉴스 분석 결과가 DB에 저장되지 않는 문제

**해결 내용**:

- 뉴스 분석 API (`app/api/news/[id]/route.ts`) 수정
- AI 해설 결과를 `news_analysis_levels` 테이블에 저장
- 사용자 레벨별 분석 필터링 구현

**기술적 세부사항**:

```typescript
// 뉴스 상세 API에서 AI 분석 저장 로직
const saveAnalysisToDB = async (newsId: number, analysis: NewsAnalysis) => {
  const { data, error } = await supabase.from("news_analysis_levels").insert({
    news_id: newsId,
    level: analysis.level,
    easy_title: analysis.easy_title,
    summary: analysis.summary,
    worst_scenario: analysis.worst_scenario,
    user_action_tip: analysis.user_action_tip,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("AI 분석 저장 실패:", error);
    throw error;
  }

  return data;
};
```

**결과**: Claude API 분석 결과가 DB에 정상 저장되어 뉴스 상세 페이지에서 표시됨

### 3. 크리티컬 버그 식별 및 우선순위 설정

**발견된 버그들**:

1. **🔴 CRITICAL**: 관심분야 카테고리별 뉴스 필터링 버그

   - 증상: 카테고리 클릭 시 해당 뉴스가 표시되지 않음
   - 영향: 사용자 경험 심각 저하

2. **🔶 온보딩 로딩 화면 이상 현상**
   - 증상: 로딩 화면 표시 불안정
   - 원인: Lighthouse 성능 문제 가능성

**다음 디버깅 우선순위**:

1. 뉴스 카테고리 필터링 버그 (사용자 경험 직접 영향)
2. 온보딩 로딩 화면 개선 (성능 최적화)

## 🎓 교훈 및 개선 방안

### 1. 데이터베이스 명명 규칙 강화

```sql
-- 테이블 생성 시 명확한 네이밍
CREATE TABLE user_interests (...);  -- 사용자 관심분야
CREATE TABLE user_contexts (...);   -- 사용자 상황/맥락
```

### 2. 초기 데이터 검증 프로세스 추가

```typescript
// 마이그레이션 후 데이터 검증 스크립트
const validateOnboardingData = async () => {
  const interests = await supabase.from("interests").select("name");
  const contexts = await supabase.from("contexts").select("name");

  // 관심분야 데이터 검증
  const interestKeywords = ["주식", "채권", "부동산"];
  const hasValidInterests = interests.some((item) =>
    interestKeywords.some((keyword) => item.name.includes(keyword)),
  );

  // 상황 데이터 검증
  const contextKeywords = ["직장인", "학생", "투자"];
  const hasValidContexts = contexts.some((item) =>
    contextKeywords.some((keyword) => item.name.includes(keyword)),
  );

  if (!hasValidInterests || !hasValidContexts) {
    throw new Error("온보딩 데이터가 올바르지 않습니다");
  }
};
```

### 3. 마이그레이션 파일 개선

```sql
-- 마이그레이션 파일에 데이터 검증 추가
DO $$
BEGIN
  -- 데이터 삽입 후 검증
  IF NOT EXISTS (
    SELECT 1 FROM interests WHERE name LIKE '%주식%'
  ) THEN
    RAISE EXCEPTION 'Interests 테이블에 올바른 데이터가 없습니다';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM contexts WHERE name LIKE '%직장인%'
  ) THEN
    RAISE EXCEPTION 'Contexts 테이블에 올바른 데이터가 없습니다';
  END IF;
END $$;
```

### 4. 모니터링 및 알림 시스템

- 데이터베이스 변경 감지
- 초기 데이터 무결성 체크
- 프로덕션 배포 전 검증 단계 추가

## 📝 후속 조치

1. **테스트 케이스 추가**

   - 온보딩 데이터 표시 정확성 테스트
   - 데이터베이스 마이그레이션 검증 테스트

2. **문서화 개선**

   - 데이터베이스 스키마 문서 업데이트
   - 초기 데이터 명세서 작성

3. **프로세스 개선**
   - 코드 리뷰 시 데이터베이스 스키마 검토 의무화
   - 마이그레이션 파일 리뷰 강화

## 🏁 결론 및 전체 진행 상황

### 온보딩 테이블 문제 해결 ✅

**문제**: 데이터베이스 테이블 이름이 서로 바뀌어 있어 온보딩 데이터가 잘못 표시됨

**해결**: Supabase 대시보드에서 테이블 이름을 올바르게 교환

**결과**: 온보딩 플로우 정상 작동

### 오늘 추가 해결 내용 ✅

1. **사용자 데이터 자동 동기화 구현**

   - Clerk → Supabase users 테이블 자동 저장
   - 온보딩 완료 시 데이터 일관성 확보

2. **AI 뉴스 분석 DB 저장 구현**

   - Claude API 분석 결과 자동 저장
   - 뉴스 상세 페이지에서 AI 해설 표시 가능

3. **크리티컬 버그 식별**
   - 뉴스 카테고리 필터링 문제 발견
   - 온보딩 로딩 화면 개선 필요성 확인

### 현재 프로젝트 상태 (Week 2, Day 14)

- ✅ Week 1: 100% 완료 (프로젝트 셋업 + 기본 인증)
- 🔄 Week 2: 98% 진행 중 (2건 크리티컬 버그 잔존)
- 🔄 Week 3: 20% 진행 중 (경제 순환기 시스템)

### 다음 단계 우선순위

1. **🔴 CRITICAL**: 뉴스 카테고리 필터링 버그 해결
2. **🔶 온보딩 로딩 화면 성능 개선**
3. **경제 순환기 FRED API 연동**

---

_디버깅 담당: AI Assistant_
_최초 문제 해결 일시: 2024년 12월 27일_
_추가 작업 완료 일시: 2024년 12월 27일_
_전체 문제 심각도: 중간 → 해결됨 (사용자 경험 영향)_
