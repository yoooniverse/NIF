"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturesSection } from "@/components/landing/features-section";
import { SocialProofSection } from "@/components/landing/social-proof-section";
import { Footer } from "@/components/landing/footer";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  console.log("📖 서비스 소개 페이지 로드됨");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a2e] via-[#1a1a3e] to-[#f8fafc]">
      {/* 상단 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a2e]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">돌아가기</span>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="shadow-lg">
              무료 체험 시작
            </Button>
          </Link>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <div className="pt-20">
        {/* Features Section */}
        <div id="features">
          <FeaturesSection />
        </div>

        {/* Social Proof Section */}
        <div className="bg-gradient-to-b from-[#2a2a4e] via-[#3a3a5e] to-[#f8fafc]">
          <SocialProofSection />
        </div>

        {/* 마지막 CTA */}
        <section className="py-24 px-4 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              지금 바로 경제 뉴스의 새로운 경험을 시작하세요
            </h2>
            <p className="text-xl text-white/90">
              오늘부터 30일 동안 무료로 모든 기능을 사용해보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="text-lg px-12 py-6 bg-white text-blue-600 hover:bg-white/90 shadow-2xl"
                >
                  무료 체험 시작하기
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-12 py-6 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  랜딩으로 돌아가기
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}


