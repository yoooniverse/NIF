-- ============================================
-- 개발용: 전체 데이터베이스 초기화
-- ============================================
DROP TABLE IF EXISTS "admin_edits" CASCADE;
DROP TABLE IF EXISTS "news_analysis_levels" CASCADE;
DROP TABLE IF EXISTS "subscriptions" CASCADE;
DROP TABLE IF EXISTS "user_interests" CASCADE;
DROP TABLE IF EXISTS "user_profiles" CASCADE;
DROP TABLE IF EXISTS "user_contexts" CASCADE;
DROP TABLE IF EXISTS "news" CASCADE;
DROP TABLE IF EXISTS "sources" CASCADE;
DROP TABLE IF EXISTS "contexts" CASCADE;
DROP TABLE IF EXISTS "interests" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- ============================================
-- 테이블 생성
-- ============================================

CREATE TABLE "users" (
	"id"	UUID		DEFAULT gen_random_uuid()	NOT NULL,
	"clerk_id"	text		NOT NULL,
	"email"	text		NOT NULL,
	"created_at"	timestamp	DEFAULT now()	NOT NULL,
	CONSTRAINT "PK_USERS" PRIMARY KEY ("id"),
	CONSTRAINT "UQ_USERS_CLERK_ID" UNIQUE ("clerk_id"),
	CONSTRAINT "UQ_USERS_EMAIL" UNIQUE ("email")
);

CREATE TABLE "interests" (
	"id"	UUID		DEFAULT gen_random_uuid()	NOT NULL,
	"name"	text		NOT NULL,
	"slug"	text		NOT NULL,
	"description"	text		NOT NULL,
	"is_active"	boolean		NOT NULL,
	"created_at"	timestamp	DEFAULT now()	NOT NULL,
	CONSTRAINT "PK_INTERESTS" PRIMARY KEY ("id"),
	CONSTRAINT "UQ_INTERESTS_SLUG" UNIQUE ("slug")
);

CREATE TABLE "contexts" (
	"id"	UUID		DEFAULT gen_random_uuid()	NOT NULL,
	"name"	text		NOT NULL,
	"slug"	text		NOT NULL,
	"description"	text		NOT NULL,
	"is_active"	boolean		NOT NULL,
	"created_at"	timestamp	DEFAULT now()	NOT NULL,
	CONSTRAINT "PK_CONTEXTS" PRIMARY KEY ("id"),
	CONSTRAINT "UQ_CONTEXTS_SLUG" UNIQUE ("slug")
);

CREATE TABLE "sources" (
	"id"	UUID		DEFAULT gen_random_uuid()	NOT NULL,
	"source_id"	text		NOT NULL,
	"rss_url"	text		NOT NULL,
	"homepage_url"	text		NOT NULL,
	"last_ingested_at"	timestamp	DEFAULT now()	NOT NULL,
	"created_at"	timestamp	DEFAULT now()	NOT NULL,
	CONSTRAINT "PK_SOURCES" PRIMARY KEY ("id"),
	CONSTRAINT "UQ_SOURCES_SOURCE_ID" UNIQUE ("source_id"),
	CONSTRAINT "UQ_SOURCES_RSS_URL" UNIQUE ("rss_url")
);

CREATE TABLE "news" (
	"id"	UUID		DEFAULT gen_random_uuid()	NOT NULL,
	"source_id"	UUID		NOT NULL,
	"title"	text		NOT NULL,
	"url"	text		NOT NULL,
	"content"	text		NOT NULL,
	"published_at"	timestamp		NOT NULL,
	"ingested_at"	timestamp	DEFAULT now()	NOT NULL,
	"metadata"	jsonb		NOT NULL,
	CONSTRAINT "PK_NEWS" PRIMARY KEY ("id"),
	CONSTRAINT "UQ_NEWS_URL" UNIQUE ("url")
);

CREATE TABLE "user_profiles" (
	"id"	UUID		DEFAULT gen_random_uuid()	NOT NULL,
	"user_id"	UUID		NOT NULL,
	"level"	integer		NOT NULL,
	"onboarded_at"	timestamp	DEFAULT now()	NOT NULL,
	CONSTRAINT "PK_USER_PROFILES" PRIMARY KEY ("id"),
	CONSTRAINT "UQ_USER_PROFILES_USER_ID" UNIQUE ("user_id"),
	CONSTRAINT "CHK_USER_PROFILES_LEVEL" CHECK ("level" BETWEEN 1 AND 3)
);

