import { LandingHeader } from "@/components/landing/landing-header";
import { LandingCTA } from "@/components/landing/landing-cta";
import { ClientSpaceBackground } from "@/components/landing/client-space-background";
import { ClientLazyEarth } from "@/components/landing/client-lazy-earth";

export default function LandingPage() {
  console.log("🌍 랜딩 페이지 서버 렌더링 (Static Shell)");

  return (
    <div className="h-screen overflow-hidden bg-[#050814]">
      {/* Hero Section - In-Flight Entertainment 스타일 3D 지구 */}
      <section className="relative h-screen overflow-hidden">
        {/* 우주 배경 (Client Only) */}
        <ClientSpaceBackground />

        {/* 3D 지구 컴포넌트 (Client Only) */}
        <ClientLazyEarth />

        {/* 우측 상단 인증 버튼 (Client) */}
        <LandingHeader />

        {/* 메인 카피 (화면 중앙에 부유 - Server Rendered for SEO & LCP) */}
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
              경제뉴스가 어렵나요?
              <br />
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                가난은 더 어렵습니다
              </span>
            </h1>

            {/* 서브 카피 */}
            <p className="text-base md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-lg px-4">
              경제 문맹 탈출, News In Flight면 하루 5분으로 끝납니다
            </p>

            {/* CTA 버튼 (Client - Auth Dependent) */}
            <LandingCTA />

            {/* 무료 체험 안내 */}
            <p className="text-xs md:text-sm text-white/60 pt-4 px-4">
              💳 신용카드 등록 없이 서비스 이용하기
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}
