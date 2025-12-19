"use client";

import { useEffect, useState } from "react";

// 별 데이터 타입
interface Star {
  id: number;
  left: string;
  top: string;
  size: number;
  opacity: number;
  animationDelay: string;
  animationDuration: string;
}

// 별 생성 함수 (클라이언트에서만 실행)
function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1, // 1~3px
    opacity: Math.random() * 0.5 + 0.3, // 0.3~0.8
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${Math.random() * 2 + 2}s`, // 2~4s
  }));
}

export function SpaceBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  // 클라이언트에서만 별 생성 (SSR 하이드레이션 문제 방지)
  useEffect(() => {
    console.info('[SPACE_BACKGROUND] generating stars');
    setStars(generateStars(150)); // 150개의 별 생성
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050814]">
      {/* 기본 우주 그라데이션 배경 */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(30, 58, 138, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(30, 64, 175, 0.1) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, #0a0f1a 0%, #050814 100%)
          `,
        }}
      />

      {/* 반짝이는 별들 */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: star.animationDelay,
              animationDuration: star.animationDuration,
              boxShadow: star.size > 2 
                ? `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.5)` 
                : 'none',
            }}
          />
        ))}
      </div>

      {/* 은하수 느낌의 희미한 빛 */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at 60% 30%, rgba(147, 197, 253, 0.08) 0%, transparent 40%),
            radial-gradient(ellipse at 40% 70%, rgba(167, 139, 250, 0.05) 0%, transparent 35%)
          `,
        }}
      />

      {/* Vignette 효과 (가장자리 어둡게) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
