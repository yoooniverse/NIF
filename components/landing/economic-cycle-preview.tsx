"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from "lucide-react";

export function EconomicCyclePreview() {
  console.log("📊 경제 순환기 미리보기 렌더링 - 사계절 순환 애니메이션");

  const [activePhase, setActivePhase] = useState(0);

  const phases = [
    {
      id: 0,
      name: "회복기",
      nameEn: "Recovery",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-300",
      icon: TrendingUp,
      description: "경기가 바닥에서 회복되는 시기",
      characteristics: ["금리 하락", "실업률 감소", "소비 증가"],
    },
    {
      id: 1,
      name: "확장기",
      nameEn: "Expansion",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-300",
      icon: Activity,
      description: "경제가 성장하는 시기",
      characteristics: ["GDP 상승", "투자 증가", "고용 확대"],
    },
    {
      id: 2,
      name: "둔화기",
      nameEn: "Slowdown",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-300",
      icon: TrendingDown,
      description: "성장세가 둔화되는 시기",
      characteristics: ["성장률 하락", "인플레이션 상승", "금리 인상"],
    },
    {
      id: 3,
      name: "침체기",
      nameEn: "Recession",
      color: "from-red-400 to-rose-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-300",
      icon: AlertTriangle,
      description: "경기가 후퇴하는 시기",
      characteristics: ["GDP 감소", "실업률 증가", "소비 위축"],
    },
  ];

  useEffect(() => {
    console.log("🔄 경제 순환기 자동 애니메이션 시작");
    const interval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % 4);
    }, 3000); // 3초마다 순환

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-video rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden border border-gray-200">
      {/* 중앙 순환 다이어그램 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-[600px] max-h-[600px]">
          {/* 순환 원 */}
          {phases.map((phase, index) => {
            const angle = (index * 90 - 45) * (Math.PI / 180); // 각도 계산
            const radius = 200; // 140 → 200으로 증가
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const Icon = phase.icon;
            const isActive = activePhase === index;

            return (
              <div
                key={phase.id}
                className="absolute top-1/2 left-1/2 transition-all duration-500"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isActive ? 1.1 : 0.9})`,
                }}
              >
                {/* 카드 */}
                <div
                  className={`
                    w-40 h-40 rounded-2xl shadow-lg transition-all duration-500 flex flex-col items-center justify-center
                    ${isActive ? `${phase.bgColor} ${phase.borderColor} border-2 scale-110` : 'bg-white border border-gray-200'}
                  `}
                >
                  <div
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-500
                      ${isActive ? `bg-gradient-to-br ${phase.color}` : 'bg-gray-100'}
                    `}
                  >
                    <Icon className={`w-8 h-8 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div
                    className={`
                      text-base font-bold text-center transition-all duration-500
                      ${isActive ? phase.textColor : 'text-gray-400'}
                    `}
                  >
                    {phase.name}
                  </div>
                  <div className="text-xs text-gray-400 font-medium mt-1">{phase.nameEn}</div>
                </div>

                {/* 활성화 시 글로우 효과 */}
                {isActive && (
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${phase.color} opacity-20 blur-xl -z-10`}
                  ></div>
                )}
              </div>
            );
          })}

          {/* 중앙 순환 화살표 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-64 h-64">
              {/* 순환 원형 경로 */}
              <svg className="w-full h-full animate-spin-slow" style={{ animationDuration: '12s' }}>
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="text-gray-300"
                />
                {/* 화살표 */}
                <path
                  d="M 128 8 L 136 24 L 120 24 Z"
                  fill="currentColor"
                  className={`transition-colors duration-500 ${
                    activePhase === 0 ? 'text-green-500' :
                    activePhase === 1 ? 'text-blue-500' :
                    activePhase === 2 ? 'text-yellow-500' :
                    'text-red-500'
                  }`}
                />
              </svg>

              {/* 중앙 텍스트 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-gray-900">경제 순환기</div>
                <div className="text-sm text-gray-500 mt-1">Economic Cycle</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 상단 인디케이터 */}
      <div className="absolute top-4 left-4 flex gap-2">
        {phases.map((phase, idx) => (
          <div
            key={idx}
            className={`
              w-2 h-2 rounded-full transition-all duration-500
              ${activePhase === idx ? `bg-gradient-to-br ${phase.color}` : 'bg-gray-300'}
            `}
          ></div>
        ))}
      </div>

      {/* v2 안내 */}
      <div className="absolute top-4 right-4">
        <div className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-medium">
          v2에서 실시간 데이터 제공
        </div>
      </div>
    </div>
  );
}
