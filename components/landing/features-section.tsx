"use client";

import { Sparkles, Target, Shield, Gauge, TrendingUp, Map } from "lucide-react";
import dynamic from "next/dynamic";

// Hydration 미스매치 방지를 위해 dynamic import (client-side only)
const EconomicCyclePreview = dynamic(
  () => import("./economic-cycle-preview").then((mod) => mod.EconomicCyclePreview),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center">
        <div className="text-gray-500">경제 순환기를 불러오는 중...</div>
      </div>
    )
  }
);

export function FeaturesSection() {
  console.log("✈️ FeaturesSection 렌더링 - In-Flight Entertainment 스타일");

  const features = [
    {
      icon: Sparkles,
      title: "AI가 쉽게 해석해줍니다",
      description: "Claude Sonnet 4.5가 어려운 경제 뉴스를 당신의 수준에 맞춰 쉽게 풀어드립니다.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Target,
      title: "카테고리별 Top 5만 엄선",
      description: "하루 15개의 핵심 뉴스만 선별하여 정보 과부하 없이 핵심만 전달합니다.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "개인화된 위험 시나리오",
      description: "당신의 상황(대출, 투자 등)에 맞춘 최악의 시나리오와 대응 전략을 제시합니다.",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const aiLevels = [
    {
      level: "Lv.1",
      title: "초보자",
      description: "중학생도 이해할 수 있는 쉬운 설명",
      color: "bg-green-500",
      icon: Gauge,
    },
    {
      level: "Lv.2",
      title: "일반",
      description: "일상 생활에 적용 가능한 실용적 해석",
      color: "bg-blue-500",
      icon: TrendingUp,
    },
    {
      level: "Lv.3",
      title: "전문가",
      description: "심층 분석과 전문적인 인사이트",
      color: "bg-purple-500",
      icon: Map,
    },
  ];

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-background via-blue-950/5 to-background overflow-hidden">
      {/* 비행 경로 스타일 배경 라인 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="flight-path" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 0 50 Q 25 30, 50 50 T 100 50" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="5,5" className="text-blue-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#flight-path)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 핵심 가치 제안 - Apple 스타일 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            왜 News In Flight일까요?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            경제 뉴스를 당신만의 언어로 번역해드립니다
          </p>
        </div>

        {/* 기능 카드 - 기내 모니터 스타일 */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="relative group"
                style={{
                  animation: `fade-in-up 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* 기내 모니터 프레임 */}
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
                  {/* 상단 인디케이터 */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs font-mono text-green-400">ACTIVE</span>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">0{index + 1}</div>
                  </div>

                  {/* 아이콘 */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* 콘텐츠 */}
                  <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* 하단 라인 */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                      <span className="font-mono">FEATURE_{String(index + 1).padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI 레벨 소개 - 계기판 스타일 */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            당신에게 맞는 AI 레벨을 선택하세요
          </h3>
          <p className="text-lg text-muted-foreground">
            같은 뉴스도 당신의 수준에 맞춰 다르게 해석됩니다
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {aiLevels.map((level, index) => {
            const LevelIcon = level.icon;
            return (
              <div
                key={index}
                className="relative p-6 rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-md hover:scale-105 hover:border-white/20 transition-all duration-300 group"
              >
                {/* 레벨 배지 */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${level.color} text-white font-bold`}>
                    <LevelIcon className="w-4 h-4" />
                    {level.level}
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center text-xs font-mono text-white/60">
                    {index + 1}
                  </div>
                </div>

                {/* 콘텐츠 */}
                <h4 className="text-xl font-bold mb-2 text-white">{level.title}</h4>
                <p className="text-slate-300">{level.description}</p>

                {/* 진행 바 */}
                <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${level.color} transition-all duration-1000 group-hover:w-full`}
                    style={{ width: `${33 * (index + 1)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 경제 순환기 지도 미리보기 - In-Flight Earth 적용 */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Map className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-mono text-purple-400">GLOBAL ECONOMIC MAP</span>
            </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            경제 순환기 지도로 큰 그림을 보세요
          </h3>
            <p className="text-lg text-muted-foreground mb-8">
              현재 경제가 어디쯤 와있는지, 다음은 무엇이 올지 한눈에 파악하세요
            </p>
          </div>

          {/* 3D 지구 미리보기 */}
          <div className="max-w-4xl mx-auto">
            <div className="relative p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl">
              {/* 상단 컨트롤 바 (기내 모니터 스타일) */}
              <div className="flex items-center justify-between mb-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">ECONOMIC_MAP_V2.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-mono text-green-400">LIVE</span>
                </div>
              </div>

              {/* 경제 순환기 애니메이션 */}
              <div className="aspect-[16/10] rounded-xl overflow-hidden relative">
                <EconomicCyclePreview />
              </div>

              {/* 지도 아래 설명 */}
              <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    경제 순환기의 4단계
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    경제는 회복기 → 확장기 → 둔화기 → 침체기를 반복하며 순환합니다.
                    각 단계마다 다른 경제 지표와 투자 전략이 필요합니다.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="text-sm font-bold text-green-700 mb-1">회복기</div>
                    <div className="text-xs text-green-600">Recovery</div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="text-sm font-bold text-blue-700 mb-1">확장기</div>
                    <div className="text-xs text-blue-600">Expansion</div>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="text-sm font-bold text-yellow-700 mb-1">둔화기</div>
                    <div className="text-xs text-yellow-600">Slowdown</div>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <div className="text-sm font-bold text-red-700 mb-1">침체기</div>
                    <div className="text-xs text-red-600">Recession</div>
                  </div>
                </div>

                {/* 추가 정보 */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">지표 수집</div>
                      <div className="text-lg font-bold text-green-600">실시간</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">AI 분석</div>
                      <div className="text-lg font-bold text-blue-600">자동화</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">업데이트</div>
                      <div className="text-lg font-bold text-purple-600">매일</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
