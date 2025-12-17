"use client";

import { Users, TrendingUp, Heart, Award } from "lucide-react";

export function SocialProofSection() {
  console.log("📊 SocialProofSection 렌더링 - 계기판 스타일");

  const stats = [
    {
      icon: Users,
      value: "1,000+",
      label: "활성 사용자",
      description: "매일 뉴스를 확인하는 독자들",
      gradient: "from-blue-500 to-cyan-500",
      unit: "명",
    },
    {
      icon: TrendingUp,
      value: "15,000+",
      label: "분석된 뉴스",
      description: "AI가 해석한 경제 뉴스 개수",
      gradient: "from-purple-500 to-pink-500",
      unit: "건",
    },
    {
      icon: Heart,
      value: "95%",
      label: "만족도",
      description: "구독을 지속하는 사용자 비율",
      gradient: "from-orange-500 to-red-500",
      unit: "%",
    },
  ];

  const testimonials = [
    {
      name: "김철수",
      role: "직장인, 30대",
      avatar: "김",
      gradient: "from-blue-500 to-cyan-500",
      quote: "경제 뉴스가 이렇게 쉬울 줄 몰랐어요. 이제 점심시간에 5분만 투자하면 세상이 어떻게 돌아가는지 알 수 있습니다.",
      rating: 5,
    },
    {
      name: "이영희",
      role: "자영업자, 40대",
      avatar: "이",
      gradient: "from-purple-500 to-pink-500",
      quote: "대출 있는 제 상황에 딱 맞춰 설명해주니 실제로 도움이 됩니다. 금리 변동이 내 사업에 어떤 영향을 줄지 미리 알 수 있어요.",
      rating: 5,
    },
    {
      name: "박민수",
      role: "투자자, 20대",
      avatar: "박",
      gradient: "from-orange-500 to-red-500",
      quote: "주식 투자하는데 이 서비스 없으면 불안해요. AI 분석이 정말 정확하고, 제 포트폴리오에 어떤 영향이 있을지 바로 알려줍니다.",
      rating: 5,
    },
  ];

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-background via-purple-950/5 to-background overflow-hidden">
      {/* 계기판 스타일 배경 그리드 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 헤더 - Apple 스타일 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            이미 많은 분들이 선택했습니다
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            경제 뉴스, 이제 쉽게 이해하고 계십니다
          </p>
        </div>

        {/* 통계 계기판 - 항공기 계기판 스타일 */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="relative group"
                style={{
                  animation: `fade-in-up 0.6s ease-out ${index * 0.15}s both`,
                }}
              >
                {/* 글로우 효과 */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                
                <div className="relative p-8 rounded-2xl border border-gray-200 bg-white text-center hover:shadow-lg transition-all duration-300">
                  {/* 상단 인디케이터 */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-xs font-medium text-blue-600 tracking-wide">ACTIVE</span>
                    </div>
                    <div className="inline-flex p-2 rounded-lg bg-gray-100">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>

                  {/* 메인 숫자 - Apple 스타일 */}
                  <div className="mb-4">
                    <div className="text-6xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500">{stat.unit}</div>
                  </div>

                  {/* 라벨 */}
                  <div className="text-xl font-semibold mb-2 text-gray-900">{stat.label}</div>
                  <p className="text-gray-600 text-sm">{stat.description}</p>

                  {/* 하단 진행 바 */}
                  <div className="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-1000"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 사용자 후기 섹션 - 기내 승객 피드백 스타일 */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-mono text-yellow-400">PASSENGER REVIEWS</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              실제 사용자들의 이야기
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative group"
                style={{
                  animation: `fade-in-up 0.6s ease-out ${(index + 3) * 0.1}s both`,
                }}
              >
                {/* 글로우 효과 */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${testimonial.gradient} rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>

                <div className="relative p-6 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all duration-300">
                  {/* 상단 - 사용자 정보 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 font-bold text-lg">
                        {testimonial.avatar}
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-xs text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <div key={i} className="w-4 h-4 rounded-full bg-yellow-400"></div>
                      ))}
                    </div>
                  </div>

                  {/* 후기 내용 */}
                  <p className="text-gray-700 leading-relaxed text-sm">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* 하단 라인 */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">인증된 사용자</span>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-blue-600"></div>
                        <span className="text-xs text-blue-600">인증됨</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
