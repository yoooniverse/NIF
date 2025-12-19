-- ============================================
-- 온보딩 스키마 수정
-- user_interests와 user_contexts 테이블을 slug 기반으로 변경
-- ============================================

-- 1. 기존 외래키 제약조건 삭제
ALTER TABLE "user_contexts" DROP CONSTRAINT IF EXISTS "FK_contexts_TO_user_contexts";
ALTER TABLE "user_interests" DROP CONSTRAINT IF EXISTS "FK_interests_TO_user_interests";

-- 2. 기존 컬럼 삭제
ALTER TABLE "user_contexts" DROP COLUMN IF EXISTS "context_id";
ALTER TABLE "user_interests" DROP COLUMN IF EXISTS "interest_id";

-- 3. slug 컬럼 추가
ALTER TABLE "user_contexts" ADD COLUMN "context_slug" text NOT NULL DEFAULT '';
ALTER TABLE "user_interests" ADD COLUMN "interest_slug" text NOT NULL DEFAULT '';

-- 4. 인덱스 재생성
DROP INDEX IF EXISTS "IDX_USER_CONTEXTS_CONTEXT_ID";
DROP INDEX IF EXISTS "IDX_USER_INTERESTS_INTEREST_ID";

CREATE INDEX "IDX_USER_CONTEXTS_CONTEXT_SLUG" ON "user_contexts" ("context_slug");
CREATE INDEX "IDX_USER_INTERESTS_INTEREST_SLUG" ON "user_interests" ("interest_slug");

-- 5. UNIQUE 제약조건 재생성
ALTER TABLE "user_contexts" DROP CONSTRAINT IF EXISTS "UQ_USER_CONTEXTS_USER_CONTEXT";
ALTER TABLE "user_interests" DROP CONSTRAINT IF EXISTS "UQ_USER_INTERESTS_USER_INTEREST";

ALTER TABLE "user_contexts" ADD CONSTRAINT "UQ_USER_CONTEXTS_USER_CONTEXT_SLUG" UNIQUE ("user_id", "context_slug");
ALTER TABLE "user_interests" ADD CONSTRAINT "UQ_USER_INTERESTS_USER_INTEREST_SLUG" UNIQUE ("user_id", "interest_slug");

-- 6. 코멘트 업데이트
COMMENT ON COLUMN "user_contexts"."context_slug" IS '사용자가 선택한 컨텍스트 슬러그';
COMMENT ON COLUMN "user_interests"."interest_slug" IS '사용자가 선택한 관심사 슬러그';

