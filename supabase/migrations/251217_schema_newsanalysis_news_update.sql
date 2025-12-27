-- 1. 기존 테이블이 있다면 삭제 (깔끔하게 다시 만들기 위해)
DROP TABLE IF EXISTS public.news_analysis_levels CASCADE;

-- 2. '3단 도시락' 구조로 다시 만들기
CREATE TABLE public.news_analysis_levels (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  
  -- [연결 고리 수리] 뉴스와의 관계를 확실하게 명시
  news_id uuid NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,

  -- [구조 변경] 레벨(1,2,3) 숫자 칸 삭제 -> 대신 레벨별 칸을 다 만듦
  -- Level 1 (초급 - 필수)
  easy_title text NOT NULL,
  easy_content text NOT NULL,   -- summary 대신 헷갈리지 않게 content로 통일
  easy_worst text,              -- worst_scenario
  easy_action text,             -- user_action_tip
  
  -- Level 2 (중급 - 선택)
  normal_title text,
  normal_content text,
  normal_worst text,
  normal_action text,

  -- Level 3 (고급 - 선택)
  hard_title text,
  hard_content text,
  hard_worst text,
  hard_action text,

  -- 태그 및 기타 정보
  context jsonb,    -- 타겟 (직장인 등)
  interest jsonb,   -- 관심사 (주식 등)
  action_blurred boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT now(),

  CONSTRAINT news_analysis_levels_pkey PRIMARY KEY (id)
);

-- News(뉴스원문)와 Analysis(뉴스해설가공) 테이블 연결이 끊기고
-- n8n에서 레벨 1, 2, 3을 한 줄에 다 넣기 위한 구조