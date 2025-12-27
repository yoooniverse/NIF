-- ============================================
-- 스키마 업데이트 마이그레이션
-- 1. news 테이블: source → source_id로 변경 (sources 테이블 참조), summary, metadata 제거
-- 2. user_profiles → users로 변경, user_id 제거
-- 3. interests: is_active, slug 컬럼 제거
-- 4. contexts: is_active, slug 컬럼 제거
-- ============================================

-- ============================================
-- 1. news 테이블 변경
-- ============================================
-- summary, metadata 컬럼 제거
ALTER TABLE "news" DROP COLUMN IF EXISTS "summary";
ALTER TABLE "news" DROP COLUMN IF EXISTS "metadata";

-- source 컬럼을 source_id로 변경
-- source_id 컬럼 추가
ALTER TABLE "news" ADD COLUMN "source_id" UUID;

-- source 데이터를 source_id로 변환 (첫 번째 sources 레코드를 기본값으로 사용)
UPDATE "news" SET "source_id" = (
    SELECT "id" FROM "sources" LIMIT 1
) WHERE "source_id" IS NULL;

-- source_id를 NOT NULL로 변경
ALTER TABLE "news" ALTER COLUMN "source_id" SET NOT NULL;

-- source 컬럼 제거
ALTER TABLE "news" DROP COLUMN IF EXISTS "source";

-- 외래키 제약조건 추가
ALTER TABLE "news" ADD CONSTRAINT "FK_sources_TO_news"
FOREIGN KEY ("source_id") REFERENCES "sources" ("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================
-- 2. users 테이블 정리 (user_profiles는 이미 통합됨)
-- ============================================
-- users 테이블은 이미 올바른 구조로 설정되어 있음
-- clerk_id, name, email, level, onboarded_at 컬럼들이 이미 존재함
-- Supabase Auth 기본 컬럼들과 함께 사용됨

-- ============================================
-- 3. interests 테이블 컬럼 제거
-- ============================================
-- slug, is_active 컬럼 제거
ALTER TABLE "interests" DROP COLUMN IF EXISTS "slug";
ALTER TABLE "interests" DROP COLUMN IF EXISTS "is_active";

-- 관련 제약조건 및 인덱스 제거
ALTER TABLE "interests" DROP CONSTRAINT IF EXISTS "UQ_INTERESTS_SLUG";
DROP INDEX IF EXISTS "IDX_INTERESTS_SLUG";
DROP INDEX IF EXISTS "IDX_INTERESTS_IS_ACTIVE";

-- ============================================
-- 4. contexts 테이블 컬럼 제거
-- ============================================
-- slug, is_active 컬럼 제거
ALTER TABLE "contexts" DROP COLUMN IF EXISTS "slug";
ALTER TABLE "contexts" DROP COLUMN IF EXISTS "is_active";

-- 관련 제약조건 및 인덱스 제거
ALTER TABLE "contexts" DROP CONSTRAINT IF EXISTS "UQ_CONTEXTS_SLUG";
DROP INDEX IF EXISTS "IDX_CONTEXTS_SLUG";
DROP INDEX IF EXISTS "IDX_CONTEXTS_IS_ACTIVE";

-- ============================================
-- 인덱스 업데이트
-- ============================================

-- users 테이블에 대한 새 인덱스
CREATE INDEX IF NOT EXISTS "IDX_USERS_CLERK_ID" ON "users" ("clerk_id");
CREATE INDEX IF NOT EXISTS "IDX_USERS_CREATED_AT" ON "users" ("created_at");

-- interests 테이블 인덱스 업데이트 (기존 인덱스 제거 후 재생성)
DROP INDEX IF EXISTS "IDX_INTERESTS_SLUG";
DROP INDEX IF EXISTS "IDX_INTERESTS_IS_ACTIVE";

-- contexts 테이블 인덱스 업데이트 (기존 인덱스 제거 후 재생성)
DROP INDEX IF EXISTS "IDX_CONTEXTS_SLUG";
DROP INDEX IF EXISTS "IDX_CONTEXTS_IS_ACTIVE";

-- ============================================
-- 테이블 코멘트 업데이트
-- ============================================
COMMENT ON TABLE "users" IS '사용자 기본 정보 (user_profiles에서 통합)';
COMMENT ON TABLE "interests" IS '관심사 목록 (is_active, slug 컬럼 제거)';
COMMENT ON TABLE "contexts" IS '컨텍스트 목록 (is_active, slug 컬럼 제거)';
COMMENT ON TABLE "news" IS '수집된 뉴스 기사 (metadata 컬럼 제거)';

-- ============================================
-- 완료 메시지
-- ============================================
-- 마이그레이션 완료 후 database.types.ts 파일을 다시 생성해야 합니다.
-- 명령어: npx supabase gen types typescript --local > database.types.ts
