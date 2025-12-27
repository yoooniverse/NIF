// 데이터베이스 디버깅 스크립트
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function debugData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('환경 변수 확인:', {
    supabaseUrl: supabaseUrl ? '설정됨' : '없음',
    supabaseKey: supabaseKey ? '설정됨' : '없음'
  });

  if (!supabaseUrl || !supabaseKey) {
    console.error('환경 변수가 설정되지 않았습니다.');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('=== INTERESTS 테이블 데이터 ===');
    const { data: interests, error: interestsError } = await supabase
      .from('interests')
      .select('*')
      .order('created_at', { ascending: true });

    if (interestsError) {
      console.error('Interests 쿼리 에러:', interestsError);
    } else {
      console.log('Interests 데이터:', interests);
    }

    console.log('\n=== CONTEXTS 테이블 데이터 ===');
    const { data: contexts, error: contextsError } = await supabase
      .from('contexts')
      .select('*')
      .order('created_at', { ascending: true });

    if (contextsError) {
      console.error('Contexts 쿼리 에러:', contextsError);
    } else {
      console.log('Contexts 데이터:', contexts);
    }

  } catch (error) {
    console.error('디버깅 중 에러:', error);
  }
}

debugData();
