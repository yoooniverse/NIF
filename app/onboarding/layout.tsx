"use client";

import { usePathname } from "next/navigation";

/**
 * 온보딩 레이아웃 컴포넌트
 * 여권 디자인 컨셉: 클래식한 여권의 엠보싱, 스탬프, 테두리 느낌
 * Apple 컨셉: 깔끔한 타이포그래피, 미니멀한 레이아웃, 부드러운 애니메이션
 */
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 현재 스텝 계산
  const getCurrentStep = () => {
    if (pathname.includes("/interests")) return 1;
    if (pathname.includes("/contexts")) return 2;
    if (pathname.includes("/level")) return 3;
    return 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* 여권 스타일 컨테이너 */}
      <div className="w-full max-w-2xl">
        {/* 여권 커버 - 외부 테두리 */}
        <div className="relative bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl shadow-2xl p-1">
          {/* 여권 엠보싱 패턴 */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]" />
          </div>

          {/* 여권 내부 페이지 */}
          <div className="relative bg-gradient-to-b from-white to-slate-50 rounded-[22px] shadow-inner">
            {/* 여권 헤더 - 국가 정보 스타일 */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-8 py-6">
              <div className="flex items-center justify-between">
                {/* 타이틀 - 여권 스타일 */}
                <div>
                  <div className="text-xs font-semibold text-slate-400 tracking-[0.3em] uppercase mb-1">
                    News In Flight
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Welcome Aboard
                  </h1>
                  <p className="text-sm text-slate-600 mt-1">
                    당신의 경제 여행을 시작합니다
                  </p>
                </div>

                {/* 여권 스탬프 스타일 - 스텝 인디케이터 */}
                <div className="flex items-center gap-3">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        step === currentStep
                          ? "border-indigo-600 bg-indigo-50 scale-110 shadow-md"
                          : step < currentStep
                          ? "border-green-500 bg-green-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      {/* 스탬프 링 효과 */}
                      <div
                        className={`absolute inset-0 rounded-full border-2 border-dashed transition-all duration-300 ${
                          step === currentStep
                            ? "border-indigo-300 animate-spin-slow"
                            : step < currentStep
                            ? "border-green-300"
                            : "border-slate-100"
                        }`}
                        style={{ animationDuration: "3s" }}
                      />

                      {/* 스텝 번호 또는 체크 */}
                      <span
                        className={`relative z-10 font-bold ${
                          step === currentStep
                            ? "text-indigo-600"
                            : step < currentStep
                            ? "text-green-600"
                            : "text-slate-400"
                        }`}
                      >
                        {step < currentStep ? "✓" : step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 프로그레스 바 */}
              <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* 여권 본문 - 페이지 내용 */}
            <div className="p-8 min-h-[600px]">{children}</div>

            {/* 여권 하단 - 시리얼 넘버 스타일 */}
            <div className="border-t border-slate-200 px-8 py-4 bg-slate-50 rounded-b-[22px]">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="font-mono tracking-wider">
                  NIF-{currentStep.toString().padStart(2, "0")}/03
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span>온라인</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 여권 하단 그림자 */}
        <div className="h-4 bg-gradient-to-b from-black/5 to-transparent rounded-b-3xl transform translate-y-2 -z-10" />
      </div>

      {/* 배경 장식 - 비행기 궤적 느낌 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
