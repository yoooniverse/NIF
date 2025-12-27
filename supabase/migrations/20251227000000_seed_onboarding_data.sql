-- ============================================
-- 온보딩 초기 데이터 시드
-- interests와 contexts 테이블에 올바른 데이터를 삽입
-- ============================================

-- interests 테이블 초기화 및 올바른 데이터 삽입
DELETE FROM interests;

INSERT INTO interests (name, created_at) VALUES
('주식', now()),
('채권', now()),
('부동산', now()),
('암호화폐', now()),
('외환', now()),
('원자재', now()),
('ETF', now()),
('펀드', now());

-- contexts 테이블 초기화 및 올바른 데이터 삽입
DELETE FROM contexts;

INSERT INTO contexts (name, created_at) VALUES
('직장인', now()),
('학생', now()),
('투자 초보자', now()),
('전업 투자자', now()),
('은퇴 예정자', now()),
('사업가', now()),
('프리랜서', now()),
('주부/주부', now());

-- 확인 쿼리
SELECT
  'interests' as table_name,
  COUNT(*) as count,
  array_agg(name ORDER BY name) as items
FROM interests
UNION ALL
SELECT
  'contexts' as table_name,
  COUNT(*) as count,
  array_agg(name ORDER BY name) as items
FROM contexts;
