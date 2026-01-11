import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/subscription/status
 * 사용자의 구독 상태를 Supabase subscriptions 테이블에서 확인
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error('[SUBSCRIPTION_API] Unauthorized: No user ID');
      return NextResponse.json(
        { status: 'economy', source: 'no_auth' },
        { status: 401 }
      );
    }

    console.info('[SUBSCRIPTION_API] Checking subscription for user:', userId);

    const supabase = await createClerkSupabaseClient();

    // Supabase subscriptions 테이블에서 최신 구독 정보 조회
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('clerk_id', userId)
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('[SUBSCRIPTION_API] Supabase error:', error);
      // 에러 발생 시 기본값 반환 (서비스 계속 작동)
      return NextResponse.json({ 
        status: 'economy', 
        source: 'error',
        error: error.message 
      });
    }

    // 구독 정보가 없으면 economy
    if (!subscription) {
      console.info('[SUBSCRIPTION_API] No subscription found -> economy');
      return NextResponse.json({ 
        status: 'economy',
        source: 'no_subscription'
      });
    }

    console.info('[SUBSCRIPTION_API] Subscription found:', {
      plan: subscription.plan,
      active: subscription.active,
      ends_at: subscription.ends_at,
      started_at: subscription.started_at
    });

    // 유료 구독이고 활성 상태이며 만료 전이면 first_class
    if (
      subscription.plan === 'premium' && 
      subscription.active && 
      subscription.ends_at && 
      new Date(subscription.ends_at) > new Date()
    ) {
      console.info('[SUBSCRIPTION_API] Premium subscription active -> first_class');
      return NextResponse.json({ 
        status: 'first_class',
        source: 'premium_subscription',
        ends_at: subscription.ends_at
      });
    }

    // 무료 플랜이고 만료되지 않았으면 first_class (무료체험 중)
    if (
      subscription.plan === 'free' && 
      subscription.active && 
      subscription.ends_at && 
      new Date(subscription.ends_at) > new Date()
    ) {
      console.info('[SUBSCRIPTION_API] Free trial active -> first_class');
      return NextResponse.json({ 
        status: 'first_class',
        source: 'free_trial',
        ends_at: subscription.ends_at
      });
    }

    // 그 외 모든 경우 economy
    console.info('[SUBSCRIPTION_API] Subscription inactive or expired -> economy');
    return NextResponse.json({ 
      status: 'economy',
      source: 'subscription_expired',
      plan: subscription.plan,
      active: subscription.active,
      ends_at: subscription.ends_at
    });

  } catch (error) {
    console.error('[SUBSCRIPTION_API] Unexpected error:', error);
    return NextResponse.json(
      { 
        status: 'economy', 
        source: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
