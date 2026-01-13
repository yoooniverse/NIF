# News In Flight - Development TODO List

> 개발 기간: 33일 (2025.12.11 ~ 2026.01.13)
> 현재: 2026.01.08 (Week 4, Day 28) - Week 1-3 완료, 보안 강화 및 성능 최적화 단계 진입
> 진행률: Week 1-3 100% 완료, Week 4 QA 및 최적화 진행 중 (70% 완료)
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

### Day 3-5: AI 뉴스 파이프라인 (F3) 🔄 1차 구현 완료 (최적화 진행 중)

- [x] **Mistral API 연동 (Free Plan)** ✅ **n8n 연동 완료**

  - [x] Google Cloud Console에서 Gemini 2.5 Flash API 설정 ✅ 완료
  - [x] 환경 변수 설정 (`GEMINI_API_KEY`) ✅ 완료
  - [x] API 클라이언트 래퍼 생성 (`lib/gemini.ts`) ✅ 완료
  - [x] 뉴스 분석 프롬프트 작성 ✅ 완료
    - [x] Lv.1 (초보자용) ✅ 완료
    - [x] Lv.2 (일반용) ✅ 완료
    - [x] Lv.3 (전문가용) ✅ 완료

- [x] **뉴스 수집 시스템** ✅ **n8n RSS 노드 연동 완료**

  - [x] n8n RSS 노드로 뉴스 URL 추출 ✅ 완료
  - [x] 뉴스 수집 자동화 워크플로우 구축 ✅ 완료
  - [x] 카테고리별 소스 정의 ✅ 완료
  - [x] `sources` 테이블 초기 데이터 입력 ✅ 완료

- [x] **뉴스 분석 파이프라인** ✅ **AI 해설 DB 저장 완료**

  - [x] Server Action: 뉴스 수집 (`actions/news/ingest-news.ts`) ✅ 완료
  - [x] Server Action: AI 분석 (`actions/news/analyze-news.ts`) ✅ 완료
  - [x] 레벨별 분석 생성 (1개 뉴스 → 3개 레코드) ✅ 완료
  - [x] `news`, `news_analysis_levels` 테이블 저장 로직 ✅ 완료
  - [x] 에러 핸들링 (Gemini API 할당량 초과 등) ✅ 완료

- [ ] **테스트 및 최적화 진행 중**
  - [x] 뉴스 수집 테스트 (1개 뉴스) ✅ 완료
  - [ ] 뉴스 수집 확장 테스트 (50개 뉴스 대량 처리)
  - [ ] AI 분석 품질 검증 (프롬프트 1차 버전)
  - [x] DB 저장 확인 ✅ 완료
  - [ ] 프롬프트 최적화 (2차 버전) - 출시 후 수정 가능

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
  - [x] `app/api/sync-user/route.ts` 생성 및 디버깅 완료
  - [x] Clerk → Supabase `users` 테이블 자동 동기화 ✅ **사용자 데이터 DB 저장 완료**
  - [x] 레벨 정보 필수 필드 추가 (기본값 Lv.1) ✅ **2025.12.28 디버깅 완료**

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
  - [x] 사용자 상황 기반 개인화 (`worst_scenario`) ✅ 2025.12.29 완료
  - [x] 경고 아이콘 및 스타일링
  - [x] 흰색 배경으로 스타일 변경

- [x] **Block 3: 행동 가이드**

  - [x] 컴포넌트: `components/news/action-item.tsx`
  - [x] `user_action_tip` 표시 ✅ 2025.12.29 완료
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
  - [x] **AI 해설 데이터 DB 저장 완료** - Claude API 분석 결과 Supabase DB에 저장됨

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

- [x] **UI/UX 검증** ✅ 디자인 완료

  - [x] 반응형 디자인 (모바일 웹)
  - [x] 로딩 상태
  - [x] 에러 메시지
  - [x] 빈 상태 (Empty State)

- [x] **버그 수정 및 디버깅 완료**
  - [x] 사용자 동기화 API 디버깅 완료 (레벨 정보 누락 문제 해결)
  - [ ] 발견된 버그 목록 작성
  - [ ] 우선순위 분류
  - [ ] 크리티컬 버그 즉시 수정
  - [ ] 상세페이지 약간 수정
  - [ ] 웹사이트 페이지 순서 이상하게 바뀌는 문제 수정
  - [x] **🔴 CRITICAL: 관심분야 카테고리별 뉴스 필터링 버그** ✅ 2025.12.29 완료
  - [x] **🔶 온보딩 로딩 화면 이상 현상** ✅ 2025.12.29 완료

