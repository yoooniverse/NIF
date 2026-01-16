"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// 3D 지구 컴포넌트를 동적으로 로드 (코드 분리 최적화)
const Earth3D = dynamic(
  () => import("@/components/landing/earth-3d").then(mod => ({ default: mod.Earth3D })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[#050814]">
        <div className="text-white/60 text-sm animate-pulse">고화질 지구 로딩 중...</div>
      </div>
    )
  }
);

interface LazyEarthProps {
  className?: string;
}

export function LazyEarth({ className }: LazyEarthProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [is3DLoaded, setIs3DLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          console.log("🌍 지구 컴포넌트가 뷰포트에 들어옴 - 성능 최적화를 위해 지연 로딩");

          // LCP/TBT 개선을 위해 메인 스레드가 안정된 후 로드 (2s 딜레이)
          const loadComponent = () => {
            setIsVisible(true);
            setHasLoaded(true);
          };

          if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => loadComponent());
          } else {
            setTimeout(loadComponent, 500);
          }

          // 관찰 중지
          observer.disconnect();
        }
      },
      {
        threshold: 0.1, // 10%가 보이면 로딩 트리거
        rootMargin: "100px" // 여유 공간
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded]);

  // 3D 컴포넌트 로딩 완료 콜백
  const handle3DLoad = () => {
    console.log("🎬 3D 지구 로딩 완료 - 전환 애니메이션 시작");
    setTimeout(() => setIs3DLoaded(true), 500); // 부드러운 전환을 위한 딜레이
  };

  return (
    <div ref={ref} className={`absolute inset-0 z-0 h-full w-full overflow-hidden ${className}`}>
      {isVisible ? (
        <>
          {/* 3D 컴포넌트 */}
          <div className={`transition-opacity duration-1000 ${is3DLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Earth3D onLoad={handle3DLoad} />
          </div>

          {/* 프로그레시브 로딩 단계 - CSS 기반 지구 애니메이션 */}
          {!is3DLoaded && <ProgressiveEarthPlaceholder />}
        </>
      ) : (
        // 초기 상태 - 최소한의 배경
        <div className="absolute inset-0 bg-[#050814]" />
      )}
    </div>
  );
}

// 프로그레시브 로딩을 위한 CSS 기반 지구 애니메이션
function ProgressiveEarthPlaceholder() {
  return (
    <div className="absolute inset-0 bg-[#050814] overflow-hidden">
      {/* 회전하는 지구 실루엣 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* 지구 본체 - CSS로 그린 간단한 지구 */}
          <div
            className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-600/30 via-cyan-500/20 to-green-500/30 animate-spin-slow relative overflow-hidden"
            style={{ animationDuration: '20s' }}
          >
            {/* 대륙 패턴 (간단한 CSS) */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-t from-green-800/20 to-blue-900/20" />
            <div className="absolute top-8 left-8 w-16 h-8 bg-green-700/30 rounded-full transform rotate-12" />
            <div className="absolute bottom-12 right-6 w-12 h-6 bg-green-700/30 rounded-full transform -rotate-12" />
          </div>

          {/* 도시 불빛 효과 */}
          <div className="absolute inset-0 rounded-full">
            <div className="absolute top-16 left-20 w-2 h-2 bg-yellow-400/60 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="absolute top-24 right-16 w-1.5 h-1.5 bg-orange-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-20 left-16 w-2 h-2 bg-yellow-300/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-16 right-24 w-1 h-1 bg-orange-500/60 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>

          {/* 대기권 후광 */}
          <div className="absolute -inset-8 rounded-full border-2 border-blue-400/20 animate-pulse" />
        </div>
      </div>

      {/* 배경 별들 - SpaceBackground와 조화 */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}
      </div>

      {/* 로딩 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="ml-2">고화질 지구 로딩 중...</span>
        </div>
      </div>
    </div>
  );
}