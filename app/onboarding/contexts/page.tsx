"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { Database } from "@/database.types";

export default function OnboardingContextsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const supabase = useClerkSupabaseClient();
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [contexts, setContexts] = useState<Database['public']['Tables']['contexts']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[ONBOARDING_CONTEXTS] 나의 상황 선택 페이지 진입");

    if (!isLoaded) return;

    if (!user) {
      console.log("[ONBOARDING_CONTEXTS] 사용자가 로그인되지 않음");
      router.push('/login');
      return;
    }

    // 데이터베이스에서 contexts 불러오기
    const loadContexts = async () => {
      try {
        console.log("[ONBOARDING_CONTEXTS] 데이터베이스에서 contexts 불러오기");

        const { data: contextsData, error } = await supabase
          .from('contexts')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error("[ONBOARDING_CONTEXTS] contexts 불러오기 실패:", error);
          return;
        }

        console.log("[ONBOARDING_CONTEXTS] 불러온 contexts:", contextsData);
        setContexts(contextsData || []);

      } catch (error) {
        console.error("[ONBOARDING_CONTEXTS] contexts 로딩 중 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContexts();
  }, [router, user, isLoaded]);

  // contexts는 데이터베이스에서 불러옴

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
      console.log("[ONBOARDING_CONTEXTS] 선택된 상황이 없음");
      return;
    }

    console.log("[ONBOARDING_CONTEXTS] 선택 완료, 다음 단계로 이동");
    console.log("[ONBOARDING_CONTEXTS] 선택된 상황:", selectedContexts);

    // 세션 스토리지에 임시 저장 (온보딩 마지막에 DB 저장)
    sessionStorage.setItem('onboarding_contexts', JSON.stringify(selectedContexts));
    router.push('/onboarding/level');
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="text-white/60 font-mono">상황 데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 전광판 행들 */}
      {contexts.map((context, index) => {
        const isSelected = selectedContexts.includes(context.id);

        return (
          <motion.div
            key={context.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`grid grid-cols-12 gap-4 px-8 py-4 border-b border-[#FFB800]/20 hover:bg-[#FFB800]/5 transition-colors duration-200 cursor-pointer ${
              isSelected ? 'bg-[#FFB800]/10' : ''
            }`}
            onClick={() => toggleContext(context.id)}
          >
            {/* STEP (02/03) */}
            <div className="col-span-1 flex items-center justify-center">
              <motion.div
                animate={{ rotateX: isSelected ? [0, 90, 0] : 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="text-lg font-mono font-bold text-[#FFB800]">
                  02
                </div>
                <div className="text-xs font-mono text-white/60">/03</div>
              </motion.div>
            </div>

            {/* DESTINATION (질문/카테고리명) */}
            <div className="col-span-4 flex items-center">
              <div>
                <div className="text-white font-mono font-bold text-lg">
                  {context.name}
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
                {isSelected ? '맞춤 뉴스 제공' : '상황 선택하기'}
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
              SELECTED: {selectedContexts.length}/{contexts.length}
            </div>
            {selectedContexts.length === 0 && (
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
            disabled={selectedContexts.length === 0}
            className={`px-6 py-3 font-mono font-bold text-sm rounded transition-all duration-200 border-2 ${
              selectedContexts.length > 0
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
