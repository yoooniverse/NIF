# News In Flight - 유저 플로우

## 1. 신규 사용자 온보딩 플로우

```mermaid
graph TD
    Start([사용자 랜딩 페이지 방문]) --> CTA[30일 무료 시작 버튼 클릭]
    CTA --> AuthChoice{인증 방식 선택}

    AuthChoice -->|소셜 로그인| Social[구글/카카오 OAuth]
    AuthChoice -->|이메일| Email[이메일 + 비밀번호]

    Social --> ClerkAuth[Clerk 인증 처리]
    Email --> ClerkAuth

    ClerkAuth --> DBUser[(users 테이블 생성<br/>clerk_id, email)]

    DBUser --> Step1[온보딩 Step 1:<br/>관심 자산 선택]
    Step1 --> Interest[부동산/가상화폐/ETF/주식/환율<br/>멀티 선택]
    Interest --> DBInterest[(user_interests 저장<br/>N:M 관계)]

    DBInterest --> Step2[온보딩 Step 2:<br/>나의 상황 선택]
    Step2 --> Context[대출보유/예적금/달러보유/사업가/직장인/해외여행<br/>멀티 선택]
    Context --> DBContext[(user_contexts 저장<br/>N:M 관계)]

    DBContext --> Step3[온보딩 Step 3:<br/>AI 레벨 선택]
    Step3 --> Level[Lv.1 초보자<br/>Lv.2 일반<br/>Lv.3 전문가]
    Level --> DBProfile[(user_profiles 저장<br/>level, onboarded_at)]

    DBProfile --> FreeSub[(subscriptions 생성<br/>plan=free<br/>ends_at=now+30일<br/>active=true)]

    FreeSub --> Dashboard[메인 대시보드 리다이렉트]
```

## 2. 기존 사용자 로그인 플로우

```mermaid
graph TD
    Start([로그인 페이지]) --> LoginForm[이메일/비밀번호 입력<br/>또는 소셜 로그인]
    LoginForm --> ClerkAuth[Clerk 인증]

    ClerkAuth --> Success{인증 성공?}
    Success -->|실패| Error[에러 메시지 표시]
    Error --> LoginForm

    Success -->|성공| CheckOnboard{온보딩 완료<br/>확인}
    CheckOnboard -->|onboarded_at NULL| Onboarding[온보딩 프로세스 시작]
    CheckOnboard -->|onboarded_at 존재| Dashboard[메인 대시보드]
```

## 3. 일상 뉴스 소비 플로우

```mermaid
graph TD
    Start([사용자 웹사이트 접속]) --> Dashboard[메인 대시보드]

    Dashboard --> Section1[이달의 뉴스 섹션]
    Dashboard --> Section2[오늘의 뉴스 섹션]
    Dashboard --> Section3[경제 순환기 지도]

    Section2 --> Click[오늘의 뉴스 클릭]
    Click --> Query[(GET /api/news<br/>user_id, date, category)]

    Query --> NewsList[관심분야별 TOP 5 목록<br/>제목 + 날짜 표시]

    NewsList --> SelectNews[뉴스 제목 클릭]
    SelectNews --> DetailQuery[(GET /api/news/id<br/>user_id 포함)]

    DetailQuery --> Detail[뉴스 상세 페이지]

    Detail --> Block1[Block 1: AI 뉴스 해설<br/>레벨별 분석 표시]
    Block1 --> Block2[Block 2: 최악의 시나리오<br/>사용자 상황 기반 개인화]
    Block2 --> CheckSub{구독 상태 확인}

    CheckSub -->|active=true<br/>무료 체험 중| Block3Full[Block 3: 행동 가이드<br/>전체 공개]
    CheckSub -->|active=false<br/>31일 경과| Block3Blur[Block 3: 행동 가이드<br/>블러 처리]

    Block3Full --> Source[출처 및 원문 링크]
    Block3Blur --> BlurClick{블러 영역 클릭}

    BlurClick --> Paywall[Paywall 페이지로 이동]
```

## 4. 유료 전환 플로우

