import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createClerkSupabaseClient } from '@/lib/supabase/server';

interface OnboardingCompleteRequest {
  level: number;
  interests: string[];
  contexts: string[];
}

/**
 * 온보딩 완료 처리 API 엔드포인트
 *
 * POST /api/onboarding/complete
 *
 * 사용자의 온보딩을 완료하고 선택한 정보를 Clerk 메타데이터에 저장합니다.
 * 또한 Supabase에 사용자 정보를 동기화합니다.
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[ONBOARDING_COMPLETE_API] 온보딩 완료 처리 시작');

    // Clerk 인증 확인
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      console.error('[ONBOARDING_COMPLETE_API] 인증되지 않은 요청');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[ONBOARDING_COMPLETE_API] 인증된 사용자 ID:', clerkUserId);

    // 요청 데이터 파싱
    let body: OnboardingCompleteRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[ONBOARDING_COMPLETE_API] 요청 데이터 파싱 실패:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    const { level, interests, contexts } = body;

    // 데이터 검증
    if (typeof level !== 'number' || level < 1 || level > 3) {
      console.error('[ONBOARDING_COMPLETE_API] 유효하지 않은 레벨:', level);
      return NextResponse.json(
        { error: 'Invalid level' },
        { status: 400 }
      );
    }

    if (!Array.isArray(interests) || !Array.isArray(contexts)) {
      console.error('[ONBOARDING_COMPLETE_API] 유효하지 않은 관심사 또는 상황 데이터');
      return NextResponse.json(
        { error: 'Invalid interests or contexts' },
        { status: 400 }
      );
    }

    console.log('[ONBOARDING_COMPLETE_API] 처리할 데이터:', {
      level,
      interests,
      contexts,
    });

    // Clerk 메타데이터 업데이트
    try {
      console.log('[ONBOARDING_COMPLETE_API] Clerk 메타데이터 업데이트 시작');

      // Clerk v5에서는 clerkClient() 함수를 호출해야 함
      const client = await clerkClient();
      await client.users.updateUser(clerkUserId, {
        publicMetadata: {
          onboardingCompleted: true,
          userProfiles: {
            level,
            interests,
            contexts,
          },
        },
        unsafeMetadata: {
          onboardingCompleted: true,
          level,
          interests,
          contexts,
        },
      });

      console.log('[ONBOARDING_COMPLETE_API] Clerk 메타데이터 업데이트 성공');
    } catch (clerkError) {
      console.error('[ONBOARDING_COMPLETE_API] Clerk 메타데이터 업데이트 실패:', clerkError);
      throw clerkError;
    }

    // Supabase 사용자 정보 동기화
    try {
      console.log('[ONBOARDING_COMPLETE_API] Supabase 사용자 동기화 시작');

      const supabase = createClerkSupabaseClient();

      // Clerk에서 최신 사용자 정보 가져오기
      const clerkResponse = await fetch(
        `https://api.clerk.com/v1/users/${clerkUserId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (clerkResponse.ok) {
        const clerkUser = await clerkResponse.json();

        // 1. users 테이블에 기본 정보 저장
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            clerk_id: clerkUser.id,
            name: clerkUser.first_name && clerkUser.last_name
              ? `${clerkUser.first_name} ${clerkUser.last_name}`.trim()
              : clerkUser.first_name || clerkUser.last_name || clerkUser.username || null,
            email: clerkUser.email_addresses?.[0]?.email_address || null,
            level: level, // 레벨 추가
            onboarded_at: new Date().toISOString(),
          }, {
            onConflict: 'clerk_id',
            ignoreDuplicates: false
          });

        if (upsertError) {
          console.error('[ONBOARDING_COMPLETE_API] users 테이블 업데이트 실패:', upsertError);
          throw upsertError;
        }

        console.log('[ONBOARDING_COMPLETE_API] users 테이블 업데이트 성공');

        // 2. 기존 user_interests 삭제 (재온보딩 대비)
        const { error: deleteInterestsError } = await supabase
          .from('user_interests')
          .delete()
          .eq('clerk_id', clerkUserId);

        if (deleteInterestsError) {
          console.warn('[ONBOARDING_COMPLETE_API] 기존 user_interests 삭제 경고:', deleteInterestsError);
        }

        // 3. user_interests 저장
        if (interests.length > 0) {
          const interestsData = interests.map(interestId => ({
            clerk_id: clerkUserId,
            interest_id: interestId,
            created_at: new Date().toISOString(),
          }));

          const { error: interestsError } = await supabase
            .from('user_interests')
            .insert(interestsData);

          if (interestsError) {
            console.error('[ONBOARDING_COMPLETE_API] user_interests 저장 실패:', interestsError);
            throw interestsError;
          }

          console.log('[ONBOARDING_COMPLETE_API] user_interests 저장 성공:', interests.length, '개');
        }

        // 4. 기존 user_contexts 삭제 (재온보딩 대비)
        const { error: deleteContextsError } = await supabase
          .from('user_contexts')
          .delete()
          .eq('clerk_id', clerkUserId);

        if (deleteContextsError) {
          console.warn('[ONBOARDING_COMPLETE_API] 기존 user_contexts 삭제 경고:', deleteContextsError);
        }

        // 5. user_contexts 저장
        if (contexts.length > 0) {
          const contextsData = contexts.map(contextId => ({
            clerk_id: clerkUserId,
            context_id: contextId,
            created_at: new Date().toISOString(),
          }));

          const { error: contextsError } = await supabase
            .from('user_contexts')
            .insert(contextsData);

          if (contextsError) {
            console.error('[ONBOARDING_COMPLETE_API] user_contexts 저장 실패:', contextsError);
            throw contextsError;
          }

          console.log('[ONBOARDING_COMPLETE_API] user_contexts 저장 성공:', contexts.length, '개');
        }

        console.log('[ONBOARDING_COMPLETE_API] Supabase 전체 동기화 성공');
      } else {
        console.warn('[ONBOARDING_COMPLETE_API] Clerk 사용자 정보 조회 실패, Supabase 동기화 스킵');
        throw new Error('Clerk 사용자 정보 조회 실패');
      }
    } catch (supabaseError) {
      console.error('[ONBOARDING_COMPLETE_API] Supabase 동기화 실패:', supabaseError);
      // Supabase 동기화 실패는 치명적이므로 에러 반환
      throw supabaseError;
    }

    console.log('[ONBOARDING_COMPLETE_API] 온보딩 완료 처리 성공');

    return NextResponse.json({
      success: true,
      message: '온보딩이 성공적으로 완료되었습니다.',
      data: {
        level,
        interests,
        contexts,
        onboardingCompleted: true,
      },
    });

  } catch (error) {
    console.error('[ONBOARDING_COMPLETE_API] 온보딩 완료 처리 중 오류 발생:', error);

    return NextResponse.json(
      {
        error: '온보딩 완료 처리 실패',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}