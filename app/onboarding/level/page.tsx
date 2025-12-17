'use client';

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function OnboardingLevelPage() {
  const { user } = useUser();
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("[ONBOARDING_LEVEL] AI 레벨 선택 페이지 진입");
    
    // 이전 단계 확인
    const interests = localStorage.getItem('onboarding_interests');
    const contexts = localStorage.getItem('onboarding_contexts');
    if (!interests || !contexts) {
      console.log("[ONBOARDING_LEVEL] 이전 단계 미완료 - 관심사 페이지로 이동");
      router.push('/onboarding/interests');
    }
  }, [router]);

  // PRD에 명시된 AI 레벨
  const levels = [
    { 
      level: 1, 
      label: "초보자", 
      icon: "🌱", 
      description: "경제 뉴스가 처음이신가요?",
      detail: "중학생도 이해할 수 있는 쉬운 설명" 
    },
    { 
      level: 2, 
      label: "일반", 
      icon: "🎯", 
      description: "기본적인 경제 지식이 있으신가요?",
      detail: "적당한 수준의 전문 용어 사용" 
    },
    { 
      level: 3, 
      label: "전문가", 
      icon: "🚀", 
      description: "경제 전문가시군요!",
      detail: "심화 분석과 전문 용어 중심" 
    },
  ];

  const handleBack = () => {
    console.log("[ONBOARDING_LEVEL] 이전 단계로 이동");
    router.push('/onboarding/contexts');
  };

  const handleComplete = async () => {
    if (!selectedLevel) {
      alert("AI 레벨을 선택해주세요");
      return;
    }

    if (!user) {
      alert("사용자 정보를 불러올 수 없습니다");
      return;
    }

    setIsSubmitting(true);
    console.log("[ONBOARDING_LEVEL] 온보딩 완료 처리 시작");

    try {
      // 로컬 스토리지에서 데이터 가져오기
      const interests = JSON.parse(localStorage.getItem('onboarding_interests') || '[]');
      const contexts = JSON.parse(localStorage.getItem('onboarding_contexts') || '[]');

      console.log("[ONBOARDING_LEVEL] 최종 데이터:", {
        level: selectedLevel,
        interests,
        contexts,
      });

      // Clerk의 사용자 메타데이터에 저장
      await user.update({
        unsafeMetadata: {
          onboardingCompleted: true,
          level: selectedLevel,
          interests: interests,
          contexts: contexts,
          onboardingCompletedAt: new Date().toISOString(),
        },
      });

      console.log("[ONBOARDING_LEVEL] Clerk 메타데이터 저장 완료");

      // 로컬 스토리지 클리어
      localStorage.removeItem('onboarding_interests');
      localStorage.removeItem('onboarding_contexts');

      console.log("[ONBOARDING_LEVEL] 대시보드로 이동");
      router.push('/dashboard');
    } catch (error) {
      console.error("[ONBOARDING_LEVEL] 온보딩 완료 처리 실패:", error);
      alert("온보딩 완료 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* 진행 상황 표시 (Step 3/3) */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="w-8 h-2 rounded-full bg-blue-600"></div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">3 / 3</p>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 md:p-12">
          {/* 헤더 */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              AI 레벨을 선택해주세요
            </h2>
            <p className="text-gray-600 text-lg">
              어떤 수준의 설명을 원하시나요?
            </p>
          </div>

          {/* 레벨 선택 카드 */}
          <div className="space-y-4 mb-10">
            {levels.map((levelOption) => (
              <button
                key={levelOption.level}
                onClick={() => setSelectedLevel(levelOption.level)}
                className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedLevel === levelOption.level
                    ? "border-blue-500 bg-blue-50 shadow-md scale-105"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{levelOption.icon}</div>
                  <div className="flex-1">
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      Lv.{levelOption.level} {levelOption.label}
                    </div>
                    <div className="text-base text-gray-700 mb-2">
                      {levelOption.description}
                    </div>
                    <div className="text-sm text-gray-600">
                      {levelOption.detail}
                    </div>
                  </div>
                  {selectedLevel === levelOption.level && (
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
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
            >
              이전
            </button>

            <button
              onClick={handleComplete}
              disabled={!selectedLevel || isSubmitting}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-md ${
                selectedLevel && !isSubmitting
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "처리 중..." : "시작하기"}
            </button>
          </div>

          {!selectedLevel && (
            <p className="text-center text-sm text-gray-500 mt-4">
              AI 레벨을 선택해주세요
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
