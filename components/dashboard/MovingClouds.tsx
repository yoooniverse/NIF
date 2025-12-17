'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

type MovingCloudsVariant = 'ocean' | 'window';

interface MovingCloudsProps {
  /**
   * - ocean: 전체 화면(바다+하늘+구름)
   * - window: 창문 안쪽(하늘+구름 중심)
   */
  variant?: MovingCloudsVariant;
  className?: string;
}

/**
 * MovingClouds - "바다 위를 비행하는 뷰" 배경 컴포넌트
 *
 * 제약:
 * - 외부 이미지 사용 금지 (png/jpg/svg/img 태그 금지)
 * - 오직 CSS Gradient + Framer Motion으로 구현
 *
 * 구성:
 * - 하늘/바다 수평선 그라디언트(상단 60% / 하단 40%)
 * - div 기반(rounded-full + blur) 절차적 구름(오른쪽→왼쪽, 60s+)
 * - 바다 반짝임(얕은 shimmer)
 */
export default function MovingClouds({ variant = 'ocean', className = '' }: MovingCloudsProps) {
  useEffect(() => {
    // 핵심 기능 로그: 배경(바다/하늘/구름)이 실제로 마운트되었는지 확인
    console.info('[MovingClouds] mounted:', variant);
  }, [variant]);

  return (
    <div
      className={`
        ${variant === 'ocean' ? 'fixed inset-0' : 'absolute inset-0'}
        overflow-hidden pointer-events-none z-0
        ${className}
      `}
    >
      {/* 1) Base */}
      {variant === 'ocean' ? (
        <div
          className="
            absolute inset-0
            bg-[linear-gradient(to_bottom,theme(colors.sky.400)_0%,theme(colors.blue.300)_58%,theme(colors.indigo.900)_62%,theme(colors.slate.950)_100%)]
          "
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-300 to-sky-100" />
      )}

      {/* 수평선 블렌딩(안개/대기) */}
      {variant === 'ocean' && (
        <>
          <div className="absolute left-0 right-0 top-[56%] h-32 bg-white/25 blur-3xl" />
          <div className="absolute left-0 right-0 top-[60%] h-10 bg-sky-200/25 blur-2xl" />
        </>
      )}

      {/* 2) Procedural Clouds (div + blur) */}
      {/* Far clouds (더 옅고 느리게) */}
      <motion.div
        className="absolute inset-0 opacity-60"
        animate={{ x: ['10%', '-30%'] }}
        transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute left-[5%] top-[10%] h-44 w-96 rounded-full bg-white/45 blur-3xl" />
        <div className="absolute left-[40%] top-[14%] h-40 w-[26rem] rounded-full bg-white/40 blur-3xl" />
        <div className="absolute left-[80%] top-[8%] h-48 w-[30rem] rounded-full bg-white/35 blur-3xl" />
      </motion.div>

      {/* Main clouds (요구: 오른쪽→왼쪽, 60s+) */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: ['25%', '-55%'] }}
        transition={{ duration: variant === 'ocean' ? 90 : 70, repeat: Infinity, ease: 'linear' }}
      >
        {/* Cloud blobs 4~5개 */}
        <div className="absolute left-[10%] top-[18%] h-44 w-[28rem] rounded-full bg-white/70 blur-3xl" />
        <div className="absolute left-[28%] top-[26%] h-32 w-[22rem] rounded-full bg-white/55 blur-3xl" />
        <div className="absolute left-[55%] top-[20%] h-40 w-[26rem] rounded-full bg-white/60 blur-3xl" />
        <div className="absolute left-[74%] top-[28%] h-36 w-[24rem] rounded-full bg-white/50 blur-3xl" />
        <div className="absolute left-[92%] top-[16%] h-48 w-[30rem] rounded-full bg-white/65 blur-3xl" />
      </motion.div>

      {/* 3) The Shimmering Sea (subtle) */}
      {variant === 'ocean' && (
        <>
          <motion.div
            className="absolute left-0 right-0 top-[60%] bottom-0 opacity-40"
            animate={{ x: [0, -220] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            style={{
              backgroundImage:
                'repeating-linear-gradient(115deg, rgba(255,255,255,0.00) 0px, rgba(255,255,255,0.08) 18px, rgba(255,255,255,0.00) 46px)',
              backgroundSize: '220px 220px',
              mixBlendMode: 'soft-light',
            }}
          />

          <div className="absolute left-0 right-0 top-[60%] bottom-0 bg-[radial-gradient(800px_280px_at_50%_20%,rgba(255,255,255,0.10),rgba(255,255,255,0))] opacity-50" />
        </>
      )}
    </div>
  );
}
