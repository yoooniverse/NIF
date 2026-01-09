# 카테고리 필터링 버그 수정

**작성일**: 2025-01-10  
**상태**: ✅ 해결 완료

## 📋 문제 상황

### 증상

- 오늘의 뉴스/이달의 뉴스에서 카테고리 필터가 제대로 작동하지 않음
- **주식** 카테고리 선택 시 → 환율, ETF, 부동산 뉴스가 함께 표시됨
- 모든 카테고리에서 동일한 문제 발생

### 사용자 피드백

> "주식 버튼 누르면 주식 표시가 된 뉴스만 모아져서 보여야하는데 환율 ETF도 섞여있어."

---

## 🔍 원인 분석

### 1단계: 초기 가설

처음에는 API 호출 시 카테고리 파라미터를 전달하지 않는 것으로 추정했으나, 로그 확인 결과 파라미터는 정상 전달됨.

### 2단계: 데이터 구조 확인

디버깅 로그를 추가하여 실제 데이터를 확인:

```
[API][NEWS_MONTHLY] Sample news:
  [0] "환율 급등, 내 지갑 괜찮을까?"
      category: 주식  ❌ 잘못됨!
      tags: ["환율","주식","부동산"]
      originalTags: ["환율","주식","부동산"]
  [1] "금리 인상, 우리 생활에 어떤 영향 줄까?"
      category: 주식
      tags: ["주식","부동산","환율"]
  [2] "미국 공장이 잘 안 돌아간대요..."
      tags: ["환율","주식","부동산","ETF","가상화폐"]  ❌ 5개 태그!
```

**핵심 발견**:

1. 하나의 뉴스에 **여러 카테고리 태그**가 할당됨 (최대 5개)
2. "환율 급등" 뉴스가 `category: "주식"`으로 잘못 표시됨

### 3단계: 코드 분석 - 치명적인 버그 발견

기존 API 코드 (`app/api/news/monthly/route.ts`, `app/api/news/route.ts`):

```typescript
// ❌ 잘못된 로직
const requestedCategoryName = categoryParam
  ? SLUG_TO_KOREAN[categoryParam] || categoryParam
  : null;
let primaryCategory = "";

if (requestedCategoryName && displayableTags.includes(requestedCategoryName)) {
  primaryCategory = requestedCategoryName; // 🔴 요청한 카테고리로 강제 변경!
} else {
  primaryCategory = displayableTags[0] || "일반";
}
```

**버그 메커니즘**:

1. 사용자가 "주식" 선택
2. "환율 급등" 뉴스의 태그: `["환율","주식","부동산"]`
3. 태그에 "주식"이 포함됨 → `primaryCategory = "주식"`으로 강제 변경
4. 모든 뉴스의 category가 요청한 카테고리로 바뀜
5. 필터링이 무의미해짐 (모든 뉴스가 통과)

```typescript
// ❌ 기존 필터링 로직도 문제
filteredNews = allProcessedNews.filter((item: any) => {
  return item.originalTags.some((tag: string) => filterValues.includes(tag));
});
// originalTags 중 하나라도 일치하면 통과 → 너무 느슨한 필터
```

---

## ✅ 해결 방법

### 핵심 전략

**뉴스의 첫 번째 태그를 "주요 카테고리"로 고정하고, 주요 카테고리가 정확히 일치하는 뉴스만 필터링**

### 변경 사항

#### 1. 대표 카테고리 설정 로직 수정

**파일**: `app/api/news/monthly/route.ts`, `app/api/news/route.ts`

```typescript
// ✅ 수정 후: 항상 첫 번째 태그를 주요 카테고리로 사용
const displayableTags = originalTags.filter((tag) =>
  allowedTagNames.includes(tag),
);
const primaryCategory = displayableTags[0] || "일반"; // 첫 번째 태그 고정
const finalTags =
  displayableTags.length > 0 ? displayableTags : [primaryCategory];
```

**변경 이유**:

- DB에 저장된 태그 순서는 n8n AI가 중요도 순으로 정렬함
- 첫 번째 태그 = 해당 뉴스의 주요 카테고리
- 사용자 선택과 무관하게 뉴스의 본질적인 카테고리 유지

#### 2. 필터링 로직 수정

```typescript
// ✅ 수정 후: 주요 카테고리가 정확히 일치하는 것만
if (shouldFilter && filterValues.length > 0) {
  filteredNews = allProcessedNews.filter((item: any) => {
    return filterValues.includes(item.category); // category(주요 카테고리)로 필터링
  });
}
```

**변경 이유**:

- 보조 태그가 아닌, 주요 카테고리만으로 판단
- 엄격한 필터링으로 카테고리 순수성 유지

#### 3. 프론트엔드 최적화

**파일**: `app/news/today/page.tsx`, `app/news/monthly/page.tsx`

- API 호출 시 선택된 카테고리를 쿼리 파라미터로 전달
- 카테고리 변경 시 자동으로 API 재호출
- 클라이언트 측 불필요한 필터링 제거 (API가 이미 필터링된 데이터 반환)

