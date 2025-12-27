"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function OnboardingLevelPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("[ONBOARDING_LEVEL] AI 레벨 선택 페이지 진입");

    // 세션 스토리지에서 기존 선택사항 불러오기
    const saved = sessionStorage.getItem('onboarding_level');
    if (saved) {
      setSelectedLevel(parseInt(saved));
    }

    // 이전 단계 확인
    const interests = sessionStorage.getItem('onboarding_interests');
    const contexts = sessionStorage.getItem('onboarding_contexts');
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
      description: "경제 뉴스가 처음이신가요?",
      detail: "중학생도 이해할 수 있는 쉬운 설명"
    },
    {
      level: 2,
      label: "일반",
      description: "기본적인 경제 지식이 있으신가요?",
      detail: "적당한 수준의 전문 용어 사용"
    },
    {
      level: 3,
      label: "전문가",
      description: "경제 전문가시군요!",
      detail: "간단한 수치,통계 중심 설명"
    },
  ];

  const handleBack = () => {
    console.log("[ONBOARDING_LEVEL] 이전 단계로 이동");

    // 현재 선택사항 저장
    if (selectedLevel) {
      sessionStorage.setItem('onboarding_level', selectedLevel.toString());
    }
    router.push('/onboarding/contexts');
  };

  const handleComplete = async () => {
    if (!selectedLevel) {
      console.log("[ONBOARDING_LEVEL] 선택된 레벨이 없음");
      return;
    }

    setIsSubmitting(true);
    console.log("[ONBOARDING_LEVEL] 온보딩 완료 처리 시작");

    try {
      // 세션 스토리지에서 데이터 가져오기 (안전하게 파싱)
      let interests: string[] = [];
      let contexts: string[] = [];

      try {
        const interestsData = sessionStorage.getItem('onboarding_interests');
        interests = interestsData ? JSON.parse(interestsData) : [];
      } catch (e) {
        console.warn("[ONBOARDING_LEVEL] 관심사 데이터 파싱 실패:", e);
        interests = [];
      }

      try {
        const contextsData = sessionStorage.getItem('onboarding_contexts');
        contexts = contextsData ? JSON.parse(contextsData) : [];
      } catch (e) {
        console.warn("[ONBOARDING_LEVEL] 상황 데이터 파싱 실패:", e);
        contexts = [];
      }

      console.log("[ONBOARDING_LEVEL] 최종 데이터:", {
        level: selectedLevel,
        interests,
        contexts,
      });

      // API를 통해 Clerk 메타데이터 업데이트 (Clerk v5 대응)
      try {
        const response = await fetch('/api/onboarding/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            level: selectedLevel,
            interests,
            contexts,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          console.log("[ONBOARDING_LEVEL] 온보딩 완료 처리 성공:", result);
        } else {
          console.error("[ONBOARDING_LEVEL] API 오류 발생:", result);
          throw new Error('온보딩 완료 처리 실패');
        }
      } catch (apiError) {
        console.error("[ONBOARDING_LEVEL] API 호출 실패:", apiError);
        throw apiError; // API 실패 시 온보딩 중단
      }

      // 세션 스토리지 클리어 (온보딩 완료 후 정리)
      console.log("[ONBOARDING_LEVEL] 세션 스토리지 클리어 전:", {
        interests: sessionStorage.getItem('onboarding_interests'),
        contexts: sessionStorage.getItem('onboarding_contexts'),
        level: sessionStorage.getItem('onboarding_level'),
      });

      sessionStorage.removeItem('onboarding_interests');
      sessionStorage.removeItem('onboarding_contexts');
      sessionStorage.removeItem('onboarding_level');

      console.log("[ONBOARDING_LEVEL] 세션 스토리지 클리어 후:", {
        interests: sessionStorage.getItem('onboarding_interests'),
        contexts: sessionStorage.getItem('onboarding_contexts'),
        level: sessionStorage.getItem('onboarding_level'),
      });

      console.log("[ONBOARDING_LEVEL] 대시보드로 이동");
      router.push('/dashboard');
    } catch (error) {
      console.error("[ONBOARDING_LEVEL] 온보딩 완료 처리 실패:", error);
      alert("온보딩 완료 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* 전광판 행들 */}
      {levels.map((levelOption, index) => {
        const isSelected = selectedLevel === levelOption.level;

        return (
          <motion.div
            key={levelOption.level}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`grid grid-cols-12 gap-4 px-8 py-4 border-b border-[#FFB800]/20 hover:bg-[#FFB800]/5 transition-colors duration-200 cursor-pointer ${
              isSelected ? 'bg-[#FFB800]/10' : ''
            }`}
            onClick={() => setSelectedLevel(levelOption.level)}
          >
            {/* STEP (03/03) */}
            <div className="col-span-1 flex items-center justify-center">
              <motion.div
                animate={{ rotateX: isSelected ? [0, 90, 0] : 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="text-lg font-mono font-bold text-[#FFB800]">
                  03
                </div>
                <div className="text-xs font-mono text-white/60">/03</div>
              </motion.div>
            </div>

            {/* DESTINATION (질문/카테고리명) */}
            <div className="col-span-4 flex items-center">
              <div>
                <div className="text-white font-mono font-bold text-lg">
                  Lv.{levelOption.level} {levelOption.label}
                </div>
                <div className="text-white/60 font-mono text-sm">
                  {levelOption.description}
                </div>
                <div className="text-white/40 font-mono text-xs">
                  {levelOption.detail}
                </div>
              </div>
            </div>

            {/* GATE (선택된 옵션 개수) */}
            <div className="col-span-2 flex items-center justify-center">
              <motion.div
                animate={{ scale: isSelected ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className={`text-xl font-mono font-bold ${
                  isSelected ? 'text-[#FFB800]' : 'text-white/40'
                }`}>
                  {isSelected ? '✓' : '-'}
                </div>
              </motion.div>
            </div>

            {/* STATUS (현재 상태) */}
            <div className="col-span-2 flex items-center justify-center">
              <motion.div
                animate={{ rotateX: isSelected ? [0, 90, 0] : 0 }}
                transition={{ duration: 0.3 }}
                className="px-3 py-1 rounded bg-[#FFB800]/20"
              >
                <span className={`font-mono text-sm font-bold ${
                  isSelected ? 'text-[#FFB800]' : 'text-white/60'
                }`}>
                  {isSelected ? 'SELECTED' : 'WAITING'}
                </span>
              </motion.div>
            </div>

            {/* REMARKS (현재 상태 세부) */}
            <div className="col-span-3 flex items-center">
              <div className="text-white/80 font-mono text-sm">
                {isSelected ? '맞춤 AI 분석 준비됨' : '레벨 선택하기'}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* COMPLETE 행 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-12 gap-4 px-8 py-6 border-b-2 border-[#FFB800]/30 bg-[#FFB800]/5"
      >
        {/* STEP */}
        <div className="col-span-1 flex items-center justify-center">
          <div className="text-lg font-mono font-bold text-[#FFB800]">
            ✓
          </div>
        </div>

        {/* DESTINATION */}
        <div className="col-span-4 flex items-center">
          <div>
            <div className="text-white font-mono font-bold text-lg">
              온보딩 완료
            </div>
            <div className="text-white/60 font-mono text-sm">
              30일 무료 체험 시작
            </div>
          </div>
        </div>

        {/* GATE */}
        <div className="col-span-2 flex items-center justify-center">
          <div className="text-xl font-mono font-bold text-[#FFB800]">
            {selectedLevel ? `Lv.${selectedLevel}` : '-'}
          </div>
        </div>

        {/* STATUS */}
        <div className="col-span-2 flex items-center justify-center">
          <div className="px-3 py-1 rounded bg-green-600/20">
            <span className="font-mono text-sm font-bold text-green-400">
              READY
            </span>
          </div>
        </div>

        {/* REMARKS */}
        <div className="col-span-3 flex items-center justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            disabled={!selectedLevel || isSubmitting}
            className={`px-6 py-2 font-mono font-bold text-sm rounded transition-all duration-200 border-2 ${
              selectedLevel && !isSubmitting
                ? 'bg-[#FFB800] border-[#FFB800] text-black hover:bg-[#FFB800]/90'
                : 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '처리 중...' : '출발하기 ▶'}
          </motion.button>
        </div>
      </motion.div>

      {/* 하단 네비게이션 */}
      <div className="px-8 py-6 border-t border-[#FFB800]/20 bg-black/20">
        <div className="flex items-center justify-between">
          {/* BACK 버튼 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#FFB800]/20 hover:bg-[#FFB800]/30 border-2 border-[#FFB800] text-[#FFB800] font-mono font-bold text-sm rounded transition-all duration-200 disabled:opacity-50"
          >
            ◀ BACK
          </motion.button>

          {/* 선택 상태 표시 */}
          <div className="text-center">
            <div className="text-white/60 font-mono text-sm mb-1">
              AI LEVEL: {selectedLevel ? `Lv.${selectedLevel}` : 'NOT SELECTED'}
            </div>
            {!selectedLevel && (
              <div className="text-red-400 font-mono text-xs animate-pulse">
                AI 레벨 선택 필요
              </div>
            )}
          </div>

          {/* 상태 표시 */}
          <div className="text-right">
            <div className="text-white/60 font-mono text-sm">
              FINAL STEP
            </div>
            <div className="text-[#FFB800] font-mono text-xs">
              FREE TRIAL READY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
