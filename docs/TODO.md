# News In Flight - Development TODO List

> 개발 기간: 33일 (2025.12.11 ~ 2026.01.13)
> 현재: 2025.12.19 (Week 2, Day 2) - In Flight Map 대시보드 및 뉴스 시스템 완성
> 진행률: Week 1 100% 완료, Week 2 80% 진행 중, Week 3 준비 중
> 우선순위: v1 (필수) → v2 (선택) → v3 (Post-Launch)

---

## Week 1: 프로젝트 셋업 및 기본 인증 (Day 1-7: 12/11 ~ 12/17) ✅ 100% 완료

### Day 1-2: 프로젝트 초기 설정

- [x] **프로젝트 구조 설정**

  - [x] Next.js 15.5.7 프로젝트 초기화
  - [x] TypeScript 설정 (`tsconfig.json`)
  - [x] ESLint 설정 (`eslint.config.mjs`)
  - [x] Prettier 설정 (`.prettierrc`, `.prettierignore`)
  - [x] Git 설정 (`.gitignore`, `.cursorignore`)
  - [ ] Husky pre-commit 훅 설정 (`.husky/`)

- [x] **디렉토리 구조 생성**

  - [x] `app/` 디렉토리 (라우팅 전용)
    - [x] `favicon.ico` 파일
    - [ ] `not-found.tsx` 파일
    - [ ] `robots.ts` 파일
    - [ ] `sitemap.ts` 파일
    - [ ] `manifest.ts` 파일
  - [x] `components/` 디렉토리
    - [x] `ui/` (shadcn 컴포넌트)
    - [x] `providers/` (React Context)
  - [x] `lib/` 디렉토리
    - [x] `supabase/` (클라이언트 설정)
    - [x] `utils.ts`
  - [x] `hooks/` 디렉토리
  - [ ] `actions/` 디렉토리 (Server Actions)
  - [ ] `types/` 디렉토리
  - [ ] `constants/` 디렉토리
  - [x] `public/` 디렉토리
    - [x] `icons/` 디렉토리
    - [x] `logo.png` 파일
    - [x] `og-image.png` 파일

- [ ] **환경 설정**

  - [x] `.env.local` 파일 생성 (Git 제외)
  - [x] 환경 변수 문서화

- [x] **Cursor 설정**

  - [x] `.cursor/rules/` 커서룰 설정
  - [x] `.cursor/mcp.json` MCP 서버 설정
  - [x] `.cursor/dir.md` 프로젝트 디렉토리 구조 문서
  - [x] `AGENTS.md` 파일 생성

- [x] **Supabase 설정**

  - [x] Supabase 프로젝트 생성
  - [x] `supabase/` 디렉토리 초기화
  - [x] `supabase/config.toml` 설정
  - [x] `supabase/migrations/` 디렉토리
  - [x] DB 스키마 마이그레이션 실행
    - [x] `users` 테이블
    - [x] `interests` 테이블 (마스터 데이터)
    - [x] `contexts` 테이블 (마스터 데이터)
    - [x] `user_profiles` 테이블
    - [x] `user_interests` 테이블
    - [x] `user_contexts` 테이블
    - [x] `subscriptions` 테이블 (billing_key 컬럼 포함)
    - [x] `sources` 테이블
    - [x] `news` 테이블
    - [x] `news_analysis_levels` 테이블
  - [x] 인덱스 생성
  - [x] Supabase 클라이언트 파일 생성
    - [x] `lib/supabase/clerk-client.ts`
    - [x] `lib/supabase/server.ts`
    - [x] `lib/supabase/service-role.ts`
    - [x] `lib/supabase/client.ts`

- [x] **Clerk 인증 설정**

  - [x] Clerk 프로젝트 생성
  - [x] 환경 변수 설정
  - [x] `middleware.ts` 생성 (인증 라우트 보호)
  - [x] `lib/auth-middleware.ts` 인증 헬퍼 생성
  - [x] `app/layout.tsx`에 ClerkProvider 추가
  - [ ] 소셜 로그인 설정 (구글, 카카오)
  - [x] 한국어 로컬라이제이션 설정

- [x] **UI 라이브러리 설정**
  - [x] Tailwind CSS v4 설정 (`app/globals.css`)
  - [x] shadcn/ui 초기화 (`components.json`)
  - [x] 기본 컴포넌트 설치
    - [x] Button
    - [x] Input
    - [x] Card
    - [x] Badge
    - [x] Toast
    - [x] Dialog
    - [x] Form
    - [x] Label
    - [x] Textarea
    - [x] Accordion