```typescript
const categoryParam =
  selectedCategory !== "all" ? `&category=${selectedCategory}` : "";
const apiUrl = `/api/news/monthly?limit=30${categoryParam}`;

useEffect(() => {
  loadNews();
}, [isLoaded, user, selectedCategory]); // selectedCategory 의존성 추가
```

---

## 📊 결과

### Before (버그 상태)

```
주식 선택 시:
- "환율 급등, 내 지갑 괜찮을까?" ✗ 환율 뉴스가 표시됨
- "금리 인상, 우리 생활에..." ✓ 주식 뉴스
- "미국 공장이 잘 안 돌아간대요..." ✗ 환율/부동산 뉴스 혼재
총 44개 (너무 많음)
```

### After (수정 후)

```
주식 선택 시:
- "금리 인상, 우리 생활에..." ✓ 주요 카테고리: 주식
- "AI 반도체 공급망 재편..." ✓ 주요 카테고리: 주식
- "글로벌 공급망 재구성..." ✓ 주요 카테고리: 주식
총 15개 (순수 주식 뉴스만)
```

### 로그 예시

```
[API][NEWS_MONTHLY] Before filtering:
  Total: 63
  Filter values: ["주식"]
  Sample news:
    [0] "환율 급등, 내 지갑 괜찮을까?"
        PRIMARY category: 환율  ✅ 올바른 카테고리
        all tags: ["환율","주식","부동산"]
    [1] "금리 인상, 우리 생활에..."
        PRIMARY category: 주식  ✅
        all tags: ["주식","부동산","환율"]

[API][NEWS_MONTHLY] After filtering:
  beforeCount: 63
  afterCount: 15  ✅ 순수 주식 뉴스만
  filterValues: ["주식"]
```

---

## 💡 Insight: 백엔드 개선 제안

### 현재 상황 분석

#### 문제점

1. **뉴스당 여러 카테고리 할당** (평균 3개, 최대 5개)

   - "환율 급등" → `["환율","주식","부동산"]`
   - "미국 공장" → `["환율","주식","부동산","ETF","가상화폐"]`

2. **카테고리 간 경계 모호**

   - 환율 뉴스가 주식에도 영향 → 양쪽 태그
   - 글로벌 경제 뉴스 → 모든 카테고리 태그
   - 사용자가 명확한 분류를 기대하지만 실제는 혼재

3. **현재 임시 해결책의 한계**
   - 첫 번째 태그만 사용 = 나머지 태그 정보 손실
   - 사용자가 "주식"을 선택했을 때 주식에 **영향을 주는** 환율 뉴스는 보지 못함

### 백엔드(n8n) 개선 제안

#### 옵션 1: 단일 주요 카테고리 + 관련 태그 분리 (권장) ⭐

**DB 스키마 변경**:

```sql
ALTER TABLE news_analysis_levels
ADD COLUMN primary_category TEXT,      -- 단일 주요 카테고리
ADD COLUMN related_categories TEXT[],  -- 관련 카테고리 (보조)
ADD COLUMN impact_level TEXT[];        -- 각 관련 카테고리의 영향도
```

**n8n AI 프롬프트 예시**:

```
당신은 경제 뉴스를 분석하는 전문가입니다.

1. PRIMARY CATEGORY (필수, 단 하나만):
   이 뉴스의 가장 핵심적인 카테고리를 선택하세요.
   - 주식
   - 환율
   - 부동산
   - ETF
   - 가상화폐

2. RELATED CATEGORIES (선택, 최대 2개):
   이 뉴스가 직접적으로 영향을 주는 다른 카테고리가 있다면 선택하세요.
   각 카테고리의 영향도를 평가하세요: HIGH, MEDIUM, LOW

예시:
뉴스: "미국 금리 인상으로 원/달러 환율 급등"
- primary_category: "환율"
- related_categories: ["주식"]
- impact_level: ["MEDIUM"]

응답 형식 (JSON):
{
  "primary_category": "환율",
  "related_categories": ["주식"],
  "impact_level": ["MEDIUM"]
}
```

**프론트엔드 활용**:

```typescript
// 주식 선택 시
if (selectedCategory === "stock") {
  // 1. 주식이 주요 카테고리인 뉴스 (우선 표시)
  const primaryNews = news.filter((n) => n.primary_category === "주식");

  // 2. 주식에 HIGH 영향을 주는 다른 카테고리 뉴스 (선택적 표시)
  const relatedNews = news.filter(
    (n) =>
      n.related_categories?.includes("주식") &&
      n.impact_level[n.related_categories.indexOf("주식")] === "HIGH",
  );

  // UI에 구분해서 표시
  return (
    <>
      <Section title="주식 뉴스">
        {primaryNews.map((n) => (
          <NewsCard primary />
        ))}
      </Section>
      <Section title="주식에 영향을 주는 뉴스" collapsed>
        {relatedNews.map((n) => (
          <NewsCard secondary />
        ))}
      </Section>
    </>
  );
}
```

**장점**:

