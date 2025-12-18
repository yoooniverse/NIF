'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MonthlyNewsFeed from '@/components/dashboard/MonthlyNewsFeed';

export default function DashboardV2MonthlyPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.info('[DASHBOARD_V2_MONTHLY] page loaded');
  }, []);

  useEffect(() => {
    // 핵심 기능 로그: 온보딩 상태에 따른 리다이렉트
    if (!isLoaded) return;
    if (!user) return;

    const onboardingCompleted = Boolean(user.unsafeMetadata?.onboardingCompleted);
    console.info('[DASHBOARD_V2_MONTHLY] user state', {
      userId: user.id,
      onboardingCompleted,
      level: user.unsafeMetadata?.level,
    });

    if (!onboardingCompleted) {
      console.info('[DASHBOARD_V2_MONTHLY] onboarding incomplete -> redirect to /onboarding/interests');
      router.push('/onboarding/interests');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
          <p className="text-slate-700">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <MonthlyNewsFeed
        variant="pearl"
        onBack={() => {
          // 핵심 UX 로그: 월간 뉴스에서 대시보드 v2로 돌아가기
          console.info('[DASHBOARD_V2_MONTHLY] back -> /dashboard-v2');
          router.push('/dashboard-v2');
        }}
      />
    </div>
  );
}