CREATE TABLE "user_contexts" (
	"id"	UUID		DEFAULT gen_random_uuid()	NOT NULL,
	"user_id"	UUID		NOT NULL,
	"context_id"	UUID		NOT NULL,
	"created_at"	timestamp	DEFAULT now()	NOT NULL,
	CONSTRAINT "PK_USER_CONTEXTS" PRIMARY KEY ("id"),
	CONSTRAINT "UQ_USER_CONTEXTS_USER_CONTEXT" UNIQUE ("user_id", "context_id")
);

CREATE TABLE "user_interests" (
	"id"	UUID		DEFAULT gen_random_uuid()	NOT NULL,
	"user_id"	UUID		NOT NULL,
	"interest_id"	UUID		NOT NULL,
	"created_at"	timestamp	DEFAULT now()	NOT NULL,
	CONSTRAINT "PK_USER_INTERESTS" PRIMARY KEY ("id"),
	CONSTRAINT "UQ_USER_INTERESTS_USER_INTEREST" UNIQUE ("user_id", "interest_id")
);

CREATE TABLE "subscriptions" (
	"id"	UUID		DEFAULT gen_random_uuid()	NOT NULL,
	"user_id"	UUID		NOT NULL,
	"plan"	text		NOT NULL,
	"started_at"	timestamp	DEFAULT now()	NOT NULL,
	"ends_at"	timestamp		NOT NULL,
	"active"	boolean		DEFAULT false	NOT NULL,
	CONSTRAINT "PK_SUBSCRIPTIONS" PRIMARY KEY ("id"),
	CONSTRAINT "CHK_SUBSCRIPTIONS_DATES" CHECK ("ends_at" > "started_at")
);

CREATE TABLE "news_analysis_levels" (
	"id"	UUID		DEFAULT gen_random_uuid()	NOT NULL,
	"news_id"	UUID		NOT NULL,
	"level"	integer		NOT NULL,
	"easy_title"	text		NOT NULL,
	"summary"	text		NOT NULL,
	"worst_scenario"	text		NOT NULL,
	"user_action_tip"	text		NOT NULL,
	"action_blurred"	boolean		DEFAULT true	NOT NULL,
	"created_at"	timestamp	DEFAULT now()	NOT NULL,
	CONSTRAINT "PK_NEWS_ANALYSIS_LEVELS" PRIMARY KEY ("id"),
	CONSTRAINT "UQ_NEWS_ANALYSIS_LEVELS_NEWS_LEVEL" UNIQUE ("news_id", "level"),
	CONSTRAINT "CHK_NEWS_ANALYSIS_LEVELS_LEVEL" CHECK ("level" BETWEEN 1 AND 3)
);

CREATE TABLE "admin_edits" (
	"id"	UUID		DEFAULT gen_random_uuid()	NOT NULL,
	"analysis_level_id"	UUID		NOT NULL,
	"admin_id"	UUID		NOT NULL,
	"note"	text		NULL,
	"edited_at"	timestamp	DEFAULT now()	NOT NULL,
	CONSTRAINT "PK_ADMIN_EDITS" PRIMARY KEY ("id")
);

-- ============================================
-- 외래키 제약조건 (CASCADE 설정)
-- ============================================