---

## Week 3: 경제 순환기 지도 개발 (Day 15-21: 12/25 ~ 12/31) - 진행 중 (D-19~D-13)

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

- [x] **FRED API 연동** ✅ n8n 워크플로우 완성 (2025.12.28 완료)

- [x] **AI 뉴스 파이프라인 최적화** ✅ **2026.01.07 완료**

  - [x] **🔴 FIX: n8n 뉴스 워크플로우 수정 (긴급)** ✅ 완료
    - [x] '뉴스 데이터 정리2' 노드 루프 처리 수정 (데이터 정상 처리됨) ✅
    - [x] 배치 처리 로직 검증 ✅
    - [x] 웹사이트 뉴스 표시 정상화 확인 ✅
  - [ ] 50개 뉴스 대량 처리 워크플로우 테스트 (다음 단계)
  - [ ] 프롬프트 2차 버전 개발 및 검증 (v3로 이동 가능)
  - [ ] 성능 최적화 (API 호출 효율화) (v3로 이동 가능)
  - [ ] 에러 핸들링 강화 (Gemini API 제한 대응) (v3로 이동 가능)

  - [x] 환경 변수 설정 (`FRED_API_KEY`) ✅ n8n에서 Query Auth credential 적용 완료
  - [x] FRED API 클라이언트 생성 ✅ n8n 워크플로우에서 구현됨
  - [x] 3개 지표 수집 함수 ✅ n8n 워크플로우에서 구현됨
    - [x] 장단기 금리차 (T10Y2Y) ✅ HTTP Request 노드 구현
    - [x] 미국 실업률 (UNRATE) ✅ HTTP Request 노드 구현
    - [x] 원/달러 환율 (DEXKOUS) ✅ HTTP Request 노드 구현

- [x] **신호등 색상 로직** ✅ 완료

  - [x] `lib/cycle/determine-status.ts` 생성 ✅ 완료
  - [x] `determineStatusColor()` 함수 구현 ✅ 완료
    - [x] 점수 계산 로직
    - [x] Red/Yellow/Green 결정
  - [x] 단위 테스트 작성 ✅ 완료

- [x] **뉴스 해설 DB 및 워크플로우 업데이트** ✅ **2026.01.07 완료**

  📋 **완료된 작업**
  ✅ **올바른 순서로 진행 완료**
  1️⃣ **Supabase SQL 실행** ✅

  - 테이블 구조 최종 확정
  - DB 저장 로직 정상 작동 확인

  2️⃣ **환율 뉴스 수집 전략 수립** ✅

  - 관심분야별 RSS 피드 적용 완료
  - 키워드 기반 뉴스 필터링 로직 구현 완료

  3️⃣ **뉴스 해설 n8n 워크플로우 수정** ✅

  - 변경된 테이블에 맞게 수정 완료
  - 루프 처리 버그 수정 완료

  4️⃣ **뉴스 해설 n8n 테스트** ✅

  - 실제로 데이터가 제대로 저장되는지 확인 완료
  - 웹사이트에 뉴스 정상 표시 확인 ✅

  5️⃣ **시스템 정상화** ✅

  - 오늘의 뉴스/이달의 뉴스 페이지 정상 작동
  - 뉴스 상세 페이지 데이터 연동 완료

- [x] **경제순환기 DB 스키마 (cycle_explanations)** ✅ 완료

  - [x] 마이그레이션 파일 생성
  - [x] 테이블 생성
    - [x] `status_color` (Red/Yellow/Green)
    - [x] `summary_text` (AI 작성)
    - [x] `historical_pattern` (AI 작성)
    - [x] `indicators_snapshot` (JSONB)
    - [x] `is_latest` (최신 버전 플래그)
  - [x] 인덱스 생성

