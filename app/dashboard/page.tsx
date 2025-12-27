'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CalendarDays,
  LineChart,
  Newspaper,
  X,
  Ticket,
} from 'lucide-react';
import GlobeCanvas from '@/components/dashboard/GlobeCanvas';
import BoardingPassModal from '@/components/news/BoardingPassModal';

type PanelKey = 'today' | 'monthly' | 'cycle';

// ✅ Mock Data (API 준비 전까지)
const MOCK_DATA = {
  todayNews: [
    '미 연준, 금리 동결 시사 — 시장은 “인하 시점” 주목',
    '비트코인 변동성 확대… 현물 ETF 자금 유입/유출 혼조',
    '원/달러 환율 1,3xx원대 등락… 수출주 영향',
    'AI 반도체 공급망 재편… 대형주 중심 랠리 지속',
    '중국 경기 부양책 기대감… 원자재 가격 반등',
  ],
  monthlyBriefing: {
    summary:
      '이번 달은 “리스크 온/오프”가 빠르게 교차했습니다. 금리/환율/유가의 동시 변동이 커져 포트폴리오 분산이 중요합니다.',
    highlights: [
      '미국: 인플레이션 둔화 속 소비 지표 견조',
      '한국: 수출 회복 + 반도체 사이클 기대',
      '일본: 엔화 약세 지속, 수출주 강세',
      '유럽: 성장 둔화 우려, 에너지 가격 변수',
    ],
  },
  economicCycle: {
    phase: 'Recovery → Expansion (Mock)',
    indicators: [
      { name: 'PMI', value: 52.4, delta: +0.7 },
      { name: 'CPI YoY', value: 2.9, delta: -0.2 },
      { name: 'Unemployment', value: 3.9, delta: +0.1 },
      { name: '10Y Yield', value: 4.12, delta: +0.06 },
      { name: 'Oil (WTI)', value: 79.3, delta: +1.4 },
    ],
    note:
      '실제 데이터 연동 시 FRED/WorldBank 등으로 대체 가능합니다. 지금은 UI/UX 검증용 더미입니다.',
  },
} as const;


/**
 * Dashboard V2
 * - 기존 `/dashboard`는 그대로 두고, 새 디자인은 `/dashboard-v2`에서 개발하기 위한 페이지
 * - 핵심 흐름(인증/온보딩 리다이렉트)은 기존 대시보드와 동일하게 유지
 */
