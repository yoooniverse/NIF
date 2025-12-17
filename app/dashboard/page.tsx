'use client';

import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CalendarDays, CloudSun, Map, Newspaper } from "lucide-react";

type ActivePanel = "monthly" | "today" | "map";

function FuselageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* 1) The Fuselage Skin (3D cylindrical) */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-b from-white via-slate-50 to-slate-200
        "
      />

      {/* Curvature + vignette to feel like a cylinder */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(1200px_700px_at_50%_18%,rgba(255,255,255,0.95),rgba(255,255,255,0.35),rgba(2,6,23,0.10))]
          opacity-70
        "
      />
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(900px_700px_at_50%_55%,rgba(255,255,255,0.55),rgba(255,255,255,0),rgba(2,6,23,0.10))]
          opacity-60
        "
      />

      {/* 1-Details) Panel lines */}
      <div className="absolute left-0 right-0 top-[18%] h-px bg-slate-300/55" />
      <div className="absolute left-0 right-0 top-[19%] h-px bg-white/70" />
      <div className="absolute left-0 right-0 top-[78%] h-px bg-slate-300/40" />

      {/* 1-Details) Rivets pattern along panel lines */}
      <div
        className="absolute left-0 right-0 top-[17.4%] h-6 opacity-55"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(148,163,184,0.55) 1px, rgba(148,163,184,0) 2px)",
          backgroundSize: "26px 10px",
          backgroundPosition: "0 50%",
        }}
      />
      <div
        className="absolute left-0 right-0 top-[77.4%] h-6 opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(148,163,184,0.45) 1px, rgba(148,163,184,0) 2px)",
          backgroundSize: "28px 10px",
          backgroundPosition: "10px 50%",
        }}
      />

      {/* 2) Celestial Blue Cheatline */}
      <div className="absolute inset-x-0 top-[56%]">
        {/* 끊기지 않는 전체 폭 스트라이프 */}
        <div
          className="
            relative h-10
            bg-gradient-to-r from-sky-300 via-sky-300 to-blue-400
            border-y border-white/60
            shadow-[0_18px_50px_-40px_rgba(2,6,23,0.65)]
            overflow-hidden
          "
        >
          {/* subtle sheen */}
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.25)_45%,rgba(255,255,255,0)_70%)] opacity-50" />
          {/* thin silver edges */}
          <div className="absolute inset-x-0 top-0 h-px bg-slate-200/80" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-slate-200/70" />
        </div>
      </div>
    </div>
  );
}