### Day 3-5: AI 뉴스 파이프라인 (F3) - 다음 단계 준비

- [ ] **Claude API 연동**

  - [ ] Anthropic SDK 설치
  - [ ] 환경 변수 설정 (`ANTHROPIC_API_KEY`)
  - [ ] API 클라이언트 래퍼 생성 (`lib/claude.ts`)
  - [ ] 뉴스 분석 프롬프트 작성
    - [ ] Lv.1 (초보자용)
    - [ ] Lv.2 (일반용)
    - [ ] Lv.3 (전문가용)

- [ ] **뉴스 수집 시스템**

  - [ ] RSS/News API 연동
  - [ ] 뉴스 수집 스크립트 작성
  - [ ] 카테고리별 소스 정의
  - [ ] `sources` 테이블 초기 데이터 입력

- [ ] **뉴스 분석 파이프라인**

  - [ ] Server Action: 뉴스 수집 (`actions/news/ingest-news.ts`)
  - [ ] Server Action: AI 분석 (`actions/news/analyze-news.ts`)
  - [ ] 레벨별 분석 생성 (1개 뉴스 → 3개 레코드)
  - [ ] `news`, `news_analysis_levels` 테이블 저장 로직
  - [ ] 에러 핸들링 (Claude API 할당량 초과 등)

- [ ] **테스트**
  - [ ] 뉴스 수집 테스트 (최소 15개/일)
  - [ ] AI 분석 품질 검증
  - [ ] DB 저장 확인

### Day 6-7: 인증 및 온보딩 UI (F1, F2)

- [x] **랜딩 페이지 (P1)**

  - [x] 랜딩 페이지 (`app/page.tsx` - 메인 페이지)
  - [x] Hero 섹션
    - [x] 메인 카피: "경제 뉴스는 정보가 아니라 생존입니다"
    - [x] CTA 버튼: "30일 무료로 시작하기"
  - [x] 기능 소개 섹션
    - [x] 핵심 가치 제안 3가지
    - [x] AI 분석 레벨 소개
    - [x] 경제 순환기 지도 미리보기 (InFlightEarth 컴포넌트 적용)
  - [x] 소셜 프루프 섹션
    - [x] 사용자 후기 (추후 추가)
    - [x] 통계 표시 (사용자 수, 뉴스 분석 수 등)
  - [x] Footer
    - [x] 개인정보 처리방침 링크
    - [x] 이용약관 링크
    - [x] 문의하기
  - [x] 반응형 디자인 (모바일 최적화)

- [x] **인증 페이지 (F1)**

  - [x] 로그인 페이지 (`app/login/[[...sign-in]]/page.tsx`)
  - [x] 회원가입 페이지 (`app/signup/[[...sign-up]]/page.tsx`)
  - [x] Clerk UI 커스터마이징 (공항 체크인 데스크 디자인)
  - [x] 소셜 로그인 (구글, 카카오) - Clerk 기본 제공
  - [x] 로그인/회원가입 후 적절한 페이지로 리다이렉트
    - [x] 신규 사용자: `/onboarding/interests`
    - [x] 기존 사용자: `/dashboard` (온보딩 상태 확인 후 리다이렉트)

- [x] **사용자 동기화**

  - [x] `hooks/use-sync-user.ts` 생성
  - [x] `components/providers/sync-user-provider.tsx` 생성
  - [x] `app/api/sync-user/route.ts` 생성
  - [x] Clerk → Supabase `users` 테이블 자동 동기화

- [x] **온보딩 플로우 (F2)**

  - [x] Step 1: 관심 자산 선택 (`app/onboarding/interests/page.tsx`)
    - [x] 멀티 선택 UI (부동산, 가상화폐, ETF, 주식, 환율)
    - [x] 최소 1개 선택 유효성 검사
    - [x] 로컬 스토리지 임시 저장
    - [x] 진행 상황 표시 (1/3)
  - [x] Step 2: 나의 상황 선택 (`app/onboarding/contexts/page.tsx`)
    - [x] 멀티 선택 UI (대출보유, 예적금만함, 달러보유, 사업가, 직장인, 해외여행)
    - [x] 최소 1개 선택 유효성 검사
    - [x] 로컬 스토리지 임시 저장
    - [x] 진행 상황 표시 (2/3)
  - [x] Step 3: AI 레벨 선택 (`app/onboarding/level/page.tsx`)
    - [x] 라디오 버튼 UI (Lv.1, Lv.2, Lv.3)
    - [x] 각 레벨 설명 표시 (초보자/일반/전문가)
    - [x] 진행 상황 표시 (3/3)
  - [x] 온보딩 완료 처리
    - [x] Clerk 메타데이터에 모든 정보 저장 (userProfiles, interests, contexts, level)
    - [x] 로컬 스토리지 클리어
    - [x] 무료 구독 시작 (30일) - Clerk 메타데이터에 저장
    - [x] 대시보드로 리다이렉트
  - [x] 단계별 네비게이션 (이전/다음 버튼)
  - [x] 반응형 디자인

