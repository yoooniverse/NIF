// import { type UserResource } from "@clerk/nextjs"; 

/**
 * 사용자의 구독 상태(First Class / Economy)를 결정합니다.
 * ⚠️ 이 함수는 Clerk 메타데이터만 확인합니다 (클라이언트 사이드용 폴백).
 * 실제 구독 상태는 /api/subscription/status API를 호출하여 Supabase에서 확인하세요.
 * 
 * @deprecated 이 함수는 Supabase subscriptions 테이블을 확인하지 않습니다.
 * 대신 useSubscriptionStatus 훅을 사용하세요.
 */
export function getSubscriptionStatus(user: any): 'first_class' | 'economy' {
    if (!user) return 'economy';

    const publicMeta = user.publicMetadata as Record<string, any>;
    const unsafeMeta = user.unsafeMetadata as Record<string, any>;

    // 1. Subscription explicitly 'premium'
    if (publicMeta?.subscription === 'premium' || unsafeMeta?.subscription === 'premium') {
        return 'first_class';
    }

    // 2. User Profile Level 'premium'
    if (publicMeta?.userProfiles?.level === 'premium' || unsafeMeta?.level === 'premium') {
        return 'first_class';
    }

    // 3. Trial Period Active (Clerk metadata)
    // Check publicMetadata.trialEnds
    if (publicMeta?.trialEnds) {
        const trialEnds = new Date(publicMeta.trialEnds);
        if (!isNaN(trialEnds.getTime()) && trialEnds > new Date()) {
            return 'first_class';
        }
    }

    // Check unsafeMetadata.trialEnds
    if (unsafeMeta?.trialEnds) {
        const trialEnds = new Date(unsafeMeta.trialEnds);
        if (!isNaN(trialEnds.getTime()) && trialEnds > new Date()) {
            return 'first_class';
        }
    }

    // ⚠️ Implicit Trial 로직 제거됨
    // Supabase subscriptions 테이블을 확인해야 정확한 상태를 알 수 있습니다.
    // API를 통해 확인하세요: /api/subscription/status

    console.log("[SUBSCRIPTION_HELPER] No active subscription in Clerk metadata -> economy (default)");

    return 'economy';
}

/**
 * React Hook: 사용자의 구독 상태를 Supabase에서 조회
 * Supabase subscriptions 테이블을 확인하여 정확한 구독 상태를 반환합니다.
 */
export function useSubscriptionStatus() {
    const [status, setStatus] = React.useState<'first_class' | 'economy' | 'loading'>('loading');
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        async function fetchStatus() {
            try {
                console.info('[SUBSCRIPTION_HOOK] Fetching subscription status from API...');
                const response = await fetch('/api/subscription/status', {
                    cache: 'no-store'
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                console.info('[SUBSCRIPTION_HOOK] Received status:', data);
                
                setStatus(data.status);
                setError(null);
            } catch (err) {
                console.error('[SUBSCRIPTION_HOOK] Error fetching status:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setStatus('economy'); // 에러 시 기본값
            }
        }

        fetchStatus();
    }, []);

    return { status, loading: status === 'loading', error };
}

// React import for hook
import React from 'react';
