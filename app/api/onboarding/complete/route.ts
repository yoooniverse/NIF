import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    // 사용자 인증 확인
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    // 요청 데이터 파싱
    const { level, interests, contexts } = await request.json();

    // 데이터 유효성 검증
    if (!level || !Array.isArray(interests) || !Array.isArray(contexts)) {
      console.error('[API] 유효하지 않은 데이터:', { level, interests, contexts });
      return NextResponse.json(
        { error: '유효하지 않은 데이터입니다.' },
        { status: 400 }
      );
    }

    // Clerk Admin SDK를 사용하여 메타데이터 업데이트
    const client = await clerkClient();

    let metadataUpdated = false;

    try {
      // Clerk v5 방식으로 메타데이터 업데이트 시도
      const result = await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          onboardingCompleted: true,
          userProfiles: {
            level,
            interests,
            contexts,
          },
          freeTrialStartDate: new Date().toISOString(),
          onboardingCompletedAt: new Date().toISOString(),
        },
      });

      console.log(`[API] Clerk v5 메타데이터 업데이트 성공:`, result);
      metadataUpdated = true;
    } catch (metadataError) {
      console.error('[API] Clerk v5 메타데이터 업데이트 실패 상세:', metadataError);

      // Clerk 메타데이터 업데이트 실패 시에도 온보딩 완료 처리 진행
      console.log('[API] 메타데이터 업데이트 실패했지만 온보딩은 완료 처리');
    }

    console.log(`[API] 온보딩 완료 처리: ${userId}, 메타데이터 업데이트: ${metadataUpdated ? '성공' : '실패'}`);

    return NextResponse.json({
      success: true,
      message: '온보딩이 완료되었습니다.',
      metadataUpdated,
    });

  } catch (error) {
    console.error('[API] 온보딩 완료 처리 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}