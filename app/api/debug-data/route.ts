import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // interests 테이블 데이터 확인
    const { data: interests, error: interestsError } = await supabase
      .from('interests')
      .select('*')
      .order('created_at', { ascending: true });

    if (interestsError) {
      console.error('Interests query error:', interestsError);
    }

    // contexts 테이블 데이터 확인
    const { data: contexts, error: contextsError } = await supabase
      .from('contexts')
      .select('*')
      .order('created_at', { ascending: true });

    if (contextsError) {
      console.error('Contexts query error:', contextsError);
    }

    return NextResponse.json({
      interests: {
        data: interests,
        error: interestsError
      },
      contexts: {
        data: contexts,
        error: contextsError
      }
    });

  } catch (error) {
    console.error('Debug data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debug data' },
      { status: 500 }
    );
  }
}