```mermaid
graph TD
    Start([31일차 접속]) --> StatusCheck[(GET /api/subscription/status<br/>user_id)]

    StatusCheck --> Expired{active=false<br/>만료됨?}

    Expired -->|Yes| Popup[팝업: 체험 비행 종료]
    Popup --> PaywallPage[Paywall 페이지]

    PaywallPage --> CTA[월 5,900원 구독하기 버튼]
    CTA --> CheckoutAPI[(POST /api/subscription/checkout<br/>user_id, plan=premium)]

    CheckoutAPI --> StripeURL[Stripe Checkout URL 반환]
    StripeURL --> StripeUI[Stripe 결제 UI]

    StripeUI --> Payment{결제 성공?}

    Payment -->|실패| Error[에러 메시지<br/>다른 결제 수단 시도]
    Error --> StripeUI

    Payment -->|성공| Webhook[Stripe Webhook<br/>POST /api/webhooks/stripe]

    Webhook --> UpdateDB[(subscriptions 업데이트<br/>plan=premium<br/>active=true<br/>stripe_subscription_id 저장)]

    UpdateDB --> Success[구독 완료 메시지]
    Success --> Dashboard[메인 대시보드]

    Dashboard --> FullAccess[모든 뉴스 Block 3<br/>전체 접근 가능]
```

## 5. 경제 순환기 지도 플로우 (v2)

```mermaid
graph TD
    Start([메인 대시보드]) --> CycleWidget[경제 순환기 지도 위젯 클릭]

    CycleWidget --> CyclePage[경제 순환기 상세 페이지<br/>/cycle]

    CyclePage --> APICall[(GET /api/cycle/current)]

    APICall --> LeftPanel[좌측 패널:<br/>순환기별 특징 표]
    APICall --> RightPanel[우측 패널:<br/>근거 지표 시각화]

    LeftPanel --> Static[회복기/확장기/둔화기/침체기<br/>정적 데이터 표시]

    RightPanel --> TrafficLight[신호등 색상 표시<br/>Red/Yellow/Green]
    TrafficLight --> Color{색상 의미}

    Color -->|Red| Risk[위험: 경기 침체 신호]
    Color -->|Yellow| Warning[주의: 불확실성 증가]
    Color -->|Green| Safe[양호: 경기 안정]

    RightPanel --> Summary[현재 상황 요약<br/>AI 생성 텍스트]
    RightPanel --> Historical[역사적 패턴/팩트<br/>AI 생성 텍스트]
    RightPanel --> Indicators[근거 지표 숫자]

    Indicators --> Yield[장단기 금리차<br/>FRED:T10Y2Y]
    Indicators --> Unemployment[미국 실업률<br/>FRED:UNRATE]
    Indicators --> Exchange[원/달러 환율<br/>FRED:DEXKOUS]
```

## 6. 프로필 설정 플로우

```mermaid
graph TD
    Start([메인 대시보드]) --> Profile[프로필 아이콘 클릭]

    Profile --> Settings[프로필 설정 페이지<br/>/settings]

    Settings --> Tab1[관심사 수정 탭]
    Settings --> Tab2[상황 수정 탭]
    Settings --> Tab3[AI 레벨 변경 탭]
    Settings --> Tab4[구독 관리 탭]

    Tab1 --> EditInterest[관심 자산 체크박스 수정]
    EditInterest --> SaveInterest[(user_interests 삭제 후 재생성<br/>DELETE + INSERT)]
    SaveInterest --> Success1[저장 완료 토스트]

    Tab2 --> EditContext[나의 상황 체크박스 수정]
    EditContext --> SaveContext[(user_contexts 삭제 후 재생성<br/>DELETE + INSERT)]
    SaveContext --> Success2[저장 완료 토스트]

    Tab3 --> EditLevel[AI 레벨 라디오 버튼 선택]
    EditLevel --> SaveLevel[(user_profiles.level 업데이트<br/>UPDATE)]
    SaveLevel --> Success3[저장 완료 토스트]

    Tab4 --> SubInfo[현재 구독 정보 표시<br/>plan, ends_at, days_remaining]
    SubInfo --> ManageButton{구독 상태}

    ManageButton -->|active=false| Upgrade[업그레이드 버튼]
    ManageButton -->|active=true<br/>plan=premium| Cancel[구독 취소 버튼]

    Upgrade --> StripeCheckout[Stripe Checkout 이동]
    Cancel --> StripePortal[Stripe Customer Portal]
```

## 7. AI 뉴스 파이프라인 (백그라운드)