- [ ] **마스터 데이터 API**
  - [ ] GET `/api/interests` (관심사 목록 - 현재 하드코딩)
  - [ ] GET `/api/contexts` (상황 목록 - 현재 하드코딩)

---

## Week 2: In Flight Map 대시보드 및 뉴스 시스템 (Day 8-14: 12/18 ~ 12/24) - 진행 중

### Day 8-10: In Flight Map 대시보드 (F4)

- [x] **대시보드 레이아웃**

  - [x] **3D GlobeCanvas 배경 시스템**

    - [x] 컴포넌트: `components/dashboard/GlobeCanvas.tsx`
    - [x] Three.js 기반 3D 지구 렌더링
    - [x] 실시간 회전 애니메이션
    - [x] 반투명 오버레이 적용

  - [x] **좌측 사이드바 레이아웃**

    - [x] 유저 정보 + 구독 상태 표시
    - [x] 3개 주요 섹션 버튼 (오늘의 뉴스, 이달의 뉴스, 경제 순환기 지도)
    - [x] 각 버튼: 아이콘 + 제목 + 설명 + 호버 효과

  - [x] **모달 시스템 (경제 순환기 지도용)**
    - [x] 중앙 글래스 모달 디자인
    - [x] 배경 블러 + 검은색 오버레이
    - [x] 경제 지표 데이터 표시

- [x] **"비행기 창문 시스템" (In Flight Map 컨셉으로 변경됨)**

  - [x] CabinWindow 컴포넌트 → GlobeCanvas 컴포넌트로 변경
  - [x] 3D 지구 기반 배경 시스템으로 전환
  - [x] 기존 창문 디자인 폐기 및 새로운 인터랙션 구현

- [x] **"오늘의 뉴스" 섹션 (완전 구현 완료)**

  - [x] 오늘의 뉴스 모음 기능
    - [x] 사용자가 선택한 관심자산의 오늘 뉴스 필터링 (카테고리별 필터링)
    - [x] 뉴스 카드 리스트 형태로 표시
    - [x] 관심사별 카테고리 필터 (부동산, 가상화폐, ETF, 주식, 환율)
  - [x] UI 컴포넌트 구현
    - [x] 오늘의 뉴스 리스트 컴포넌트 (`app/news/today/page.tsx`)
    - [x] 관심사 필터 탭 (Filter 아이콘 + 카테고리 버튼)
    - [x] 뉴스 클릭 시 상세 페이지 이동 (URL 파라미터로 카테고리 전달)

- [x] **"이달의 뉴스" 섹션 (완전 구현 완료)**

  - [x] 월간 뉴스 모음 기능
    - [x] 사용자가 선택한 관심자산의 당월 뉴스 필터링 (카테고리별 필터링)
    - [x] 월별 그룹화 (현재 월 우선 표시 - 12월 뉴스)
    - [x] 뉴스 카드 리스트 형태로 표시
    - [x] 관심사별 카테고리 필터 (부동산, 가상화폐, ETF, 주식, 환율)
  - [x] UI 컴포넌트 구현
    - [x] 월간 뉴스 리스트 컴포넌트 (`app/news/monthly/page.tsx`)
    - [x] 관심사 필터 탭 (Filter 아이콘 + 카테고리 버튼)
    - [x] 페이지네이션 (현재 기본 구현, 추후 확장 가능)
    - [x] 뉴스 클릭 시 상세 페이지 이동 (URL 파라미터로 카테고리 전달)

- [x] **대시보드 페이지 (In Flight Map 컨셉 완성)**

  - [x] `app/dashboard/page.tsx` 완성 (3D 지구 배경 + 사이드바 레이아웃)
  - [x] 3개 주요 섹션: 오늘의 뉴스, 이달의 뉴스, 경제 순환기 지도
  - [x] 뉴스 섹션 클릭 시 개별 페이지 이동 (/news/today, /news/monthly)
  - [x] 경제 순환기 지도는 모달로 표시
  - [x] 반응형 디자인 + 인터랙션 로그 시스템

