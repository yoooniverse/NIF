"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function OnboardingInterestsPage() {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    console.log("[ONBOARDING_INTERESTS] 관심 자산 선택 페이지 진입");

    // 로컬 스토리지에서 기존 선택사항 불러오기
    const saved = localStorage.getItem('onboarding_interests');
    if (saved) {
      setSelectedInterests(JSON.parse(saved));
    }
  }, []);

  // PRD에 명시된 관심 자산
  const interests = [
    { id: "real-estate", label: "부동산" },
    { id: "crypto", label: "가상화폐" },
    { id: "etf", label: "ETF" },
    { id: "stock", label: "주식" },
    { id: "exchange-rate", label: "환율" },
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
      console.log("[ONBOARDING_INTERESTS] 선택된 관심사가 없음");
      return;
    }

    console.log("[ONBOARDING_INTERESTS] 선택 완료, 다음 단계로 이동");
    console.log("[ONBOARDING_INTERESTS] 선택된 관심사:", selectedInterests);

    // 로컬 스토리지에 임시 저장
    localStorage.setItem('onboarding_interests', JSON.stringify(selectedInterests));
    router.push('/onboarding/contexts');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full">
      {/* 전광판 행들 */}
      {interests.map((interest, index) => {
        const isSelected = selectedInterests.includes(interest.id);

        return (
          <motion.div
            key={interest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`grid grid-cols-12 gap-4 px-8 py-4 border-b border-[#FFB800]/20 hover:bg-[#FFB800]/5 transition-colors duration-200 cursor-pointer ${
              isSelected ? 'bg-[#FFB800]/10' : ''
            }`}
            onClick={() => toggleInterest(interest.id)}
          >
            {/* STEP (01/03) */}
            <div className="col-span-1 flex items-center justify-center">
              <motion.div
                animate={{ rotateX: isSelected ? [0, 90, 0] : 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="text-lg font-mono font-bold text-[#FFB800]">
                  01
                </div>
                <div className="text-xs font-mono text-white/60">/03</div>
              </motion.div>
            </div>

            {/* DESTINATION (질문/카테고리명) */}
            <div className="col-span-4 flex items-center">
              <div>
                <div className="text-white font-mono font-bold text-lg">
                  {interest.label}
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
                {isSelected ? '관심 뉴스 수신 예정' : '선택하여 뉴스 받기'}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* 하단 네비게이션 */}
      <div className="px-8 py-6 border-t border-[#FFB800]/20 bg-black/20">
        <div className="flex items-center justify-between">
          {/* BACK 버튼 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="px-6 py-3 bg-[#FFB800]/20 hover:bg-[#FFB800]/30 border-2 border-[#FFB800] text-[#FFB800] font-mono font-bold text-sm rounded transition-all duration-200"
          >
            ◀ BACK
          </motion.button>

          {/* 선택 상태 표시 */}
          <div className="text-center">
            <div className="text-white/60 font-mono text-sm mb-1">
              SELECTED: {selectedInterests.length}/{interests.length}
            </div>
            {selectedInterests.length === 0 && (
              <div className="text-red-400 font-mono text-xs animate-pulse">
                최소 1개 이상 선택 필요
              </div>
            )}
          </div>

          {/* NEXT 버튼 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={selectedInterests.length === 0}
            className={`px-6 py-3 font-mono font-bold text-sm rounded transition-all duration-200 border-2 ${
              selectedInterests.length > 0
                ? 'bg-[#FFB800] border-[#FFB800] text-black hover:bg-[#FFB800]/90'
                : 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
            }`}
          >
            NEXT ▶
          </motion.button>
        </div>
      </div>
    </div>
  );
}
