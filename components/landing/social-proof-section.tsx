"use client";

import { Users, TrendingUp, Heart } from "lucide-react";

export function SocialProofSection() {
  const stats = [
    {
      icon: Users,
      value: "1,000+",
      label: "활성 사용자",
      description: "매일 뉴스를 확인하는 독자들",
    },
    {
      icon: TrendingUp,
      value: "15,000+",
      label: "분석된 뉴스",
      description: "AI가 해석한 경제 뉴스 개수",
    },
    {
      icon: Heart,
      value: "95%",
      label: "만족도",
      description: "구독을 지속하는 사용자 비율",
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            이미 많은 분들이 선택했습니다
          </h2>
          <p className="text-xl text-muted-foreground">
            경제 뉴스, 이제 쉽게 이해하고 계십니다
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-2xl bg-card border shadow-lg text-center hover:shadow-2xl transition-shadow duration-300"
                style={{
                  animation: `fade-in-up 0.6s ease-out ${index * 0.15}s both`,
                }}
              >
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xl font-semibold mb-2">{stat.label}</div>
                <p className="text-muted-foreground">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* 사용자 후기 섹션 (추후 추가용) */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-center mb-12">
            실제 사용자들의 이야기
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* 후기 1 */}
            <div className="p-6 rounded-xl bg-card border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  김
                </div>
                <div className="ml-3">
                  <div className="font-semibold">김철수</div>
                  <div className="text-sm text-muted-foreground">직장인, 30대</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "경제 뉴스가 이렇게 쉬울 줄 몰랐어요. 이제 점심시간에 5분만 투자하면 
                세상이 어떻게 돌아가는지 알 수 있습니다."
              </p>
            </div>

            {/* 후기 2 */}
            <div className="p-6 rounded-xl bg-card border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  이
                </div>
                <div className="ml-3">
                  <div className="font-semibold">이영희</div>
                  <div className="text-sm text-muted-foreground">자영업자, 40대</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "대출 있는 제 상황에 딱 맞춰 설명해주니 실제로 도움이 됩니다. 
                금리 변동이 내 사업에 어떤 영향을 줄지 미리 알 수 있어요."
              </p>
            </div>

            {/* 후기 3 */}
            <div className="p-6 rounded-xl bg-card border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                  박
                </div>
                <div className="ml-3">
                  <div className="font-semibold">박민수</div>
                  <div className="text-sm text-muted-foreground">투자자, 20대</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "주식 투자하는데 이 서비스 없으면 불안해요. AI 분석이 정말 정확하고, 
                제 포트폴리오에 어떤 영향이 있을지 바로 알려줍니다."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
