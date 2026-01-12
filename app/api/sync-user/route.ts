import { NextRequest, NextResponse } from 'next/server';
import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { Database } from '@/database.types';

/**
 * Clerk 사용자를 Supabase DB에 동기화하는 API 엔드포인트
 *
 * POST /api/sync-user
 *
 * Clerk 인증이 완료된 사용자의 정보를 Supabase users 테이블에 저장합니다.
 * 이미 존재하는 사용자인 경우 업데이트합니다.
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[SYNC_USER_API] 사용자 동기화 요청 시작');

    // Clerk 인증 확인
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      console.error('[SYNC_USER_API] 인증되지 않은 요청');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[SYNC_USER_API] 인증된 사용자 ID:', clerkUserId);

    // Clerk에서 사용자 정보 가져오기 (서버 사이드)
    const clerkResponse = await fetch(
      `https://api.clerk.com/v1/users/${clerkUserId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!clerkResponse.ok) {
      console.error('[SYNC_USER_API] Clerk API 호출 실패:', clerkResponse.status);
      throw new Error('Failed to fetch user from Clerk');
    }

    const clerkUser = await clerkResponse.json();
    console.log('[SYNC_USER_API] Clerk 사용자 정보:', {
      id: clerkUser.id,
      email: clerkUser.email_addresses?.[0]?.email_address,
      firstName: clerkUser.first_name,
      lastName: clerkUser.last_name,
      username: clerkUser.username,
    });

    // Supabase 클라이언트 생성 (Clerk 인증 포함)
    const supabase = createClerkSupabaseClient();

    // 사용자 데이터 준비
    const userData: Database['public']['Tables']['users']['Insert'] = {
      clerk_id: clerkUser.id,
      name: clerkUser.first_name && clerkUser.last_name
        ? `${clerkUser.first_name} ${clerkUser.last_name}`.trim()
        : clerkUser.first_name || clerkUser.last_name || clerkUser.username || '',
      email: clerkUser.email_addresses?.[0]?.email_address || '',
      level: clerkUser.public_metadata?.userProfiles?.level || clerkUser.unsafe_metadata?.level || 1, // Clerk 메타데이터의 레벨 반영
      // onboarded_at은 자동으로 현재 시간으로 설정됨 (옵셔널 필드)
    };

    console.log('[SYNC_USER_API] Supabase에 저장할 데이터:', userData);

    // Upsert: 존재하면 업데이트, 없으면 생성
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, {
        onConflict: 'clerk_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('[SYNC_USER_API] Supabase 저장 실패:', error);
      throw error;
    }

    console.log('[SYNC_USER_API] 사용자 동기화 성공:', data);

    return NextResponse.json({
      success: true,
      user: data,
      message: '사용자 정보가 성공적으로 동기화되었습니다.'
    });

  } catch (error) {
    console.error('[SYNC_USER_API] 사용자 동기화 중 오류 발생:', error);
    console.error('[SYNC_USER_API] 오류 스택:', error instanceof Error ? error.stack : '스택 정보 없음');

    // 더 자세한 에러 정보 로깅
    if (error instanceof Error) {
      console.error('[SYNC_USER_API] 에러 타입:', error.constructor.name);
      console.error('[SYNC_USER_API] 에러 메시지:', error.message);
    }

    return NextResponse.json(
      {
        error: '사용자 동기화 실패',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}