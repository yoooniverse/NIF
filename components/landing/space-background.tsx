"use client";

export function SpaceBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* In-flight map 스타일 우주 배경 (더 밝고 깨끗한) */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at top, #2563eb 0%, #1e3a8a 30%, #0f172a 60%, #000814 100%),
            radial-gradient(ellipse at 80% 40%, #3b82f6 0%, transparent 40%),
            radial-gradient(ellipse at 20% 70%, #1e40af 0%, transparent 40%)
          `,
          backgroundBlendMode: "normal, screen, screen",
        }}
      />

      {/* 상단 밝은 빛 효과 (태양 후광) */}
      <div 
        className="absolute -top-1/3 left-1/4 w-2/3 h-2/3"
        style={{
          background: "radial-gradient(ellipse at center, rgba(147, 197, 253, 0.25) 0%, rgba(59, 130, 246, 0.15) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* 추가 밝은 영역 (오른쪽 상단) */}
      <div 
        className="absolute -top-1/4 right-0 w-1/2 h-1/2"
        style={{
          background: "radial-gradient(circle at center, rgba(191, 219, 254, 0.2) 0%, transparent 60%)",
          filter: "blur(70px)",
        }}
      />
    </div>
  );
}
