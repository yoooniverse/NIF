-- 온보딩 데이터 수정 SQL
-- interests 테이블에 올바른 관심사 데이터 삽입
-- contexts 테이블에 올바른 상황 데이터 삽입

-- interests 테이블 초기화 및 데이터 삽입
DELETE FROM interests;
INSERT INTO interests (name) VALUES
('주식'),
('채권'),
('부동산'),
('암호화폐'),
('외환'),
('원자재'),
('ETF'),
('펀드');

-- contexts 테이블 초기화 및 데이터 삽입
DELETE FROM contexts;
INSERT INTO contexts (name) VALUES
('직장인'),
('학생'),
('투자 초보자'),
('전업 투자자'),
('은퇴 예정자'),
('사업가'),
('프리랜서'),
('주부/주부');

-- 확인 쿼리
SELECT 'interests' as table_name, COUNT(*) as count FROM interests
UNION ALL
SELECT 'contexts' as table_name, COUNT(*) as count FROM contexts;