```mermaid
graph TD
    Start([n8n Cron Job<br/>매일 06:00 실행]) --> RSS[RSS/News API 호출]

    RSS --> Collect[뉴스 수집<br/>최소 50개]

    Collect --> Filter[필터링:<br/>경제/금융 관련 뉴스만]

    Filter --> SaveRaw[(news 테이블 저장<br/>title, url, content, published_at)]

    SaveRaw --> SelectTop[카테고리별 Top 3 선정<br/>총 15개]

    SelectTop --> Loop{각 뉴스에 대해}

    Loop --> ClaudeL1[Claude API 호출<br/>Lv.1 분석 생성]
    ClaudeL1 --> SaveL1[(news_analysis_levels 저장<br/>level=1)]

    SaveL1 --> ClaudeL2[Claude API 호출<br/>Lv.2 분석 생성]
    ClaudeL2 --> SaveL2[(news_analysis_levels 저장<br/>level=2)]

    SaveL2 --> ClaudeL3[Claude API 호출<br/>Lv.3 분석 생성]
    ClaudeL3 --> SaveL3[(news_analysis_levels 저장<br/>level=3)]

    SaveL3 --> Next{다음 뉴스?}
    Next -->|있음| Loop
    Next -->|없음| Complete[파이프라인 완료]

    Complete --> Metadata[(news.metadata 업데이트<br/>is_curated=true)]
```

## 8. 경제 순환기 자동 업데이트 (백그라운드 - v2)

```mermaid
graph TD
    Start([n8n Cron Job<br/>매일 09:00 실행]) --> FRED[FRED API 호출]

    FRED --> Yield[장단기 금리차 수집<br/>FRED:T10Y2Y]
    FRED --> Unemp[미국 실업률 수집<br/>FRED:UNRATE]
    FRED --> FX[원/달러 환율 수집<br/>FRED:DEXKOUS]

    Yield --> Snapshot[indicators_snapshot JSON 생성]
    Unemp --> Snapshot
    FX --> Snapshot

    Snapshot --> Calculate[규칙 기반 신호등 색상 계산<br/>determineStatusColor 함수]

    Calculate --> Score{위험 점수}
    Score -->|5점 이상| Red[status_color = Red]
    Score -->|3-4점| Yellow[status_color = Yellow]
    Score -->|2점 이하| Green[status_color = Green]

    Red --> ClaudeAPI[Claude API 호출]
    Yellow --> ClaudeAPI
    Green --> ClaudeAPI

    ClaudeAPI --> Prompt[프롬프트:<br/>현재 신호등은 X입니다<br/>지표를 보고 요약 및 패턴 설명]

    Prompt --> AIResponse[AI 응답:<br/>summary_text<br/>historical_pattern]

    AIResponse --> SaveDB[(cycle_explanations 저장<br/>status_color<br/>summary_text<br/>historical_pattern<br/>indicators_snapshot)]

    SaveDB --> Complete[업데이트 완료<br/>로그 기록]
```

## 9. 엣지 케이스: 온보딩 중도 이탈

```mermaid
graph TD
    Start([사용자 온보딩 시작]) --> Step1Done{Step 1 완료?}

    Step1Done -->|Yes| DBInterest[(user_interests 저장)]
    Step1Done -->|No| Exit1[브라우저 종료]

    DBInterest --> Step2Done{Step 2 완료?}
    Step2Done -->|Yes| DBContext[(user_contexts 저장)]
    Step2Done -->|No| Exit2[브라우저 종료]

    DBContext --> Step3Done{Step 3 완료?}
    Step3Done -->|Yes| DBProfile[(user_profiles 저장<br/>onboarded_at=now)]
    Step3Done -->|No| Exit3[브라우저 종료]

    Exit1 --> NextVisit1[다음 방문]
    Exit2 --> NextVisit2[다음 방문]
    Exit3 --> NextVisit3[다음 방문]

    NextVisit1 --> Check1{onboarded_at<br/>존재?}
    NextVisit2 --> Check2{onboarded_at<br/>존재?}
    NextVisit3 --> Check3{onboarded_at<br/>존재?}

    Check1 -->|NULL| Resume1[온보딩 Step 1부터 재시작]
    Check2 -->|NULL| Resume2[온보딩 Step 2부터 재시작]
    Check3 -->|NULL| Resume3[온보딩 Step 3부터 재시작]

    DBProfile --> FreeSub[(subscriptions 생성)]
    FreeSub --> Dashboard[대시보드]
```

