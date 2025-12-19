"use client";

import { Plane, Loader2 } from "lucide-react";

/**
 * 온보딩 페이지 로딩 스켈레톤 UI
 * 공항 출발 안내판 스타일 유지
 */
export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      {/* 공항 출발 안내판 컨테이너 */}
      <div className="w-full max-w-7xl min-h-[600px]">
        {/* 전광판 본체 */}
        <div className="bg-black border-4 border-[#FFB800]/30 rounded-lg shadow-2xl overflow-hidden">
          {/* 상단 헤더 - DEPARTURES */}
          <div className="bg-[#FFB800] text-black px-8 py-4 border-b-4 border-[#FFB800]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* 로고 */}
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-lg">
                  <Plane className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>

                {/* DEPARTURES 텍스트 스켈레톤 */}
                <div className="h-8 w-64 bg-black/20 rounded animate-pulse" />
              </div>

              {/* 현재 시간 표시 */}
              <div className="text-right">
                <div className="text-sm font-mono opacity-75">LOCAL TIME</div>
                <div className="text-lg font-mono font-bold">
                  {new Date().toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
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

          {/* 메인 컨텐츠 영역 - 스켈레톤 행들 */}
          <div className="min-h-[500px]">
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-[#FFB800]/20"
              >
                {/* STEP 스켈레톤 */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="h-8 w-8 bg-[#FFB800]/20 rounded animate-pulse" />
                </div>

                {/* DESTINATION 스켈레톤 */}
                <div className="col-span-4 flex items-center">
                  <div className="h-6 w-32 bg-[#FFB800]/20 rounded animate-pulse" />
                </div>

                {/* GATE 스켈레톤 */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="h-6 w-8 bg-[#FFB800]/20 rounded animate-pulse" />
                </div>

                {/* STATUS 스켈레톤 */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="h-6 w-20 bg-[#FFB800]/20 rounded animate-pulse" />
                </div>

                {/* REMARKS 스켈레톤 */}
                <div className="col-span-3 flex items-center">
                  <div className="h-6 w-36 bg-[#FFB800]/20 rounded animate-pulse" />
                </div>
              </div>
            ))}

            {/* 로딩 인디케이터 */}
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-[#FFB800] animate-spin mb-3" />
              <div className="text-[#FFB800] font-mono text-sm animate-pulse">
                LOADING DEPARTURE BOARD...
              </div>
            </div>
          </div>

          {/* 하단 네비게이션 */}
          <div className="bg-[#FFB800]/5 border-t-2 border-[#FFB800]/20 px-8 py-6">
            <div className="flex items-center justify-between">
              {/* 진행 상황 표시 */}
              <div className="flex items-center gap-4">
                <div className="text-[#FFB800] font-mono text-sm">
                  PROGRESS: -/3
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className="w-3 h-3 rounded-full border-2 border-[#FFB800]/30"
                    />
                  ))}
                </div>
              </div>

              {/* 시스템 상태 */}
              <div className="flex items-center gap-4 text-xs font-mono text-white/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <span>CONNECTING...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 배경 패턴 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,184,0,0.05),transparent_70%)]" />
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
      </div>
    </div>
  );
}