export default function DashboardV2Page() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);


  const openPanel = (key: PanelKey) => {
    // 핵심 기능 로그: 대시보드 버튼 클릭 → 페이지 이동
    console.info('[DASHBOARD] openPanel:', key);

    // PRD F4 요구사항: 오늘의 뉴스 클릭 시 관심분야별 TOP 5 목록 표시 (새 페이지)
    if (key === 'today') {
      console.log('Navigating to /news/today - 관심분야별 뉴스 목록 페이지');
      setActivePanel(null); // 모달 닫기
      router.push('/news/today');
      return;
    }

    // TODO: 이달의 뉴스도 새로운 페이지로 이동 (현재 미구현)
    if (key === 'monthly') {
      console.log('Navigating to /news/monthly - 월간 뉴스 브리핑 페이지');
      setActivePanel(null); // 모달 닫기
      router.push('/news/monthly');
      return;
    }

    // 경제 순환기 지도는 별도 페이지로 이동
    if (key === 'cycle') {
      console.log('Navigating to /cycle - 경제 순환기 지도 페이지');
      setActivePanel(null); // 모달 닫기
      router.push('/cycle');
      return;
    }

    // 다른 패널들은 모달로 유지
    console.log('Opening modal for:', key);
    setActivePanel(key);
  };

  const closePanel = () => {
    // 핵심 UX 로그: 모달 닫기
    console.info('[DASHBOARD] closePanel');
    setActivePanel(null);
  };

  useEffect(() => {
    console.info('[DASHBOARD] page loaded');
    
    // 🚀 페이지 미리 로드 (Prefetch) - 버튼 클릭 시 빠른 전환을 위해
    console.info('[DASHBOARD] prefetching pages for faster navigation');
    router.prefetch('/news/today');
    router.prefetch('/news/monthly');
    router.prefetch('/cycle');
  }, [router]);


  useEffect(() => {
    // 클라이언트 사이드에서만 리다이렉트 실행 (Hydration mismatch 방지)
    if (typeof window === 'undefined') return;

    // 핵심 기능 로그: 온보딩 상태에 따른 리다이렉트
    if (!isLoaded) return;
    if (!user) return;

    // 개발 단계에서는 publicMetadata와 unsafeMetadata 모두 확인 (Clerk 메타데이터 업데이트 문제 우회)
    const onboardingCompleted = Boolean(
      user.publicMetadata?.onboardingCompleted ||
      user.unsafeMetadata?.onboardingCompleted
    );
    const isNewUser = user.createdAt && (Date.now() - new Date(user.createdAt).getTime()) < 5 * 60 * 1000; // 5분 이내 가입한 사용자

    console.info('[DASHBOARD] user state', {
      userId: user.id,
      onboardingCompleted,
      publicMetadataOnboarding: user.publicMetadata?.onboardingCompleted,
      unsafeMetadataOnboarding: user.unsafeMetadata?.onboardingCompleted,
      level: (user.publicMetadata as Record<string, any>)?.userProfiles?.level || (user.unsafeMetadata as Record<string, any>)?.level,
      isNewUser,
      createdAt: user.createdAt,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.emailAddresses?.[0]?.emailAddress,
    });

    // 신규 사용자(5분 이내 가입)만 온보딩을 강제함
    // 이미 로그인된 기존 사용자는 온보딩을 건너뜀
    if (!onboardingCompleted && isNewUser) {
      console.info('[DASHBOARD] onboarding incomplete (new user) -> redirect to /onboarding/interests');
      router.push('/onboarding/interests');
    }
  }, [isLoaded, user, router]);


  // Hydration mismatch 방지를 위해 초기 로딩 상태에서는 항상 로딩 화면 표시
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
          <p className="text-slate-700">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트 (클라이언트 사이드에서만)
  if (!user) {
    router.push('/login');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
          <p className="text-slate-700">로그인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050814] text-white">
      {/* 3D Canvas Layer */}
      <GlobeCanvas />

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10">
        {/* Left Sidebar (Glassmorphism) */}
        <aside className="absolute right-4 top-4 bottom-4 w-[92vw] md:w-[min(40vw,560px)] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_30px_100px_-70px_rgba(0,0,0,0.9)]">
          <div className="flex h-full flex-col">
            {/* 상단바(헤더) 제거: 상단 공간 확보 */}
            <div className="pt-5" />

            <div className="mt-2 px-5">
              <button
                type="button"
                onClick={() => {
                  const passengerName = user ? (
                    user.fullName ||
                    `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                    user.username ||
                    user.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
                    'PREMIUM MEMBER'
                  ) : 'PREMIUM MEMBER';

                  const subscriptionStatus =
                    (user?.publicMetadata as Record<string, any>)?.subscription === 'premium' ||
                    (user?.publicMetadata as Record<string, any>)?.userProfiles?.level === 'premium' ||
                    (user?.unsafeMetadata as Record<string, any>)?.subscription === 'premium' ||
                    (user?.unsafeMetadata as Record<string, any>)?.level === 'premium' ||
                    ((user?.publicMetadata as Record<string, any>)?.trialEnds && new Date((user.publicMetadata as Record<string, any>).trialEnds) > new Date()) ||
                    ((user?.unsafeMetadata as Record<string, any>)?.trialEnds && new Date((user.unsafeMetadata as Record<string, any>).trialEnds) > new Date())
                      ? 'first_class'
                      : 'economy';

                  console.info('[DASHBOARD] click: boarding pass', {
                    passengerName,
                    subscriptionStatus,
                    publicMetadata: user?.publicMetadata,
                    unsafeMetadata: user?.unsafeMetadata,
                    userSubscription: user?.publicMetadata?.subscription || user?.unsafeMetadata?.subscription,
                    userLevel: (user?.publicMetadata as Record<string, any>)?.userProfiles?.level || (user?.unsafeMetadata as Record<string, any>)?.level,
                    userTrialEnds: user?.publicMetadata?.trialEnds || user?.unsafeMetadata?.trialEnds,
                    userFullName: user?.fullName,
                    userFirstName: user?.firstName,
                    userLastName: user?.lastName,
                    userUsername: user?.username,
                    userEmail: user?.emailAddresses?.[0]?.emailAddress,
                  });
                  setIsBoardingPassOpen(true);
                }}
                className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10 transition"
              >
                <div className="flex items-center justify-center gap-3">
                  <Ticket className="h-5 w-5 text-white/80" />
                  <div className="text-center">
                    <div className="text-sm font-semibold text-white">Boarding Pass</div>
                    <div className="text-xs text-white/60">My page</div>
                  </div>
                </div>
              </button>
            </div>

            {/* 바로가기: 남는 공간을 3개 버튼이 채우도록 */}
            <div className="mt-5 px-5 flex flex-col flex-1 min-h-0">
              <div className="text-xs text-white/50">바로가기</div>
              <div className="mt-3 flex flex-col gap-3 flex-1 min-h-0">
                <button
                  type="button"
                  onClick={() => openPanel('today')}
                  className="group w-full flex-1 min-h-[96px] rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-left hover:bg-white/10 transition"
                >
                  <div className="flex h-full items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Newspaper className="h-5 w-5 text-sky-200 group-hover:text-sky-100" />
                      <div>
                        <div className="text-lg md:text-xl font-semibold">오늘의 뉴스</div>
                        <div className="mt-1 text-sm md:text-base text-white/60">주요 헤드라인 요약</div>
                      </div>
                    </div>
                    <span className="text-sm text-white/45">열기</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => openPanel('monthly')}
                  className="group w-full flex-1 min-h-[96px] rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-left hover:bg-white/10 transition"
                >
                  <div className="flex h-full items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <CalendarDays className="h-5 w-5 text-violet-200 group-hover:text-violet-100" />
                      <div>
                        <div className="text-lg md:text-xl font-semibold">이달의 뉴스</div>
                        <div className="mt-1 text-sm md:text-base text-white/60">월간 브리핑</div>
                      </div>
                    </div>
                    <span className="text-sm text-white/45">열기</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => openPanel('cycle')}
                  className="group w-full flex-1 min-h-[96px] rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-left hover:bg-white/10 transition"
                >
                  <div className="flex h-full items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <LineChart className="h-5 w-5 text-emerald-200 group-hover:text-emerald-100" />
                      <div>
                        <div className="text-lg md:text-xl font-semibold">경제 순환기 지도</div>
                        <div className="mt-1 text-sm md:text-base text-white/60">지표로 보는 국면</div>
                      </div>
                    </div>
                    <span className="text-sm text-white/45">열기</span>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </aside>


        {/* Center Glass Modal - 경제 순환기 지도만 모달로 표시 */}
        {activePanel === 'cycle' && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center px-4"
            onClick={closePanel}
            role="presentation"
          >
            <div
              className="w-full max-w-2xl rounded-3xl border border-white/12 bg-black/35 backdrop-blur-2xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.95)]"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-start justify-between gap-4 px-6 pt-6">
                <div className="leading-tight">
                  <div className="text-xs text-white/60">In-flight briefing</div>
                  <div className="mt-1 text-xl font-semibold tracking-tight">
                    경제 순환기 지도
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  className="rounded-2xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
                  aria-label="닫기"
                >
                  <X className="h-4 w-4 text-white/80" />
                </button>
              </div>

              <div className="px-6 pb-6 pt-4">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/50">Phase</div>
                    <div className="mt-2 text-base font-semibold text-white/90">
                      {MOCK_DATA.economicCycle.phase}
                    </div>
                    <div className="mt-2 text-xs text-white/60">{MOCK_DATA.economicCycle.note}</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/50">Indicators (Mock)</div>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {MOCK_DATA.economicCycle.indicators.map((it) => (
                        <div
                          key={it.name}
                          className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-white/85">{it.name}</div>
                            <div
                              className={`text-xs ${
                                it.delta >= 0 ? 'text-emerald-200' : 'text-rose-200'
                              }`}
                            >
                              {it.delta >= 0 ? '+' : ''}
                              {it.delta}
                            </div>
                          </div>
                          <div className="mt-1 text-xl font-semibold text-white">{it.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 text-xs text-white/55">
                  <span>Tip: 바깥(배경)을 클릭해도 닫혀요.</span>
                  <button
                    type="button"
                    onClick={() => {
                      console.info('[DASHBOARD] click: modal close (footer)');
                      closePanel();
                    }}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 transition"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Boarding Pass Modal */}
        <BoardingPassModal
          isOpen={isBoardingPassOpen}
          onClose={() => setIsBoardingPassOpen(false)}
          newsTitle="News Insight"
          economicIndex="NIF-001"
          passengerName={
            user ? (
              user.fullName ||
              `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
              user.username ||
              user.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
              'PREMIUM MEMBER'
            ) : 'PREMIUM MEMBER'
          }
          subscriptionStatus='first_class'
        />
      </div>
    </div>
  );
}

