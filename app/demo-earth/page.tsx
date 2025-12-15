"use client";

import { InFlightEarth } from "@/components/landing/in-flight-earth";
import { SpaceBackground } from "@/components/landing/space-background";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DemoEarthPage() {
  console.log("🎬 In-Flight Earth 데모 페이지 로드됨");

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* 우주 배경 */}
      <SpaceBackground />

      {/* 뒤로 가기 버튼 */}
      <div className="absolute top-6 left-6 z-50">
        <Link 
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg text-white hover:bg-slate-800/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>홈으로</span>
        </Link>
      </div>

      {/* 제목 & 설명 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          ✈️ In-Flight Entertainment Earth
        </h1>
        <p className="text-slate-300 text-sm">
          LAX (Los Angeles) → ATL (Atlanta) 비행 경로를 따라가는 3D 지구
        </p>
      </div>

      {/* 사용 안내 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg px-6 py-3">
          <div className="flex items-center gap-6 text-slate-300 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">🖱️</span>
              <span>마우스 드래그: 회전</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">🔍</span>
              <span>스크롤: 줌</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">✈️</span>
              <span>비행기가 경로를 따라 이동합니다</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D 지구 컴포넌트 */}
      <div className="absolute inset-0">
        <InFlightEarth />
      </div>
    </div>
  );
}
