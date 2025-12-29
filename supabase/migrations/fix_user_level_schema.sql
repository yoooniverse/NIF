-- 사용자 레벨(level) 컬럼이 NULL이 될 수 없도록 강제 (기본값: 1)
-- 이렇게 하면 시스템이 유저 정보를 읽을 때 '알 수 없음' 상태가 되어 '기본값(레벨 2)'로 넘어가는 일을 원천 차단합니다.

-- 1. 기존에 혹시 있을지 모르는 NULL 데이터를 1(초급)로 채워넣기
UPDATE public.users 
SET level = 1 
WHERE level IS NULL;

-- 2. 컬럼에 NOT NULL 제약조건과 기본값 설정
ALTER TABLE public.users 
ALTER COLUMN level SET DEFAULT 1,
ALTER COLUMN level SET NOT NULL;