- [x] **뉴스 카드 스타일링 개선**

  - [x] 오늘의 뉴스 페이지 뉴스 카드 흰색으로 변경
  - [x] 이달의 뉴스 페이지 뉴스 카드 흰색으로 변경
  - [x] NewsCard 컴포넌트 `fromPage` prop 추가 (페이지 구분용)

- [x] **뉴스 API**

  - [x] GET `/api/news` (뉴스 목록)
    - [x] Query: user_id, date, category, limit
    - [x] 사용자 맞춤 필터링 (관심사 기반)
    - [x] 페이지네이션
  - [x] GET `/api/news/monthly` (월간 뉴스)
    - [x] Query: user_id, month, interests
    - [x] 관심사 기반 월간 뉴스 필터링
    - [x] 정렬: 최신순

### Day 11-13: 뉴스 상세 (F5) ✅ 완전 구현 완료

- [x] **뉴스 상세 페이지**

  - [x] `app/news/[id]/page.tsx` 생성
  - [x] 동적 라우트 파라미터 처리 (Next.js 15)
  - [x] URL 파라미터 기반 동적 제목 변경 (카테고리별)
    - [x] "오늘의 뉴스" → "{카테고리} 뉴스" (주식 뉴스, 가상화폐 뉴스 등)
    - [x] URL 파라미터 처리 (`from`, `category`)

- [x] **Block 1: AI 뉴스 해설**

  - [x] 컴포넌트: `components/news/news-summary.tsx`
  - [x] 쉬운 제목 (`easy_title`)
  - [x] 요약 (`summary`, 10줄 이내)
  - [x] 읽기 편한 레이아웃
  - [x] 흰색 배경으로 스타일 변경

- [x] **Block 2: 최악의 시나리오**

  - [x] 컴포넌트: `components/news/worst-scenario.tsx`
  - [ ] 사용자 상황 기반 개인화 (`worst_scenario`)
  - [x] 경고 아이콘 및 스타일링
  - [x] 흰색 배경으로 스타일 변경

- [x] **Block 3: 행동 가이드**

  - [x] 컴포넌트: `components/news/action-item.tsx`
  - [ ] `user_action_tip` 표시
  - [x] 조건부 블러 처리
    - [x] 무료 체험 중(30일): 전체 공개
    - [x] 31일차 이후: 블러 + Paywall 클릭
  - [x] 흰색 배경으로 스타일 변경

- [x] **Block 4: 뉴스 제목 카드**

  - [x] 뉴스 제목 표시 영역
  - [x] 출처 정보 표시
  - [x] 흰색 배경으로 스타일 변경

- [x] **출처 및 원문 링크**

  - [x] 컴포넌트: `components/news/news-footer.tsx`
  - [x] 출처 표시
  - [x] 원문 링크 버튼
  - [x] 흰색 배경으로 스타일 변경

- [x] **Mock 데이터 완성**

  - [x] 뉴스 리스트의 모든 뉴스(1-6번)에 대한 상세 데이터 추가
  - [x] 카테고리 이름 통일 (주식, 가상화폐, 환율, ETF, 부동산)
  - [x] 뉴스 제목 및 분석 내용 각 카테고리에 맞게 업데이트

- [x] **뉴스 상세 API**

  - [x] GET `/api/news/[id]` (뉴스 상세)
    - [x] 사용자 레벨 기반 분석 필터링
    - [x] 구독 상태 확인 (`should_blur` 계산)
    - [ ] 원문 404 에러 핸들링

- [x] **Paywall 컴포넌트**
  - [x] 컴포넌트: `components/paywall/blur-overlay.tsx`
  - [x] 블러 효과
  - [x] "구독하고 전체 보기" CTA
  - [x] Paywall 페이지 이동

### Day 14: v1 중간 테스트

- [x] **기능 테스트**

  - [x] 회원가입 → 온보딩 → 대시보드 플로우
  - [x] 뉴스 목록 → 상세 플로우
  - [x] 관심사별 필터링
  - [x] AI 레벨별 분석 표시

- [ ] **UI/UX 검증**

  - [x] 반응형 디자인 (모바일 웹)
  - [ ] 로딩 상태
  - [ ] 에러 메시지
  - [ ] 빈 상태 (Empty State)

- [ ] **버그 수정**
  - [ ] 발견된 버그 목록 작성
  - [ ] 우선순위 분류
  - [ ] 크리티컬 버그 즉시 수정

---

## Week 3: v1 완성 및 v2 시작 (Day 15-21: 12/25 ~ 12/31) - 다음 우선순위

### Day 15-16: v1 통합 테스트 및 버그 수정

