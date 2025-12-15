"use client";

import { Sparkles, Target, Shield } from "lucide-react";

export function FeaturesSection() {
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
    },
    {
      level: "Lv.2",
      title: "일반",
      description: "일상 생활에 적용 가능한 실용적 해석",
      color: "bg-blue-500",
    },
    {
      level: "Lv.3",
      title: "전문가",
      description: "심층 분석과 전문적인 인사이트",
      color: "bg-purple-500",
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 핵심 가치 제안 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            왜 News In Flight일까요?
          </h2>
          <p className="text-xl text-muted-foreground">
            경제 뉴스를 당신만의 언어로 번역해드립니다
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="relative p-8 rounded-2xl border bg-card hover:shadow-2xl transition-all duration-300 group"
                style={{
                  animation: `fade-in-up 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* AI 레벨 소개 */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            당신에게 맞는 AI 레벨을 선택하세요
          </h3>
          <p className="text-lg text-muted-foreground">
            같은 뉴스도 당신의 수준에 맞춰 다르게 해석됩니다
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {aiLevels.map((level, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border bg-card hover:scale-105 transition-transform duration-300"
            >
              <div
                className={`inline-block px-4 py-2 rounded-full ${level.color} text-white font-bold mb-3`}
              >
                {level.level}
              </div>
              <h4 className="text-xl font-bold mb-2">{level.title}</h4>
              <p className="text-muted-foreground">{level.description}</p>
            </div>
          ))}
        </div>

        {/* 경제 순환기 지도 미리보기 */}
        <div className="mt-24 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            경제 순환기 지도로 큰 그림을 보세요
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            현재 경제가 어디쯤 와있는지, 다음은 무엇이 올지 한눈에 파악하세요
          </p>
          <div className="max-w-4xl mx-auto p-8 rounded-2xl border bg-card/50 backdrop-blur">
            <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                * 경제 순환기 지도는 v2에서 제공됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
