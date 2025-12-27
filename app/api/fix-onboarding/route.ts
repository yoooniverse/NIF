import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

async function runRawSQL(supabase: any, sql: string) {
  // Supabase에서 Raw SQL을 실행하기 위한 헬퍼 함수
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    return { data, error };
  } catch (e) {
    // rpc가 실패하면 다른 방법을 시도
    console.log('RPC 실패, 다른 방법 시도');
    return { data: null, error: e };
  }
}

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('온보딩 데이터 수정 시작...');

    // 먼저 현재 데이터 확인
    const { data: currentInterests } = await supabase.from('interests').select('*');
    const { data: currentContexts } = await supabase.from('contexts').select('*');

    console.log('현재 interests 데이터:', currentInterests);
    console.log('현재 contexts 데이터:', currentContexts);

    // interests 테이블 초기화 및 올바른 데이터 삽입
    console.log('interests 테이블 초기화 중...');
    const { error: deleteInterestsError } = await supabase
      .from('interests')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // 모든 데이터 삭제

    if (deleteInterestsError) {
      console.error('Interests 데이터 삭제 실패:', deleteInterestsError);
      // 삭제 실패해도 계속 진행
    }

    const interestsData = [
      { name: '주식', created_at: new Date().toISOString() },
      { name: '채권', created_at: new Date().toISOString() },
      { name: '부동산', created_at: new Date().toISOString() },
      { name: '암호화폐', created_at: new Date().toISOString() },
      { name: '외환', created_at: new Date().toISOString() },
      { name: '원자재', created_at: new Date().toISOString() },
      { name: 'ETF', created_at: new Date().toISOString() },
      { name: '펀드', created_at: new Date().toISOString() }
    ];

    console.log('interests 데이터 삽입 중...');
    const { error: interestsError } = await supabase
      .from('interests')
      .insert(interestsData);

    if (interestsError) {
      console.error('Interests 데이터 삽입 실패:', interestsError);
      throw interestsError;
    }

    // contexts 테이블 초기화 및 올바른 데이터 삽입
    console.log('contexts 테이블 초기화 중...');
    const { error: deleteContextsError } = await supabase
      .from('contexts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // 모든 데이터 삭제

    if (deleteContextsError) {
      console.error('Contexts 데이터 삭제 실패:', deleteContextsError);
      // 삭제 실패해도 계속 진행
    }

    const contextsData = [
      { name: '직장인', created_at: new Date().toISOString() },
      { name: '학생', created_at: new Date().toISOString() },
      { name: '투자 초보자', created_at: new Date().toISOString() },
      { name: '전업 투자자', created_at: new Date().toISOString() },
      { name: '은퇴 예정자', created_at: new Date().toISOString() },
      { name: '사업가', created_at: new Date().toISOString() },
      { name: '프리랜서', created_at: new Date().toISOString() },
      { name: '주부/주부', created_at: new Date().toISOString() }
    ];

    console.log('contexts 데이터 삽입 중...');
    const { error: contextsError } = await supabase
      .from('contexts')
      .insert(contextsData);

    if (contextsError) {
      console.error('Contexts 데이터 삽입 실패:', contextsError);
      throw contextsError;
    }

    // 수정된 데이터 확인
    const { data: interests, error: interestsQueryError } = await supabase.from('interests').select('*').order('name');
    const { data: contexts, error: contextsQueryError } = await supabase.from('contexts').select('*').order('name');

    if (interestsQueryError) {
      console.error('Interests 조회 실패:', interestsQueryError);
    }

    if (contextsQueryError) {
      console.error('Contexts 조회 실패:', contextsQueryError);
    }

    console.log('데이터 수정 완료');
    console.log('수정된 interests 데이터:', interests);
    console.log('수정된 contexts 데이터:', contexts);

    return NextResponse.json({
      success: true,
      message: '온보딩 데이터가 성공적으로 수정되었습니다.',
      data: {
        interests: interests?.length || 0,
        contexts: contexts?.length || 0,
        interestsData: interests,
        contextsData: contexts
      },
      errors: {
        interestsQuery: interestsQueryError,
        contextsQuery: contextsQueryError
      }
    });

  } catch (error) {
    console.error('온보딩 데이터 수정 중 오류:', error);
    return NextResponse.json(
      {
        error: '온보딩 데이터 수정 실패',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}