- [ ] **통합 테스트**

  - [ ] Playwright E2E 테스트 작성
    - [ ] 회원가입 플로우
    - [ ] 온보딩 플로우
    - [ ] 뉴스 목록 조회
    - [ ] 뉴스 상세 조회
  - [ ] API 테스트
  - [ ] 데이터베이스 무결성 검증

- [ ] **버그 수정**

  - [ ] Week 2 테스트에서 발견된 버그 수정
  - [ ] 엣지 케이스 처리
    - [ ] E3: 온보딩 중도 이탈
    - [ ] E4: 뉴스 분석 미완료
    - [ ] E5: 관심사 뉴스 0건
    - [ ] E6: 네트워크 오류
    - [ ] E12: 관심사 선택 안 함
  - [ ] 에러 로깅 (Sentry 설정)

- [ ] **성능 최적화**
  - [ ] 이미지 최적화 (Next.js Image)
  - [ ] 코드 스플리팅
  - [ ] React Query 캐싱 전략

### Day 17-19: 경제 순환기 지도 (F7 - v2)

- [ ] **FRED API 연동**

  - [ ] 환경 변수 설정 (`FRED_API_KEY`)
  - [ ] FRED API 클라이언트 생성 (`lib/fred.ts`)
  - [ ] 3개 지표 수집 함수
    - [ ] 장단기 금리차 (T10Y2Y)
    - [ ] 미국 실업률 (UNRATE)
    - [ ] 원/달러 환율 (DEXKOUS)

- [ ] **신호등 색상 로직**

  - [ ] `lib/cycle/determine-status.ts` 생성
  - [ ] `determineStatusColor()` 함수 구현
    - [ ] 점수 계산 로직
    - [ ] Red/Yellow/Green 결정
  - [ ] 단위 테스트 작성

- [ ] **DB 스키마 (cycle_explanations)**

  - [ ] 마이그레이션 파일 생성
  - [ ] 테이블 생성
    - [ ] `status_color` (Red/Yellow/Green)
    - [ ] `summary_text` (AI 작성)
    - [ ] `historical_pattern` (AI 작성)
    - [ ] `indicators_snapshot` (JSONB)
    - [ ] `is_latest` (최신 버전 플래그)
  - [ ] 인덱스 생성

- [ ] **AI 분석 (Claude API)**

  - [ ] 프롬프트 작성
    - [ ] Input: status_color + indicators_snapshot
    - [ ] Output: summary_text + historical_pattern
  - [ ] Server Action: `actions/cycle/analyze-cycle.ts`
  - [ ] DB 저장 로직
  - [ ] 이전 레코드 `is_latest=false` 업데이트

- [ ] **n8n 워크플로우**

  - [ ] n8n 설치 및 설정
  - [ ] 워크플로우 생성
    - [ ] Cron Trigger (매일 09:00)
    - [ ] FRED API 호출
    - [ ] 신호등 색상 계산
    - [ ] Claude API 호출
    - [ ] Supabase에 저장
  - [ ] 에러 핸들링 및 재시도 로직
  - [ ] 관리자 이메일 알림 (실패 시)

- [ ] **경제 순환기 API**
  - [ ] GET `/api/cycle/current` (최신 데이터)
    - [ ] `is_latest=true` 조회
    - [ ] JSON 응답

### Day 20-21: 개인화 알고리즘

- [ ] **사용자 맞춤 뉴스 추천**

  - [ ] 관심사 + 상황 기반 필터링 강화
  - [ ] 중요도 점수 계산 (`impact_score`)
  - [ ] TOP 5 선정 알고리즘

- [ ] **최악의 시나리오 개인화**

  - [ ] 사용자 상황별 템플릿
  - [ ] Claude 프롬프트 개인화
  - [ ] 컨텍스트별 시나리오 생성

- [ ] **경제 순환기 페이지**
  - [ ] `app/cycle/page.tsx` 생성
  - [ ] 좌측: 순환기별 특징 표 (정적 데이터)
    - [ ] 회복기, 확장기, 둔화기, 침체기
  - [ ] 우측: 근거 지표 시각화
    - [ ] 신호등 색상 표시
    - [ ] 현재 상황 요약 (AI)
    - [ ] 역사적 패턴/팩트 (AI)
    - [ ] 근거 지표 숫자 (FRED)
  - [ ] 차트 라이브러리 (Recharts 또는 Chart.js)

---

## Week 4: 구독 시스템 및 QA (Day 22-28: 2026.01/01 ~ 01/07)

### Day 22-23: 토스페이먼츠 결제 시스템 (F6)