- [x] **경제순환기 AI 분석 (Claude API)** ✅ 완료

  - [x] 프롬프트 작성
    - [x] Input: status_color + indicators_snapshot
    - [x] Output: summary_text + historical_pattern
  - [x] Server Action: `actions/cycle/analyze-cycle.ts` (n8n에서 직접 처리로 대체)
  - [x] DB 저장 로직
  - [x] 이전 레코드 `is_latest=false` 업데이트

- [x] **경제순환기 n8n 워크플로우** ✅ 완료 (2026.01.02)

  - [x] n8n 설치 및 설정 ✅ 완료
  - [x] 워크플로우 생성 ✅ 완료
    - [x] Cron Trigger (매일 09:00) ✅ 설정 완료
    - [x] FRED API 호출 ✅ 완료
    - [x] 신호등 색상 계산 ✅ 완료
    - [x] Claude API 호출 ✅ 완료
    - [x] Supabase에 저장 ✅ 완료
  - [x] 에러 핸들링 및 재시도 로직 ✅ 완료
  - [x] 관리자 이메일 알림 (실패 시) ✅ 완료
  - [x] 데이터 페이지 표시 완료 ✅ 완료
  - [x] 경제순환기 특징 보기: 프론트엔드 디자인 수정 완료 (정렬 및 레이더 애니메이션 추가, 계기판 추가) ✅ 2026.01.06 완료
  - [x] 상세페이지 문구 수정 완료 ✅ 2026.01.06 완료
  - [ ] (v3) 분석 프롬프트 고도화 (데이터 품질 향상)

- [x] **경제 순환기 API** ✅ 2026.01.06 완료
  - [x] GET `/api/cycle/current` (최신 데이터) ✅ 2026.01.06 완료
    - [x] `is_latest=true` 조회 ✅ 2026.01.06 완료
    - [x] JSON 응답 ✅ 2026.01.06 완료

### Day 20-21: 개인화 알고리즘

- [ ] **사용자 맞춤 뉴스 추천**

  - [ ] 관심사 + 상황 기반 필터링 강화
  - [ ] 중요도 점수 계산 (`impact_score`)
  - [ ] TOP 5 선정 알고리즘

- [ ] **최악의 시나리오 개인화**

  - [ ] 사용자 상황별 템플릿
  - [ ] Gemini 2.5 Flash 프롬프트 개인화
  - [ ] 컨텍스트별 시나리오 생성

- [x] **경제 순환기 페이지** ✅ 2026.01.06 완료
  - [x] `app/cycle/page.tsx` 생성 ✅ 2026.01.06 완료
  - [x] 좌측: 순환기별 특징 표 (정적 데이터) ✅ 2026.01.06 완료
    - [x] 회복기, 확장기, 둔화기, 침체기 ✅ 2026.01.06 완료
  - [x] 우측: 근거 지표 시각화 ✅ 2026.01.06 완료
    - [x] 신호등 색상 표시 ✅ 2026.01.06 완료
    - [x] 현재 상황 요약 (AI) ✅ 2026.01.06 완료
    - [x] 역사적 패턴/팩트 (AI) ✅ 2026.01.06 완료
    - [x] 근거 지표 숫자 (FRED) ✅ 2026.01.06 완료

---

## Week 4: 구독 시스템 및 QA (Day 22-28: 2026.01/02 ~ 01/08)

### Day 22-23: 토스페이먼츠 결제 시스템 (F6) - **Post-Launch로 연기됨**

- [ ] **토스페이먼츠 결제 시스템** 🔄 **v3: Post-Launch로 이동됨**
  - 프로젝트 발표 이후 필수 기능으로 구현 예정

### Day 24-25: 프로필 설정 기능 ✅ **Boarding Pass에서 이미 구현됨**

- [x] **프로필 설정 통합 (Boarding Pass Modal)**

  - [x] Boarding Pass의 "환경설정" 버튼으로 온보딩 플로우 재진입
  - [x] 관심사/상황/AI 레벨 재설정 가능
  - [x] 별도 설정 페이지 불필요 → UX 최적화

- [ ] **구독 관리 기능 (토스페이먼츠 제외)**
  - [ ] 현재 구독 상태 표시 (무료 체험 남은 기간)
  - [ ] 구독 취소 기능 (토스페이먼츠 제외)

### Day 26-27: 전체 QA 1차 및 보안/최적화 (현재 진행 중)