-- news.source_id → sources.id (뉴스가 삭제되면 분석도 삭제됨, 소스는 보존)
ALTER TABLE "news" ADD CONSTRAINT "FK_sources_TO_news" 
FOREIGN KEY ("source_id") REFERENCES "sources" ("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- user_contexts (사용자 삭제시 연결도 삭제, 컨텍스트 삭제시 연결도 삭제)
ALTER TABLE "user_contexts" ADD CONSTRAINT "FK_users_TO_user_contexts" 
FOREIGN KEY ("user_id") REFERENCES "users" ("id") 
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_contexts" ADD CONSTRAINT "FK_contexts_TO_user_contexts" 
FOREIGN KEY ("context_id") REFERENCES "contexts" ("id") 
ON DELETE CASCADE ON UPDATE CASCADE;

-- user_interests (사용자 삭제시 연결도 삭제, 관심사 삭제시 연결도 삭제)
ALTER TABLE "user_interests" ADD CONSTRAINT "FK_users_TO_user_interests" 
FOREIGN KEY ("user_id") REFERENCES "users" ("id") 
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_interests" ADD CONSTRAINT "FK_interests_TO_user_interests" 
FOREIGN KEY ("interest_id") REFERENCES "interests" ("id") 
ON DELETE CASCADE ON UPDATE CASCADE;

-- user_profiles (사용자 삭제시 프로필도 삭제)
ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_users_TO_user_profiles" 
FOREIGN KEY ("user_id") REFERENCES "users" ("id") 
ON DELETE CASCADE ON UPDATE CASCADE;

-- subscriptions (사용자 삭제시 구독 정보도 삭제)
ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_users_TO_subscriptions" 
FOREIGN KEY ("user_id") REFERENCES "users" ("id") 
ON DELETE CASCADE ON UPDATE CASCADE;

-- news_analysis_levels (뉴스 삭제시 분석도 삭제)
ALTER TABLE "news_analysis_levels" ADD CONSTRAINT "FK_news_TO_news_analysis_levels" 
FOREIGN KEY ("news_id") REFERENCES "news" ("id") 
ON DELETE CASCADE ON UPDATE CASCADE;

-- admin_edits (분석 레벨 삭제시 편집 기록도 삭제, 관리자는 보존)
ALTER TABLE "admin_edits" ADD CONSTRAINT "FK_news_analysis_levels_TO_admin_edits" 
FOREIGN KEY ("analysis_level_id") REFERENCES "news_analysis_levels" ("id") 
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "admin_edits" ADD CONSTRAINT "FK_users_TO_admin_edits" 
FOREIGN KEY ("admin_id") REFERENCES "users" ("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================
-- 인덱스 생성 (성능 최적화)
-- ============================================

-- users 테이블
CREATE INDEX "IDX_USERS_CLERK_ID" ON "users" ("clerk_id");
CREATE INDEX "IDX_USERS_EMAIL" ON "users" ("email");
CREATE INDEX "IDX_USERS_CREATED_AT" ON "users" ("created_at");

-- interests 테이블
CREATE INDEX "IDX_INTERESTS_SLUG" ON "interests" ("slug");
CREATE INDEX "IDX_INTERESTS_IS_ACTIVE" ON "interests" ("is_active");

-- contexts 테이블
CREATE INDEX "IDX_CONTEXTS_SLUG" ON "contexts" ("slug");
CREATE INDEX "IDX_CONTEXTS_IS_ACTIVE" ON "contexts" ("is_active");

-- sources 테이블
CREATE INDEX "IDX_SOURCES_SOURCE_ID" ON "sources" ("source_id");
CREATE INDEX "IDX_SOURCES_LAST_INGESTED_AT" ON "sources" ("last_ingested_at");

-- news 테이블
CREATE INDEX "IDX_NEWS_SOURCE_ID" ON "news" ("source_id");
CREATE INDEX "IDX_NEWS_PUBLISHED_AT" ON "news" ("published_at");
CREATE INDEX "IDX_NEWS_INGESTED_AT" ON "news" ("ingested_at");
CREATE INDEX "IDX_NEWS_URL" ON "news" ("url");

-- user_profiles 테이블
CREATE INDEX "IDX_USER_PROFILES_USER_ID" ON "user_profiles" ("user_id");
CREATE INDEX "IDX_USER_PROFILES_LEVEL" ON "user_profiles" ("level");

-- user_contexts 테이블
CREATE INDEX "IDX_USER_CONTEXTS_USER_ID" ON "user_contexts" ("user_id");
CREATE INDEX "IDX_USER_CONTEXTS_CONTEXT_ID" ON "user_contexts" ("context_id");

-- user_interests 테이블
CREATE INDEX "IDX_USER_INTERESTS_USER_ID" ON "user_interests" ("user_id");
CREATE INDEX "IDX_USER_INTERESTS_INTEREST_ID" ON "user_interests" ("interest_id");

-- subscriptions 테이블
CREATE INDEX "IDX_SUBSCRIPTIONS_USER_ID" ON "subscriptions" ("user_id");
CREATE INDEX "IDX_SUBSCRIPTIONS_ACTIVE" ON "subscriptions" ("active");
CREATE INDEX "IDX_SUBSCRIPTIONS_ENDS_AT" ON "subscriptions" ("ends_at");

-- news_analysis_levels 테이블
CREATE INDEX "IDX_NEWS_ANALYSIS_LEVELS_NEWS_ID" ON "news_analysis_levels" ("news_id");
CREATE INDEX "IDX_NEWS_ANALYSIS_LEVELS_LEVEL" ON "news_analysis_levels" ("level");
CREATE INDEX "IDX_NEWS_ANALYSIS_LEVELS_CREATED_AT" ON "news_analysis_levels" ("created_at");

-- admin_edits 테이블
CREATE INDEX "IDX_ADMIN_EDITS_ANALYSIS_LEVEL_ID" ON "admin_edits" ("analysis_level_id");
CREATE INDEX "IDX_ADMIN_EDITS_ADMIN_ID" ON "admin_edits" ("admin_id");
CREATE INDEX "IDX_ADMIN_EDITS_EDITED_AT" ON "admin_edits" ("edited_at");

-- ============================================
-- 테이블 및 컬럼 코멘트
-- ============================================

COMMENT ON TABLE "users" IS '사용자 기본 정보';
COMMENT ON TABLE "interests" IS '사용자가 선택 가능한 관심사 목록';
COMMENT ON TABLE "contexts" IS '사용자가 선택 가능한 컨텍스트 목록';
COMMENT ON TABLE "sources" IS '뉴스 소스 정보';
COMMENT ON TABLE "news" IS '수집된 뉴스 기사';
COMMENT ON TABLE "user_profiles" IS '사용자 프로필 및 레벨 정보';
COMMENT ON TABLE "user_contexts" IS '사용자-컨텍스트 매핑';
COMMENT ON TABLE "user_interests" IS '사용자-관심사 매핑';
COMMENT ON TABLE "subscriptions" IS '사용자 구독 정보';
COMMENT ON TABLE "news_analysis_levels" IS '뉴스별 분석 레벨 (1-3)';
COMMENT ON TABLE "admin_edits" IS '관리자의 분석 수정 기록';

COMMENT ON COLUMN "user_profiles"."level" IS '사용자 레벨 (1: 초급, 2: 중급, 3: 고급)';
COMMENT ON COLUMN "news_analysis_levels"."level" IS '분석 깊이 레벨 (1: 간단, 2: 보통, 3: 상세)';
COMMENT ON COLUMN "news_analysis_levels"."action_blurred" IS '사용자 액션 팁 블러 처리 여부 (유료 기능)';

-- ============================================
-- 테이블 생성
-- ============================================
CREATE TABLE public.cycle_explanations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- 1. 신호등 색상 (UI 표시용)
  status_color text NOT NULL,
  
  -- 2. 현재 상황 요약 (AI 작성)
  summary_text text NOT NULL,
  
  -- 3. 역사적 패턴/팩트 (AI 작성)
  historical_pattern text NOT NULL,
  
  -- 4. 근거 지표 모음 (숫자 데이터)
  indicators_snapshot jsonb NOT NULL,
  
  CONSTRAINT cycle_explanations_pkey PRIMARY KEY (id),
  
  -- CHECK 제약조건: status_color는 'Red', 'Yellow', 'Green' 중 하나만 허용
  CONSTRAINT cycle_explanations_status_color_check 
    CHECK (status_color IN ('Red', 'Yellow', 'Green'))
);
-- ============================================
-- 인덱스 생성
-- ============================================
-- created_at 컬럼에 인덱스 추가 (날짜 기반 검색 최적화)
CREATE INDEX idx_cycle_explanations_created_at 
  ON public.cycle_explanations(created_at DESC);
-- status_color 컬럼에 인덱스 추가 (색상별 필터링 최적화)
CREATE INDEX idx_cycle_explanations_status_color 
  ON public.cycle_explanations(status_color);
-- JSONB 컬럼에 GIN 인덱스 추가 (JSON 내부 필드 검색 최적화)
CREATE INDEX idx_cycle_explanations_indicators_gin 
  ON public.cycle_explanations USING GIN (indicators_snapshot);
-- ============================================
-- updated_at 자동 업데이트 트리거 함수 생성
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- ============================================
-- updated_at 트리거 적용
-- ============================================
CREATE TRIGGER trigger_update_cycle_explanations_updated_at
  BEFORE UPDATE ON public.cycle_explanations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
-- ============================================
-- 테이블/컬럼 코멘트
-- ============================================
COMMENT ON TABLE public.cycle_explanations IS '경기 사이클 설명 및 분석 데이터';
COMMENT ON COLUMN public.cycle_explanations.created_at IS '레코드 생성 시각';
COMMENT ON COLUMN public.cycle_explanations.updated_at IS '레코드 수정 시각 (자동 업데이트)';
COMMENT ON COLUMN public.cycle_explanations.status_color IS '신호등 색상: Red(위험), Yellow(주의), Green(안전)';
COMMENT ON COLUMN public.cycle_explanations.summary_text IS '현재 상황 요약 (AI 생성)';
COMMENT ON COLUMN public.cycle_explanations.historical_pattern IS '역사적 패턴 및 팩트 (AI 생성)';
COMMENT ON COLUMN public.cycle_explanations.indicators_snapshot IS '근거 지표 데이터 (JSON 형태)';