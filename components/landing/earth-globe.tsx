"use client";

import { useEffect, useState } from "react";

interface EarthGlobeProps {
  autoRotate?: boolean;
  animationSpeed?: number; // 초 단위 (기본값: 60초)
}

export function EarthGlobe({ 
  autoRotate = true, 
  animationSpeed = 60 
}: EarthGlobeProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // 접근성: prefers-reduced-motion 감지
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const shouldRotate = autoRotate && !prefersReducedMotion;

  return (
    <div className="flex items-center justify-center w-full">
      {/* 3D 컨테이너 */}
      <div 
        className="relative"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 40%",
        }}
      >
        {/* 지구 구체 (크기 증가로 웅장함 강조) */}
        <div
          className="earth-globe relative mx-auto"
          style={{
            width: "min(1000px, 90vw)",
            height: "min(1000px, 90vw)",
            transformStyle: "preserve-3d",
            animation: shouldRotate ? `rotate-earth ${animationSpeed}s linear infinite` : "none",
            // 반구 모양으로 클리핑 (하단이 잘린 반원)
            clipPath: "ellipse(50% 45% at 50% 55%)",
          }}
        >
          {/* 야간 지구 표면 */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, #0a1929 0%, #020617 40%, #000000 100%),
                radial-gradient(circle at 65% 45%, #0c2340 0%, transparent 35%),
                radial-gradient(circle at 40% 60%, #0f1f3d 0%, transparent 30%)
              `,
              backgroundBlendMode: "normal, screen, screen",
              boxShadow: `
                inset -60px -60px 120px rgba(0, 0, 0, 0.9),
                inset 30px 30px 80px rgba(100, 150, 255, 0.05),
                0 0 150px rgba(59, 130, 246, 0.5)
              `,
            }}
          >
            {/* 도시 불빛 레이어 (유럽, 아시아, 북미 스타일) */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(ellipse at 45% 40%, rgba(255, 220, 150, 0.4) 0%, transparent 8%),
                  radial-gradient(ellipse at 52% 42%, rgba(255, 220, 150, 0.3) 0%, transparent 6%),
                  radial-gradient(ellipse at 38% 45%, rgba(255, 220, 150, 0.3) 0%, transparent 5%),
                  radial-gradient(ellipse at 60% 38%, rgba(255, 220, 150, 0.35) 0%, transparent 7%),
                  radial-gradient(ellipse at 48% 50%, rgba(255, 220, 150, 0.25) 0%, transparent 4%),
                  radial-gradient(ellipse at 42% 52%, rgba(255, 220, 150, 0.3) 0%, transparent 5%),
                  radial-gradient(ellipse at 55% 45%, rgba(255, 220, 150, 0.25) 0%, transparent 6%),
                  radial-gradient(circle at 50% 48%, rgba(255, 220, 150, 0.15) 0%, transparent 20%)
                `,
                mixBlendMode: "lighten",
                opacity: 0.8,
              }}
            />

            {/* 대륙 윤곽 (미묘한 지형) */}
            <div
              className="absolute inset-0 rounded-full opacity-10"
              style={{
                background: `
                  radial-gradient(circle at 50% 45%, #1e3a5f 0%, transparent 25%),
                  radial-gradient(circle at 35% 50%, #1a334d 0%, transparent 20%),
                  radial-gradient(circle at 65% 42%, #1e3a5f 0%, transparent 18%)
                `,
              }}
            />
          </div>

          {/* 대기권 후광 (파란 빛) */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, transparent 60%, rgba(59, 130, 246, 0.6) 70%, rgba(147, 197, 253, 0.3) 80%, transparent 90%)",
              filter: "blur(15px)",
            }}
          />

          {/* 추가 광채 효과 */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, transparent 65%, rgba(100, 150, 255, 0.3) 75%, transparent 85%)",
              filter: "blur(20px)",
            }}
          />
        </div>
      </div>

      {/* NASA 이미지 사용 안내 주석 */}
      {/* 
        더 사실적인 지구를 원하신다면 NASA Blue Marble 이미지를 다운로드하세요:
        URL: https://visibleearth.nasa.gov/images/57752/blue-marble-land-surface-shallow-water-and-shaded-topography
        
        다운로드 후 public/earth/earth-texture.jpg로 저장하고,
        위 배경 스타일을 다음과 같이 변경하세요:
        background: url('/earth/earth-texture.jpg')
        backgroundSize: 'cover'
        backgroundPosition: 'center'
      */}
    </div>
  );
}