- [ ] **🔴 보안 강화 (RLS 정책 적용)** - **최우선 작업**

  - [ ] 모든 테이블 RLS(Row Level Security) 정책 활성화
  - [ ] 정책 테스트 (Anon vs Authenticated vs Service Role)
  - [ ] `users` 테이블: 본인 데이터만 접근 가능
  - [ ] `news` 테이블: 공개 읽기 / 관리자 쓰기
  - [ ] `news_analysis_levels` 테이블: 사용자 레벨 기반 접근 제어
  - [ ] `cycle_explanations` 테이블: 공개 읽기
  - [ ] RLS 정책 적용 후 전체 기능 테스트

- [ ] **🔴 Lighthouse 성능 점검 및 최적화** - **최우선 작업**

  - [ ] Lighthouse 점수 측정 및 개선 (목표: 85점 이상)
    - [ ] LCP (Largest Contentful Paint) 최적화
    - [ ] CLS (Cumulative Layout Shift) 최소화
    - [ ] 접근성/SEO 점수 확인
  - [ ] 불필요한 리렌더링 체크
  - [ ] 번들 크기 분석 및 최적화

- [ ] **기능 테스트**

  - [ ] 전체 유저 플로우 테스트
    - [ ] 신규 사용자 온보딩
    - [ ] 일상 뉴스 소비
    - [ ] 유료 전환
  - [ ] API 엔드포인트 전체 테스트
  - [ ] 엣지 케이스 검증 (PRD 7장 참고)
    - [ ] E8: 토스페이먼츠 결제/카드등록 실패 🔄 v3로 이동됨
    - [ ] E9: 결제 중 이탈 🔄 v3로 이동됨
    - [ ] E10: 31일차 정확한 시각 계산
    - [ ] E11: 구독 취소 후 재구독 🔄 v3로 이동됨