## 10. 엣지 케이스: 뉴스 분석 미완료

```mermaid
graph TD
    Start([사용자 뉴스 상세 접근]) --> Query[(GET /api/news/id)]

    Query --> CheckAnalysis{news_analysis_levels<br/>존재?}

    CheckAnalysis -->|존재함| ShowFull[전체 콘텐츠 표시]
    CheckAnalysis -->|없음| ShowPartial[뉴스 제목 + 원문만 표시]

    ShowPartial --> Message[분석 중입니다 메시지<br/>5분 후 자동 새로고침]

    Message --> Wait[5분 타이머 시작]
    Wait --> AutoRefresh[페이지 자동 새로고침]

    AutoRefresh --> Query
```

## 11. 엣지 케이스: Stripe 결제 실패

```mermaid
graph TD
    Start([Stripe Checkout]) --> CardInput[카드 정보 입력]

    CardInput --> Submit[결제 제출]

    Submit --> Validate{Stripe 검증}

    Validate -->|카드 거부| Error1[에러: 카드가 거부되었습니다]
    Validate -->|잔액 부족| Error2[에러: 잔액이 부족합니다]
    Validate -->|네트워크 오류| Error3[에러: 일시적 오류입니다]

    Error1 --> Retry[다른 결제 수단 시도 버튼]
    Error2 --> Retry
    Error3 --> Retry

    Retry --> CardInput

    Validate -->|성공| Webhook[Stripe Webhook 전송]
    Webhook --> UpdateDB[(subscriptions 업데이트)]
    UpdateDB --> Success[결제 완료]
```

## 12. 엣지 케이스: 구독 만료 처리

```mermaid
graph TD
    Start([Cron Job<br/>매일 00:00]) --> Query[(SELECT * FROM subscriptions<br/>WHERE ends_at < NOW<br/>AND active = true)]

    Query --> Expired{만료된 구독<br/>존재?}

    Expired -->|없음| End[종료]
    Expired -->|있음| Update[(UPDATE subscriptions<br/>SET active = false<br/>WHERE ends_at < NOW)]

    Update --> Log[로그 기록:<br/>user_id 목록]

    Log --> NextLogin[다음 로그인 시]
    NextLogin --> Check[(GET /api/subscription/status)]

    Check --> Show{active?}
    Show -->|false| Paywall[Paywall 자동 표시]
    Show -->|true| Dashboard[대시보드 정상 접근]
```

---

## 데이터베이스 상호작용 요약

### 읽기 작업 (SELECT)

- `GET /api/news`: news + news_analysis_levels JOIN
- `GET /api/news/[id]`: news + news_analysis_levels + user_profiles
- `GET /api/subscription/status`: subscriptions
- `GET /api/cycle/current`: cycle_explanations (is_latest=true)
- `GET /api/interests`: interests (is_active=true)
- `GET /api/contexts`: contexts (is_active=true)

### 쓰기 작업 (INSERT/UPDATE/DELETE)

- 온보딩 완료: INSERT user_profiles, user_interests, user_contexts, subscriptions
- 프로필 수정: UPDATE user_profiles, DELETE+INSERT user_interests/contexts
- 구독 업그레이드: UPDATE subscriptions
- AI 파이프라인: INSERT news, news_analysis_levels
- 경제 순환기 업데이트: INSERT cycle_explanations

---

## API 인증 플로우

```mermaid
graph TD
    Start([클라이언트 요청]) --> Header{Authorization<br/>헤더 존재?}

    Header -->|없음| 401[401 Unauthorized]
    Header -->|있음| Clerk[Clerk.getAuth 호출]

    Clerk --> Valid{유효한 토큰?}

    Valid -->|무효| 401
    Valid -->|유효| ExtractUser[user_id 추출]

    ExtractUser --> CheckOwner{본인 데이터<br/>접근?}

    CheckOwner -->|타인 데이터| 403[403 Forbidden<br/>+ 로그 기록]
    CheckOwner -->|본인 데이터| Allow[요청 처리]

    Allow --> Response[200 OK + 데이터]
```