- [ ] **토스페이먼츠 설정**

  - [ ] 토스페이먼츠 계정 생성
  - [ ] 환경 변수 설정
    - [ ] `TOSS_PAYMENTS_CLIENT_KEY` (클라이언트용)
    - [ ] `TOSS_PAYMENTS_SECRET_KEY` (서버용)
  - [ ] 토스페이먼츠 SDK 설치

- [ ] **구독 상품 설정**

  - [ ] 토스페이먼츠 상점 관리자에서 상품 설정
    - [ ] 월 9,900원 (정가)
    - [ ] 월 5,900원 (얼리버드)

- [ ] **카드 자동결제(Billing) 플로우**

  - [ ] API: `app/api/subscription/register-card/route.ts`
    - [ ] 빌링키(Billing Key) 발급 요청
    - [ ] `subscriptions` 테이블에 `billing_key` 저장
    - [ ] 첫 결제 실행 (선택)
  - [ ] Paywall 페이지 (`app/paywall/page.tsx`)
    - [ ] "체험 비행이 종료되었습니다" 메시지
    - [ ] 요금제 소개
    - [ ] "구독하기" CTA (토스페이먼츠 결제창 연결)

- [ ] **Webhook 처리**

  - [ ] API: `app/api/webhooks/toss/route.ts`
    - [ ] 이벤트 검증 (Webhook Secret)
    - [ ] 결제 성공 이벤트 처리
      - [ ] `subscriptions` 테이블 업데이트
      - [ ] plan='premium', active=true 설정
    - [ ] 결제 실패 이벤트 처리
      - [ ] 에러 로그 기록
      - [ ] 사용자 알림 (선택)

- [ ] **구독 상태 확인**

  - [ ] API: `app/api/subscription/status/route.ts`
    - [ ] 사용자의 현재 구독 정보 조회
    - [ ] 남은 날짜 계산
  - [ ] 미들웨어 또는 Hook으로 Paywall 체크
    - [ ] 31일차 이후 자동 차단

- [ ] **월간 자동 결제 로직**

  - [ ] Vercel Cron Jobs 설정
  - [ ] API: `app/api/cron/charge-subscriptions/route.ts`
    - [ ] 매월 갱신일에 실행
    - [ ] 저장된 빌링키로 결제 API 호출
    - [ ] 성공 시 `ends_at` 업데이트 (+30일)
    - [ ] 실패 시 재시도 로직 또는 사용자 알림

- [ ] **구독 만료 처리**
  - [ ] API: `app/api/cron/expire-subscriptions/route.ts`
    - [ ] 매일 00:00 실행
    - [ ] `ends_at < NOW()` 조건으로 `active=false` 업데이트

### Day 24-25: 프로필 설정 페이지

- [ ] **설정 페이지**

  - [ ] `app/settings/page.tsx` 생성
  - [ ] 레이아웃 (탭 또는 섹션)

- [ ] **관심사/상황 수정**

  - [ ] 현재 선택된 항목 표시
  - [ ] 멀티 선택 UI
  - [ ] API: `app/api/user/update-interests/route.ts`
  - [ ] API: `app/api/user/update-contexts/route.ts`

- [ ] **AI 레벨 변경**

  - [ ] 현재 레벨 표시
  - [ ] 라디오 버튼 (Lv.1/2/3)
  - [ ] API: `app/api/user/update-level/route.ts`

- [ ] **구독 관리**
  - [ ] 현재 구독 상태 표시
  - [ ] 결제 수단 관리 (토스페이먼츠 빌링키 관리)
  - [ ] 구독 취소 버튼
  - [ ] API: `app/api/subscription/cancel/route.ts`

### Day 26-27: 전체 QA 1차

- [ ] **기능 테스트**

  - [ ] 전체 유저 플로우 테스트
    - [ ] 신규 사용자 온보딩
    - [ ] 일상 뉴스 소비
    - [ ] 유료 전환
  - [ ] API 엔드포인트 전체 테스트
  - [ ] 엣지 케이스 검증 (PRD 7장 참고)
    - [ ] E8: 토스페이먼츠 결제/카드등록 실패
    - [ ] E9: 결제 중 이탈
    - [ ] E10: 31일차 정확한 시각 계산
    - [ ] E11: 구독 취소 후 재구독

