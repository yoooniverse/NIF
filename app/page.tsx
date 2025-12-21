"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

const SpaceBackground = dynamic(
  () => import("@/components/landing/space-background").then((mod) => mod.SpaceBackground),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#050814]" />
  }
);

const LazyEarth = dynamic(
  () => import("@/components/landing/lazy-earth").then((mod) => mod.LazyEarth),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#050814]" />
  }
);

export default function LandingPage() {
  console.log("🌍 랜딩 페이지 로드됨 - Hero Section Only");

  return (
    <div className="h-screen overflow-hidden">
      {/* Hero Section - In-Flight Entertainment 스타일 3D 지구 */}
      <section className="relative h-screen overflow-hidden">
        {/* 우주 배경 */}
        <SpaceBackground />

        {/* 3D 지구 컴포넌트 - Lazy Loading으로 성능 최적화 */}
        <LazyEarth />

        {/* 우측 상단 로그인 버튼 */}
        <div className="absolute top-6 right-6 z-20">
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <Button
              variant="outline"
              size="default"
              className="bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-black/40 hover:border-white/40 transition-all duration-300 px-4 py-2 text-sm font-medium"
              onClick={() => console.log("🔐 랜딩페이지 로그인 버튼 클릭됨")}
            >
              <LogIn className="w-5 h-5 mr-2" />
              로그인
            </Button>
          </SignInButton>
        </div>

        {/* 메인 카피 (화면 중앙에 부유) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 pointer-events-none">
          <div
            className="text-center space-y-6 md:space-y-8 pointer-events-auto max-w-4xl"
            style={{
              animation: "fade-in-up 1s ease-out 0.3s both",
            }}
          >
            {/* 상단 인디케이터 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <span className="text-xs md:text-sm font-mono text-blue-300">BOARDING NOW</span>
            </div>

            {/* 메인 카피 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-2xl px-4">
              경제 뉴스는 정보가 아니라
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                생존입니다
              </span>
            </h1>

            {/* 서브 카피 */}
            <p className="text-base md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-lg px-4">
              AI가 당신의 눈높이에 맞춰 경제 뉴스를 해석해드립니다
            </p>

            {/* CTA 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 px-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6 bg-black/80 backdrop-blur-md border-white/20 text-white hover:bg-black hover:border-white/40 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 group"
                >
                  30일 무료로 시작하기
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6 bg-black/80 backdrop-blur-md border-white/20 text-white hover:bg-black hover:border-white/40 transition-all duration-300"
                >
                  자세히 알아보기
                </Button>
              </Link>
            </div>

            {/* 무료 체험 안내 */}
            <p className="text-xs md:text-sm text-white/60 pt-4 px-4">
              💳 신용카드 등록 없이 30일 무료 체험
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}