function WindowCapsule({
  label,
  Icon,
  variant,
  isActive,
  onClick,
}: {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  variant: "main" | "dummy";
  isActive?: boolean;
  onClick?: () => void;
}) {
  const commonShell = `
    relative
    w-[clamp(150px,16vw,220px)]
    aspect-[11/18]
    rounded-full
  `;

  if (variant === "dummy") {
    return (
      <div
        aria-hidden="true"
        className={`
          ${commonShell}
          overflow-hidden
          border-[10px] border-slate-200
          bg-gradient-to-b from-white via-slate-50 to-slate-200
          shadow-[0_12px_24px_-18px_rgba(2,6,23,0.35)]
          opacity-95
        `}
      >
        {/* Inner wall (depth) */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_14px_26px_rgba(2,6,23,0.30)]" />

        {/* Inner bezel */}
        <div className="absolute inset-[10px] rounded-full border-[10px] border-slate-100 shadow-[inset_0_10px_20px_rgba(2,6,23,0.20)]" />

        {/* Window shade (closed) */}
        <div className="absolute inset-[28px] rounded-full bg-gradient-to-b from-slate-200 via-slate-200 to-slate-300 shadow-[inset_0_18px_34px_rgba(2,6,23,0.22)]" />

        {/* Shade slats */}
        <div
          className="absolute inset-[28px] rounded-full opacity-55"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to_bottom, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 2px, rgba(2,6,23,0.00) 10px, rgba(2,6,23,0.00) 16px)",
          }}
        />

        {/* Subtle inner edge */}
        <div className="absolute inset-[28px] rounded-full border border-white/35" />
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`
        ${commonShell}
        cursor-pointer
        overflow-hidden
        border-[10px] border-slate-200
        shadow-[0_14px_28px_-20px_rgba(2,6,23,0.45)]
        focus:outline-none
        ${isActive ? "ring-2 ring-sky-300/80" : "ring-1 ring-slate-300/50"}
      `}
      whileHover={{ scale: 1.035, y: -8 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
    >
      {/* Outer rim molding */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-200" />

      {/* Inner wall (strong depth) */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_16px_30px_rgba(0,0,0,0.32),inset_0_-14px_26px_rgba(0,0,0,0.18)]" />

      {/* Inner bezel layer */}
      <div className="absolute inset-[10px] rounded-full border-[10px] border-slate-100 shadow-[inset_0_10px_20px_rgba(0,0,0,0.22)]" />

      {/* Glass (vignette + reflection) */}
      <div className="absolute inset-[28px] rounded-full overflow-hidden">
        {/* base tint */}
        <div className="absolute inset-0 bg-[#0F172A]" />

        {/* top reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200/20 via-transparent to-white/5" />
        <div className="absolute -top-10 left-8 right-8 h-44 rotate-[-12deg] bg-white/16 blur-2xl" />

        {/* vignette (edges darker) */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_40%,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.02)_45%,rgba(2,6,23,0.75)_100%)]" />

        {/* depth shadow */}
        <div className="absolute inset-0 shadow-[inset_0_24px_70px_rgba(2,6,23,0.60)]" />
      </div>

      {/* Shade handle (top center) */}
      <div className="absolute top-[34px] left-1/2 -translate-x-1/2 z-20 h-[6px] w-20 rounded-full bg-slate-400/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]" />

      {/* content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        <div className="grid place-items-center rounded-3xl border border-white/15 bg-white/5 px-5 py-5 backdrop-blur-sm">
          <Icon className="h-12 w-12 text-white" />
        </div>
        <div className="mt-6 max-w-[14rem] text-[clamp(14px,1.25vw,20px)] font-semibold leading-tight tracking-tight text-white whitespace-pre-line break-keep">
          {label}
        </div>
        <div className="mt-2 text-xs text-white/70">열기</div>
      </div>
    </motion.button>
  );
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activePanel, setActivePanel] = useState<ActivePanel>("today");

  useEffect(() => {
    console.log("[DASHBOARD] 대시보드 페이지 로드");
    console.log("[DASHBOARD] 사용자 정보:", {
      userId: user?.id,
      email: user?.emailAddresses[0]?.emailAddress,
      onboardingCompleted: user?.unsafeMetadata?.onboardingCompleted,
      level: user?.unsafeMetadata?.level,
    });

    // 온보딩을 완료하지 않은 사용자는 온보딩 페이지로 리다이렉트
    if (isLoaded && user && !user.unsafeMetadata?.onboardingCompleted) {
      console.log("[DASHBOARD] 온보딩 미완료 - 온보딩 페이지로 이동");
      router.push('/onboarding/interests');
    }
  }, [user, isLoaded, router]);

  useEffect(() => {
    // 핵심 기능 로그: 창문 네비 선택(탭 전환)
    console.info("[DASHBOARD] activePanel changed:", activePanel);
  }, [activePanel]);

  useEffect(() => {
    // 핵심 UX: 대시보드에서는 스크롤을 완전히 잠금(비행기 동체 화면 고정)
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    console.info("[DASHBOARD] scroll locked");

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      console.info("[DASHBOARD] scroll unlocked");
    };
  }, []);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen relative text-slate-900 overflow-hidden">
      {/* Korean Air vibe: Fuselage Exterior */}
      <FuselageBackground />

      {/* Header: 오버헤드 패널 느낌의 미니멀 글래스 바 */}
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
          <div className="
            rounded-2xl
            border border-white/60
            bg-white/55 backdrop-blur-xl
            shadow-[0_18px_60px_-35px_rgba(2,6,23,0.8)]
          ">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="
                  h-10 w-10 rounded-xl
                  bg-gradient-to-br from-slate-900 to-slate-700
                  shadow-[0_10px_30px_-18px_rgba(2,6,23,0.9)]
                  flex items-center justify-center
                ">
                  <span className="text-white text-sm font-semibold">NIF</span>
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold tracking-tight text-slate-900">
                    News In Flight
                  </div>
                  <div className="text-xs text-slate-600">
                    First Class Insight
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2 rounded-xl border border-white/50 bg-white/40 px-3 py-2">
                  <CloudSun className="h-4 w-4 text-slate-700" />
                  <span>서울 · 맑음 · 18°C</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/50 bg-white/40 px-3 py-2">
                  <CalendarDays className="h-4 w-4 text-slate-700" />
                  <span>무료 체험</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => console.info("[DASHBOARD] click: notifications")}
                  className="
                    relative
                    rounded-xl
                    border border-white/50
                    bg-white/40 backdrop-blur
                    px-3 py-2
                    shadow-sm hover:shadow
                    transition
                  "
                  aria-label="알림"
                >
                  <Bell className="h-4 w-4 text-slate-800" />
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white/70" />
                </button>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="relative z-20 w-full px-4 sm:px-6 lg:px-10">
        <section className="h-[calc(100vh-108px)] flex items-center justify-center">
          {/* 3) The Window Line */}
          <motion.div
            className="w-full"
            initial={{ x: 140, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            onAnimationStart={() => console.info("[DASHBOARD] taxiing animation start")}
          >
            <div className="grid w-full grid-cols-5 place-items-center gap-4 sm:gap-6 lg:gap-8">
              {/* Dummy - MAIN - MAIN - MAIN - Dummy (총 5개) */}
              <WindowCapsule label="" Icon={CalendarDays} variant="dummy" />

              {/* MAIN 1-3 */}
              <WindowCapsule
                label="이달의 뉴스"
                Icon={CalendarDays}
                variant="main"
                isActive={activePanel === "monthly"}
                onClick={() => {
                  console.info("[DASHBOARD] click window: monthly");
                  setActivePanel("monthly");
                }}
              />
              <WindowCapsule
                label="오늘의 뉴스"
                Icon={Newspaper}
                variant="main"
                isActive={activePanel === "today"}
                onClick={() => {
                  console.info("[DASHBOARD] click window: today");
                  setActivePanel("today");
                }}
              />
              <WindowCapsule
                label={"경제\n순환기 지도"}
                Icon={Map}
                variant="main"
                isActive={activePanel === "map"}
                onClick={() => {
                  console.info("[DASHBOARD] click window: map");
                  setActivePanel("map");
                }}
              />

              <WindowCapsule label="" Icon={CalendarDays} variant="dummy" />
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