- ✅ 명확한 카테고리 분류 유지
- ✅ 관련성 있는 뉴스도 제공 (정보 손실 없음)
- ✅ 사용자가 원하는 만큼 상세한 정보 제공
- ✅ UI에서 우선순위 구분 가능

#### 옵션 2: AI에게 단일 카테고리만 요청 (단순)

**n8n AI 프롬프트 변경**:

```
당신은 경제 뉴스를 분류하는 전문가입니다.

이 뉴스를 단 하나의 카테고리로 분류하세요.
여러 분야에 영향을 주더라도, 가장 핵심적인 카테고리 하나만 선택하세요.

카테고리 선택 기준:
- 주식: 주가, 기업 실적, 증시 동향이 주요 내용
- 환율: 환율 변동이 메인 주제
- 부동산: 부동산 가격, 정책, 시장이 핵심
- ETF: ETF 상품, 자산배분 전략이 주요 내용
- 가상화폐: 비트코인, 암호화폐가 주요 주제

응답: 하나의 카테고리만 반환
```

**장점**:

- ✅ 구현 간단 (프롬프트만 수정)
- ✅ 명확한 분류
- ✅ 현재 프론트엔드와 호환

**단점**:

- ❌ 관련성 있는 정보 손실
- ❌ 복합적인 뉴스 분류 어려움

#### 옵션 3: 우선순위 기반 다중 카테고리 유지

**n8n AI 프롬프트 개선**:

```
카테고리를 최대 3개까지 선택할 수 있지만, 반드시 중요도 순으로 정렬하세요.

응답 예시:
["주식", "환율", "부동산"]  ✅ 주식이 가장 중요
["환율"]                    ✅ 환율만 관련
```

**프론트엔드**:

```typescript
// 첫 번째 태그로 필터링 (현재 방식 유지)
filteredNews = news.filter((n) => n.tags[0] === selectedCategory);
```

**장점**:

- ✅ 최소한의 백엔드 변경
- ✅ 현재 프론트엔드 로직 유지

**단점**:

- ⚠️ AI가 순서를 일관성 있게 정렬하는지 검증 필요

### 추천 순서

1. **단기 (1주)**: 옵션 3 - n8n 프롬프트만 개선
2. **중기 (1개월)**: 옵션 1 - DB 스키마 + 프롬프트 + UI 고도화
3. **장기**: 사용자 행동 분석 후 카테고리 체계 재설계

### 측정 지표

개선 후 다음 지표를 모니터링:

- 카테고리별 뉴스 개수 분포 (균등한지)
- 사용자의 카테고리 전환율 (너무 자주 바꾸면 분류가 애매한 것)
- 뉴스 클릭률 (제목과 카테고리가 일치하는지)

---

## 📁 수정된 파일

### API

- `app/api/news/route.ts` - 오늘의 뉴스 API
- `app/api/news/monthly/route.ts` - 이달의 뉴스 API

### 프론트엔드

- `app/news/today/page.tsx` - 오늘의 뉴스 페이지
- `app/news/monthly/page.tsx` - 이달의 뉴스 페이지

### 변경 요약

- ✅ 대표 카테고리 강제 변경 버그 수정
- ✅ 필터링 로직을 originalTags → category 기반으로 변경
- ✅ API 호출 시 카테고리 파라미터 전달
- ✅ 디버깅 로그 추가 (추후 제거 가능)

---

## 🧪 테스트 시나리오

### 테스트 1: 주식 카테고리

1. 이달의 뉴스 페이지 접속
2. "주식" 카테고리 선택
3. **예상**: 주식 관련 뉴스만 표시
4. **확인**: "환율", "부동산" 뉴스 없음

### 테스트 2: 전체 카테고리

1. "전체" 카테고리 선택
2. **예상**: 사용자가 관심 등록한 모든 카테고리 뉴스 표시
3. **확인**: 각 뉴스의 카테고리 표시 정확

### 테스트 3: 카테고리 전환

1. "주식" → "환율" → "ETF" 순서로 전환
2. **예상**: 각 카테고리 선택 시 즉시 필터링
3. **확인**: 뒤로가기 시 URL 파라미터로 상태 유지

---

## 📌 결론

### 해결 완료 사항

- ✅ 카테고리 필터링 정상 작동
- ✅ 각 카테고리별 순수한 뉴스만 표시
- ✅ 프론트엔드 임시 해결로 즉시 사용 가능

### 향후 개선 과제

- 🔄 n8n AI 프롬프트 개선으로 근본적 해결
- 🔄 관련 뉴스 추천 기능 추가 검토
- 🔄 카테고리 체계 개선 (데이터 분석 기반)

### 교훈

1. **디버깅 로그의 중요성**: 실제 데이터를 보기 전까지 문제 원인을 파악하기 어려움
2. **API 로직 검증**: 단순해 보이는 로직도 숨은 버그가 있을 수 있음
3. **데이터 구조 이해**: DB에 저장된 데이터의 실제 구조를 먼저 파악해야 함
4. **백엔드-프론트엔드 연계**: 프롬프트 엔지니어링이 UX에 직접적인 영향을 미침
