'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function OnboardingContextsPage() {
  const router = useRouter();
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);

  useEffect(() => {
    console.log("[ONBOARDING_CONTEXTS] 나의 상황 선택 페이지 진입");
    
    // 이전 단계 확인
    const interests = localStorage.getItem('onboarding_interests');
    if (!interests) {
      console.log("[ONBOARDING_CONTEXTS] 이전 단계 미완료 - 관심사 페이지로 이동");
      router.push('/onboarding/interests');
    }
  }, [router]);

  // PRD에 명시된 나의 상황
  const contexts = [
    { id: "loan-holder", label: "대출보유", icon: "🏦", description: "주택담보대출, 신용대출 등" },
    { id: "savings-only", label: "예적금만함", icon: "💰", description: "안전한 저축 위주" },
    { id: "dollar-holder", label: "달러보유", icon: "💵", description: "외화 자산 보유" },
    { id: "business-owner", label: "사업가", icon: "👔", description: "자영업, 법인 운영" },
    { id: "employee", label: "직장인", icon: "💼", description: "월급쟁이" },
    { id: "overseas-travel", label: "해외여행", icon: "✈️", description: "자주 해외여행" },
  ];

  const toggleContext = (contextId: string) => {
    console.log("[ONBOARDING_CONTEXTS] 상황 토글:", contextId);
    setSelectedContexts(prev => 
      prev.includes(contextId) 
        ? prev.filter(id => id !== contextId)
        : [...prev, contextId]
    );
  };

  const handleBack = () => {
    console.log("[ONBOARDING_CONTEXTS] 이전 단계로 이동");
    router.push('/onboarding/interests');
  };

  const handleNext = () => {
    if (selectedContexts.length === 0) {
      alert("최소 1개 이상의 상황을 선택해주세요");
      return;
    }

    console.log("[ONBOARDING_CONTEXTS] 선택 완료, 다음 단계로 이동");
    console.log("[ONBOARDING_CONTEXTS] 선택된 상황:", selectedContexts);
    
    // 로컬 스토리지에 임시 저장
    localStorage.setItem('onboarding_contexts', JSON.stringify(selectedContexts));
    router.push('/onboarding/level');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* 진행 상황 표시 (Step 2/3) */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="w-8 h-2 rounded-full bg-blue-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">2 / 3</p>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 md:p-12">
          {/* 헤더 */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-3xl">👤</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              나의 상황을 선택해주세요
            </h2>
            <p className="text-gray-600 text-lg">
              어떤 상황에 계신가요? (여러 개 선택 가능)
            </p>
          </div>

          {/* 상황 선택 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {contexts.map((context) => (
              <button
                key={context.id}
                onClick={() => toggleContext(context.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedContexts.includes(context.id)
                    ? "border-blue-500 bg-blue-50 shadow-md scale-105"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{context.icon}</div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {context.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {context.description}
                    </div>
                  </div>
                  {selectedContexts.includes(context.id) && (
                    <div className="text-blue-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* 버튼 */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
            >
              이전
            </button>

            <button
              onClick={handleNext}
              disabled={selectedContexts.length === 0}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-md ${
                selectedContexts.length > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              다음
            </button>
          </div>

          {selectedContexts.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              최소 1개 이상의 상황을 선택해주세요
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
