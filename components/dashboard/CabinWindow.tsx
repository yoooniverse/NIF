'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CabinWindowProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * CabinWindow - 비행기 창문 모양의 인터랙티브 버튼 컴포넌트
 * 
 * 디자인 특징:
 * - 세로로 긴 타원형(Vertical Capsule) 비행기 창문 형태
 * - 두꺼운 프레임(border 12px+)로 내장재 느낌
 * - backdrop-blur를 활용한 유리 질감
 * - 배경의 구름이 비쳐 보이는 효과
 * - Hover 시 살짝 앞으로 튀어나오는 인터랙션
 */
export default function CabinWindow({ 
  title, 
  subtitle, 
  icon, 
  onClick, 
  className = '' 
}: CabinWindowProps) {
  const handleClick = () => {
    // 핵심 기능 로그: 메인 네비게이션(창문 버튼) 클릭 추적
    console.info('[CabinWindow] click:', title);
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        relative group cursor-pointer
        w-[min(320px,92vw)] h-[min(580px,72vh)]
        sm:w-[300px] sm:h-[540px]
        lg:w-[320px] lg:h-[580px]
        focus:outline-none
        ${className}
      `}
      // Hover 인터랙션: 앞으로 튀어나오는 효과
      whileHover={{ 
        scale: 1.04,
        y: -10,
      }}
      whileTap={{ 
        scale: 0.98,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* Recess (벽에 매립된 컷아웃) */}
      <div className="
        absolute inset-0
        rounded-[100px]
        bg-[radial-gradient(120%_80%_at_50%_20%,rgba(255,255,255,0.90),rgba(241,245,249,0.92),rgba(226,232,240,0.98))]
        shadow-[inset_0_26px_55px_rgba(2,6,23,0.35),inset_0_-22px_48px_rgba(2,6,23,0.28)]
      " />

      {/* Thick frame (내장재 테두리) */}
      <div className="
        absolute inset-0
        rounded-[100px]
        border-[16px]
        border-white/70
        bg-gradient-to-br from-white/30 via-slate-100/10 to-slate-200/20
        shadow-[0_22px_60px_-45px_rgba(2,6,23,0.85)]
        transition-[box-shadow] duration-300
        group-hover:shadow-[0_30px_80px_-55px_rgba(2,6,23,0.92)]
      " />

      {/* Glass */}
      <div
        className="
          absolute inset-[22px]
          rounded-[82px]
          overflow-hidden
          border border-white/35
          shadow-[inset_0_28px_70px_rgba(2,6,23,0.45),inset_0_2px_10px_rgba(255,255,255,0.55)]
        "
      >
        {/* Window view: 하늘/구름은 "유리 안쪽"에서만 보임 */}
        <div className="absolute inset-0">
          {/* NOTE: MovingClouds 컴포넌트 삭제됨. (필요 시 대체 효과 추가 가능) */}
        </div>

        {/* Glass tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-blue-200/10" />

        {/* Glass highlight */}
        <div className="absolute -top-10 left-6 right-6 h-40 rotate-[-12deg] bg-white/25 blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
          <motion.div
            className="mb-6"
            whileHover={{
              rotate: [0, -6, 6, -6, 0],
              scale: 1.08,
            }}
            transition={{ duration: 0.55 }}
          >
            <div className="grid place-items-center rounded-3xl bg-white/25 px-6 py-6 backdrop-blur-md border border-white/35">
              {icon}
            </div>
          </motion.div>

          <div className="text-3xl sm:text-[2.2rem] font-semibold tracking-tight text-slate-800 drop-shadow-sm">
            {title}
          </div>

          {subtitle && (
            <div className="mt-3 text-base sm:text-lg text-slate-700/90">
              {subtitle}
            </div>
          )}

          <div className="mt-8 h-px w-20 bg-white/50" />
          <div className="mt-4 text-sm text-slate-700/80 opacity-0 group-hover:opacity-100 transition-opacity">
            창밖 보기 →
          </div>
        </div>
      </div>
    </motion.button>
  );
}