- [ ] **보안 검증**

  - [ ] 모든 API에 인증 미들웨어 확인
  - [ ] user_id 필터링 검증
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` 서버 전용 확인
  - [ ] `.env` 파일 GitHub 미포함 확인
  - [ ] `TOSS_PAYMENTS_SECRET_KEY` 서버 전용 확인

- [ ] **성능 테스트**
  - [ ] Lighthouse 점수 측정
  - [ ] Core Web Vitals 확인
  - [ ] 대용량 뉴스 목록 로딩 속도

### Day 28: 성능 최적화

- [ ] **프론트엔드 최적화**

  - [ ] 번들 크기 분석
  - [ ] Dynamic Import 적용
  - [ ] 이미지 lazy loading
  - [ ] 폰트 최적화

- [ ] **백엔드 최적화**

  - [ ] 쿼리 최적화 (인덱스 확인)
  - [ ] API 응답 캐싱
  - [ ] DB 연결 풀 설정

- [ ] **모니터링 설정**
  - [ ] Sentry 에러 트래킹
  - [ ] Vercel Analytics
  - [ ] PostHog 이벤트 수집

---

## Week 5: 최종 준비 및 런칭 (Day 29-33: 01/08 ~ 01/13)

### Day 29-30: 전체 QA 2차

- [ ] **크로스 브라우저 테스트**

  - [ ] Chrome 테스트
  - [ ] Safari 테스트
  - [ ] Firefox 테스트
  - [ ] Edge 테스트

- [ ] **모바일 웹 테스트**

  - [ ] iOS Safari
  - [ ] Android Chrome
  - [ ] 반응형 레이아웃 검증
  - [ ] 터치 인터랙션 확인

- [ ] **접근성 검증**
  - [ ] 키보드 네비게이션
  - [ ] 스크린 리더 호환성
  - [ ] ARIA 속성 확인
  - [ ] 색상 대비 검증

### Day 31: 법적 문서 작성

- [ ] **개인정보 처리방침**

  - [ ] 페이지 생성 (`app/privacy/page.tsx`)
  - [ ] 내용 작성
    - [ ] 수집하는 정보
    - [ ] 정보 이용 목적
    - [ ] 제3자 제공 (Clerk, 토스페이먼츠)
    - [ ] 정보 보유 기간
    - [ ] 사용자 권리

- [ ] **이용약관**

  - [ ] 페이지 생성 (`app/terms/page.tsx`)
  - [ ] 내용 작성
    - [ ] 서비스 이용 규칙
    - [ ] 구독 및 환불 정책
    - [ ] 책임 제한
    - [ ] 계약 해지

- [ ] **법적 문서 링크**
  - [ ] 푸터 컴포넌트 생성
  - [ ] 모든 페이지에 푸터 추가
  - [ ] 회원가입 시 동의 체크박스

### Day 32: 최종 버그 수정 및 배포 준비

- [ ] **최종 버그 수정**

  - [ ] QA에서 발견된 모든 버그 수정
  - [ ] 코드 리뷰
  - [ ] 불필요한 콘솔 로그 제거

- [ ] **배포 준비**

  - [ ] 프로덕션 환경 변수 설정
  - [ ] Vercel 프로젝트 설정
  - [ ] 도메인 연결
  - [ ] SSL 인증서 확인

- [ ] **최종 체크리스트 (PRD 11장)**
  - [ ] 모든 API 엔드포인트 테스트 완료
  - [ ] 모든 API에 인증 미들웨어 적용 확인
  - [ ] API별 user_id 검증
  - [ ] Paywall 로직 동작 확인
  - [ ] 토스페이먼츠 Webhook 테스트
  - [ ] 토스페이먼츠 상점 관리자 확인
  - [ ] 모바일 반응형 100%
  - [ ] 크로스 브라우저 테스트
  - [ ] Lighthouse 점수 80+
  - [ ] 개인정보 처리방침 작성
  - [ ] 이용약관 작성
  - [ ] DB 백업 설정
  - [ ] 환경 변수 보안 확인
  - [ ] `.env` 파일 GitHub 미포함 확인

### Day 33: 프로덕션 배포 및 런칭 🚀

- [ ] **배포**

  - [ ] Vercel에 배포
  - [ ] 프로덕션 환경 테스트
  - [ ] DNS 전파 확인
  - [ ] 실제 결제 테스트 (소액)

- [ ] **모니터링 확인**

  - [ ] Sentry 에러 트래킹 작동 확인
  - [ ] PostHog 이벤트 수집 확인
  - [ ] Vercel Analytics 작동 확인
  - [ ] FRED API 호출 성공률 모니터링
  - [ ] n8n 워크플로우 실행 로그 확인
  - [ ] 토스페이먼츠 상점 관리자 결제 내역 확인

- [ ] **런칭**
  - [ ] 랜딩 페이지 오픈
  - [ ] 소셜 미디어 공지
  - [ ] 베타 테스터 초대
  - [ ] 피드백 수집 채널 오픈 (Typeform 또는 웹 내 폼)

---

## v3: Post-Launch 기능 (런칭 이후)

### 자동화 고도화

- [ ] **n8n 워크플로우 개선**
  - [ ] 뉴스 수집 자동화
  - [ ] AI 분석 자동화
  - [ ] 이메일 알림 자동화
  - [ ] 구독 만료 알림 자동화

### CMS 어드민 대시보드

- [ ] **어드민 페이지**
  - [ ] `app/admin/page.tsx` 생성
  - [ ] 관리자 권한 체크
  - [ ] 뉴스 큐레이션 UI
  - [ ] AI 분석 수동 수정 (`admin_edits` 테이블)
  - [ ] 사용자 통계 대시보드
  - [ ] 구독 관리 (빌링키, 결제 내역)

### 알림 시스템

- [ ] **웹 푸시 알림**

  - [ ] Service Worker 설정
  - [ ] 푸시 알림 권한 요청
  - [ ] 새 뉴스 알림
  - [ ] 구독 만료 알림

- [ ] **이메일 알림**
  - [ ] 이메일 서비스 연동 (SendGrid 또는 Resend)
  - [ ] 뉴스 다이제스트 이메일
  - [ ] 구독 만료 알림 이메일
  - [ ] 결제 실패 알림 이메일

### 소셜 공유 기능

- [ ] **공유 버튼**

  - [ ] 카카오톡 공유
  - [ ] 페이스북 공유
  - [ ] 트위터 공유
  - [ ] 링크 복사

- [ ] **OG 메타 태그**
  - [ ] 뉴스 상세 페이지 OG 이미지 생성
  - [ ] 동적 메타 데이터

### PWA 변환

- [ ] **PWA 설정**
  - [ ] `manifest.json` 설정
  - [ ] Service Worker 등록
  - [ ] 홈 화면 추가 가능
  - [ ] 오프라인 지원 (선택)

### 추가 기능

- [ ] **뉴스 북마크**

  - [ ] `bookmarks` 테이블 생성
  - [ ] 북마크 추가/삭제 API
  - [ ] 내 북마크 페이지

- [ ] **뉴스 검색**

  - [ ] 검색 UI
  - [ ] Full-text search (Supabase)
  - [ ] 검색 결과 페이지

- [ ] **사용자 피드백**
  - [ ] 뉴스 평가 (유용함/유용하지 않음)
  - [ ] 피드백 수집 및 분석
  - [ ] AI 프롬프트 개선

---

## 지속적인 작업

### 콘텐츠 운영

- [ ] 매일 뉴스 큐레이션 (AI + 수동)
- [ ] 주간 트렌드 분석
- [ ] 사용자 피드백 반영

### 마케팅

- [ ] SEO 최적화
- [ ] 블로그 포스팅
- [ ] 소셜 미디어 마케팅
- [ ] 인플루언서 협업

### 데이터 분석

- [ ] 사용자 행동 분석 (PostHog)
- [ ] 전환율 최적화
- [ ] A/B 테스트
- [ ] Churn Rate 모니터링

### 보안 및 유지보수

- [ ] 정기 보안 점검
- [ ] 라이브러리 업데이트
- [ ] 성능 모니터링
- [ ] DB 백업 확인
- [ ] 토스페이먼츠 빌링키 보안 점검

---

## 현재 구현된 주요 컴포넌트

### ✅ 완료된 컴포넌트

- `app/dashboard/page.tsx` - Korean Air 스타일 대시보드
- `components/dashboard/GlobeCanvas.tsx` - 3D 지구 기반 배경 시스템
- `components/dashboard/NewsCard.tsx` - 뉴스 카드 컴포넌트
- `components/landing/` - 랜딩 페이지 컴포넌트들 (InFlightEarth 등)
- `components/news/` - 뉴스 상세 페이지 컴포넌트들
- `lib/auth-middleware.ts` - 인증 헬퍼 미들웨어

### ✅ 완료된 API

- `app/api/news/route.ts` - 뉴스 목록 API
- `app/api/news/[id]/route.ts` - 뉴스 상세 API
- `app/api/onboarding/complete/route.ts` - 온보딩 완료 API

### 🔄 다음 단계 (Week 3)

- AI 뉴스 파이프라인 구축
- 뉴스 상세 페이지 구현
- 경제 순환기 지도 (FRED API 연동)

---

## 참고 문서

- PRD: `workplace/docs/PRD.md`
- DB 스키마: `workplace/supabase/migrations/update_setup_newsinflight_schema.sql`
- 개발 가이드: `workplace/AGENTS.md`
