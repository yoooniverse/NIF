'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function OnboardingInterestsPage() {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    console.log("[ONBOARDING_INTERESTS] 관심 자산 선택 페이지 진입");
  }, []);

  // PRD에 명시된 관심 자산
  const interests = [
    { id: "real-estate", label: "부동산", icon: "🏠", description: "아파트, 오피스텔 시장" },
    { id: "crypto", label: "가상화폐", icon: "₿", description: "비트코인, 이더리움" },
    { id: "etf", label: "ETF", icon: "📊", description: "상장지수펀드" },
    { id: "stock", label: "주식", icon: "📈", description: "국내외 주식시장" },
    { id: "exchange-rate", label: "환율", icon: "💱", description: "원/달러 환율" },
  ];

  const toggleInterest = (interestId: string) => {
    console.log("[ONBOARDING_INTERESTS] 관심사 토글:", interestId);
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = () => {
    if (selectedInterests.length === 0) {
      alert("최소 1개 이상의 관심 자산을 선택해주세요");
      return;
    }

    console.log("[ONBOARDING_INTERESTS] 선택 완료, 다음 단계로 이동");
    console.log("[ONBOARDING_INTERESTS] 선택된 관심사:", selectedInterests);
    
    // 로컬 스토리지에 임시 저장
    localStorage.setItem('onboarding_interests', JSON.stringify(selectedInterests));
    router.push('/onboarding/contexts');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* 진행 상황 표시 (Step 1/3) */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-2 rounded-full bg-blue-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">1 / 3</p>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 md:p-12">
          {/* 헤더 */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              관심 자산을 선택해주세요
            </h2>
            <p className="text-gray-600 text-lg">
              어떤 분야의 뉴스에 관심이 있으신가요? (여러 개 선택 가능)
            </p>
          </div>

          {/* 관심사 선택 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {interests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedInterests.includes(interest.id)
                    ? "border-blue-500 bg-blue-50 shadow-md scale-105"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{interest.icon}</div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {interest.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {interest.description}
                    </div>
                  </div>
                  {selectedInterests.includes(interest.id) && (
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
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={selectedInterests.length === 0}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-md ${
                selectedInterests.length > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              다음
            </button>
          </div>

          {selectedInterests.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              최소 1개 이상의 관심 자산을 선택해주세요
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
