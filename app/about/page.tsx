"use client";

import { FeaturesSection } from "@/components/landing/features-section";
import { SocialProofSection } from "@/components/landing/social-proof-section";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  console.log("📄 상세 페이지 로드됨 - Apple 디자인 스타일");

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/textures/airport-night.png.png')"
      }}
    >
      {/* 어두운 오버레이로 텍스트 가독성 확보 */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* 내용 컨테이너 */}
      <div className="relative z-10">
        {/* 네비게이션 헤더 - 비행기 티켓 디자인 */}
        <nav className="sticky top-0 z-50 bg-sky-100/95 backdrop-blur-xl border-b border-sky-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 티켓 스타일 왼쪽 정보 */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-sky-50 text-sky-800 transition-colors group font-medium shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm tracking-wide">홈으로</span>
              </Link>
              <div className="hidden md:flex items-center gap-2">
                <div className="text-xs font-semibold text-sky-700 uppercase tracking-wider">FLIGHT</div>
                <div className="text-sm font-mono font-bold text-sky-900 bg-white px-3 py-1 rounded-lg shadow-sm">
                  NIF-001
                </div>
              </div>
            </div>

            {/* 티켓 스타일 중앙 로고 */}
            <div className="flex-1 flex justify-center">
              <div className="bg-white px-6 py-3 rounded-full border-2 border-sky-300 shadow-sm">
                <div className="text-lg font-bold text-sky-900 font-mono tracking-wider">
                  NEWS IN FLIGHT
                </div>
              </div>
            </div>

            {/* 티켓 스타일 오른쪽 정보 */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-xs font-semibold text-sky-700 uppercase tracking-wider">CLASS</div>
              <div className="text-sm font-mono font-bold text-sky-900 bg-white px-3 py-1 rounded-lg shadow-sm">
                ECONOMY
              </div>
            </div>

            {/* 모바일용 간단 버전 */}
            <div className="md:hidden">
              <div className="text-sm text-sky-700 font-medium tracking-wide">
                News In Flight
              </div>
            </div>
          </div>

          {/* 티켓 스타일 보조 정보 바 */}
          <div className="mt-3 flex items-center justify-between text-xs text-sky-700 border-t border-sky-200 pt-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold">FROM:</span>
                <span className="font-mono bg-white px-2 py-1 rounded shadow-sm">SEOUL/ICN</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">TO:</span>
                <span className="font-mono bg-white px-2 py-1 rounded shadow-sm">ECONOMIC INSIGHT</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold">GATE:</span>
                <span className="font-mono bg-black text-white px-2 py-1 rounded shadow-sm">AI-01</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Features Section - Apple 스타일 오버라이드 */}
      <section id="features" className="apple-design">
        <FeaturesSection />
      </section>

      {/* Social Proof Section - Apple 스타일 오버라이드 */}
      <section className="apple-design">
        <SocialProofSection />
      </section>

      {/* Footer - Apple 스타일 오버라이드 */}
      <section className="apple-design">
        <Footer />
      </section>

      {/* 플로팅 CTA 버튼 - Apple 스타일 */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/signup">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-6 py-3 font-medium tracking-wide"
          >
            지금 시작하기
          </Button>
        </Link>
      </div>
      </div>
    </div>
  );
}