- [ ] **보안 검증**

  - [ ] 모든 API에 인증 미들웨어 확인
  - [ ] user_id 필터링 검증
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` 서버 전용 확인
  - [ ] `.env` 파일 GitHub 미포함 확인
  - [ ] `TOSS_PAYMENTS_SECRET_KEY` 서버 전용 확인 🔄 v3로 이동됨

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

### Day 31: 법적 문서 작성 ✅ 완료

- [x] **개인정보 처리방침**

  - [x] 페이지 생성 (`app/privacy/page.tsx`)
  - [x] 내용 작성
    - [x] 수집하는 정보
    - [x] 정보 이용 목적
    - [x] 제3자 제공 (Clerk, 토스페이먼츠) 🔄 토스페이먼츠 v3로 이동됨
    - [x] 정보 보유 기간
    - [x] 사용자 권리

- [x] **이용약관**

  - [x] 페이지 생성 (`app/terms/page.tsx`)
  - [x] 내용 작성
    - [x] 서비스 이용 규칙
    - [x] 구독 및 환불 정책
    - [x] 책임 제한
    - [x] 계약 해지

- [x] **법적 문서 링크**
  - [x] 푸터 컴포넌트 생성
  - [x] 모든 페이지에 푸터 추가
  - [ ] 회원가입 시 동의 체크박스

### Day 32: 최종 버그 수정 및 배포 준비

- [ ] **선택적 개선 작업** (시간이 여유로울 경우)

  - [ ] 랜딩페이지 기능소개 섹션 디자인 개선
    - [ ] 현재 기능 소개 레이아웃 검토
    - [ ] 사용자 피드백 기반 UI/UX 개선
    - [ ] 모바일 반응형 디자인 최적화
    - [ ] 시각적 요소 (아이콘, 이미지) 개선

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
  - [ ] 토스페이먼츠 Webhook 테스트 🔄 v3로 이동됨
  - [ ] 토스페이먼츠 상점 관리자 확인 🔄 v3로 이동됨
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
  - [ ] 토스페이먼츠 상점 관리자 결제 내역 확인 🔄 v3로 이동됨

- [ ] **런칭**
  - [ ] 랜딩 페이지 오픈
  - [ ] 소셜 미디어 공지
  - [ ] 베타 테스터 초대
  - [ ] 피드백 수집 채널 오픈 (Typeform 또는 웹 내 폼)

---

## v3: Post-Launch 기능 (런칭 이후)

### 토스페이먼츠 결제 시스템 (F6)

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
  - [ ] 토스페이먼츠 빌링키 보안 점검 🔄 v3로 이동됨

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
- `app/api/news/[id]/route.ts` - 뉴스 상세 API ✅ **AI 해설 DB 저장 완료 (news_analysis_levels 테이블)**
- `app/api/onboarding/complete/route.ts` - 온보딩 완료 API
- `app/api/sync-user/route.ts` - 사용자 동기화 API ✅ **사용자 데이터 DB 저장 완료 및 디버깅 완료 (users 테이블)**

### ✅ Week 3 완료 (2026.01.07)

- 뉴스 상세 페이지 구현 ✅ **완료**
- 경제 순환기 지도 (FRED API 연동) ✅ **완료**
- AI 뉴스 파이프라인 최적화 ✅ **완료**
  - n8n 워크플로우 버그 수정 완료
  - 뉴스 데이터 정상 DB 저장 확인
  - 웹사이트 뉴스 표시 정상화
- 구독 시스템 구현 🔄 **v3: Post-Launch로 이동**

### 🔄 다음 단계 (Week 4 - 최종 QA, Day 28-33)

#### **오늘부터 시작할 작업들 (1/8 ~ 1/10):**

- [ ] **🔴 Day 28: 보안 강화 (RLS 정책 적용)** - **오늘 즉시 시작**
  - Supabase에서 모든 테이블의 RLS 활성화
  - 각 테이블별 Row Level Security 정책 작성
  - 보안 정책 테스트 및 검증

- [ ] **🔴 Day 29: Lighthouse 성능 최적화** - **내일 시작**
  - 현재 Lighthouse 점수 측정
  - LCP, CLS, FID 등 Core Web Vitals 최적화
  - 번들 크기 분석 및 최적화

- [ ] **Day 30-31: 전체 기능 QA**
  - 신규 사용자 전체 플로우 테스트 (회원가입 → 온보딩 → 뉴스 소비)
  - 기존 사용자 플로우 테스트
  - 모바일 반응형 테스트
  - 크로스 브라우저 테스트

- [ ] **Day 32: 버그 수정 및 최종 준비**
  - QA에서 발견된 버그 수정
  - 코드 정리 (불필요한 로그 제거)
  - 프로덕션 환경 준비

- [ ] **Day 33: 배포 및 런칭** 🚀
  - Vercel 배포
  - 최종 확인 및 런칭

---

## 참고 문서

- PRD: `workplace/docs/PRD.md`
- DB 스키마: `workplace/supabase/migrations/update_setup_newsinflight_schema.sql`
- 개발 가이드: `workplace/AGENTS.md`

---

## ⏰ **시간 분배 추천 (1/8 업데이트)**

### **1/8 (목) ~ 1/10 (토): 보안 + 성능 최적화** 🔴 **오늘부터 시작**

- **1/8 (목)**: 보안 강화 작업
  - Supabase RLS 정책 적용 (전체 테이블)
  - Row Level Security 테스트
  - 보안 취약점 점검

- **1/9 (금)**: 성능 최적화 작업
  - Lighthouse 점수 측정 (현재 상태 파악)
  - Core Web Vitals 개선 (LCP, CLS 최적화)
  - 번들 크기 분석 및 최적화

- **1/10 (토)**: QA 및 버그 수정
  - 전체 유저 플로우 테스트
  - 모바일/데스크톱 반응형 검증
  - 발견된 버그 우선 수정

### **1/11 (일) ~ 1/13 (화): 최종 준비 및 런칭**

- **1/11 (일)**: 최종 QA 및 코드 정리
- **1/12 (월)**: 배포 리허설
- **1/13 (화)**: 프로덕션 배포 및 런칭 🚀

### **현재 우선순위**

1. **🔴 보안 강화 (RLS)** - 프로덕션 필수, 오늘 즉시 시작
2. **🔴 성능 최적화** - 사용자 경험 개선, 내일 시작
3. **기능 QA** - 안정성 확보, 이번 주말 완료
4. **배포 준비** - 최종 단계, 다음 주 초

### **리스크 관리**

- **보안**: RLS 적용 후 전체 기능 재테스트 필수
- **성능**: Lighthouse 85점 이상 목표 (현재 상태 확인 후 조정)
- **시간**: 3일 버퍼 유지 (1/11-13)
