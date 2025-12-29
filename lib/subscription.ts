// import { type UserResource } from "@clerk/nextjs"; 

/**
 * 사용자의 구독 상태(First Class / Economy)를 결정합니다.
 * Dashboard와 NewsDetail 페이지에서 동일한 로직을 사용하기 위해 분리함.
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

    // 3. Trial Period Active
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

    // 4. Implicit Trial (30 days from onboarding/creation)
    const onboardedAtStr = publicMeta?.onboardedAt || unsafeMeta?.onboardedAt;
    const createdAt = user.createdAt ? new Date(user.createdAt) : null;
    // onboardedAt이 있으면 사용하고, 없으면 createdAt(가입일) 사용
    const startDate = onboardedAtStr ? new Date(onboardedAtStr) : createdAt;

    if (startDate) {
        const now = new Date();
        const diffTime = now.getTime() - startDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        console.log("[SUBSCRIPTION_HELPER] Implicit trial check:", {
            startDate,
            diffDays,
            isTrial: diffDays < 30
        });

        if (diffDays < 30) {
            return 'first_class';
        }
    }

    return 'economy';
}
