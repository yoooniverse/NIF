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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* 네비게이션 헤더 - Apple 스타일 */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group font-medium"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm tracking-wide">홈으로</span>
            </Link>
            <div className="text-sm text-gray-500 font-medium tracking-wide">
              News In Flight
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
  );
}