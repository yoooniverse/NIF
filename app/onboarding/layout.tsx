"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";

/**
 * 공항 출발 안내판 스타일 온보딩 레이아웃
 * Dark theme: #121212 배경에 Amber(#FFB800)와 White 텍스트
 * 가로로 긴 직사각형 전광판 스타일
 */
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 현재 스텝 계산
  const getCurrentStep = () => {
    if (pathname.includes("/interests")) return 1;
    if (pathname.includes("/contexts")) return 2;
    if (pathname.includes("/level")) return 3;
    return 1;
  };

  // 페이지별 헤더 텍스트
  const getPageTitle = () => {
    if (pathname.includes("/interests")) return "DEPARTURES: 관심분야 선택하기";
    if (pathname.includes("/contexts")) return "DEPARTURES: 나의 상황 선택하기";
    if (pathname.includes("/level")) return "DEPARTURES: 뉴스 해설 레벨 선택하기";
    return "DEPARTURES: 관심분야 선택하기";
  };

  const currentStep = getCurrentStep();
  const pageTitle = getPageTitle();

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 overflow-x-auto">
      {/* 공항 출발 안내판 컨테이너 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl min-h-[600px]"
      >
        {/* 전광판 본체 */}
        <div className="bg-black border-4 border-[#FFB800]/30 rounded-lg shadow-2xl overflow-hidden">
          {/* 상단 헤더 - DEPARTURES */}
          <div className="bg-[#FFB800] text-black px-8 py-4 border-b-4 border-[#FFB800]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* 로고 */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-lg"
                >
                  <Plane className="w-6 h-6 text-white" strokeWidth={2.5} />
                </motion.div>

                {/* DEPARTURES 텍스트 */}
                <motion.h1
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="text-3xl font-bold font-mono tracking-wider"
                >
                  {pageTitle}
                </motion.h1>
              </div>

              {/* 현재 시간 표시 */}
              <div className="text-right">
                <div className="text-sm font-mono opacity-75">LOCAL TIME</div>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                  className="text-lg font-mono font-bold"
                >
                  {new Date().toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </motion.div>
              </div>
            </div>
          </div>

          {/* 전광판 그리드 헤더 */}
          <div className="bg-[#FFB800]/10 border-b-2 border-[#FFB800]/30 px-8 py-3">
            <div className="grid grid-cols-12 gap-4 text-sm font-mono font-bold text-[#FFB800] uppercase tracking-wider">
              <div className="col-span-1 text-center">STEP</div>
              <div className="col-span-4">DESTINATION</div>
              <div className="col-span-2 text-center">GATE</div>
              <div className="col-span-2 text-center">STATUS</div>
              <div className="col-span-3 text-center">REMARKS</div>
            </div>
          </div>

          {/* 메인 컨텐츠 영역 */}
          <div className="min-h-[500px]">
            {children}
          </div>

          {/* 하단 네비게이션 */}
          <div className="bg-[#FFB800]/5 border-t-2 border-[#FFB800]/20 px-8 py-6">
            <div className="flex items-center justify-between">
              {/* 진행 상황 표시 */}
              <div className="flex items-center gap-4">
                <div className="text-[#FFB800] font-mono text-sm">
                  PROGRESS: {currentStep}/3
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((step) => (
                    <motion.div
                      key={step}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: step * 0.1 }}
                      className={`w-3 h-3 rounded-full border-2 ${
                        step <= currentStep
                          ? "bg-[#FFB800] border-[#FFB800]"
                          : "border-[#FFB800]/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 시스템 상태 */}
              <div className="flex items-center gap-4 text-xs font-mono text-white/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>SYSTEM ONLINE</span>
                </div>
                <div>NIF-{currentStep.toString().padStart(2, "0")}/03</div>
              </div>
            </div>
          </div>
        </div>

        {/* 전광판 주변 빛 효과 */}
        <div className="absolute inset-0 -z-10 bg-[#FFB800]/5 blur-3xl rounded-lg transform scale-105" />
      </motion.div>

      {/* 배경 패턴 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,184,0,0.05),transparent_70%)]" />
        {/* 도트 패턴 */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
      </div>
    </div>
  );
}


