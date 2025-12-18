'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, DollarSign, Eye } from 'lucide-react';

// Mock 데이터 - 실제로는 API에서 가져올 예정
const ECONOMIC_DATA = {
  spread: "-0.15%",
  unemployment: "3.9%",
  exchange: "1,340 KRW",
  currentPhase: "회복기 감지됨. 인플레이션 안정화 중.",
  metrics: {
    yield_curve: {
      value: -0.15,
      trend: 'down',
      label: '장단기 금리차 (10년-2년)'
    },
    unemployment: {
      value: 3.9,
      trend: 'up',
      label: '미국 실업률'
    },
    exchange: {
      value: 1340,
      trend: 'up',
      label: '원/달러 환율'
    }
  }
};

// 타이프라이터 효과 컴포넌트
const TypewriterText = ({ text, delay = 50 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, delay]);

  return (
    <span>
      {displayText}
      <span className="animate-pulse text-green-400">|</span>
    </span>
  );
};


// 경제 자산 블립 컴포넌트
const EconomicBlips = () => {
  const blips = [
    { x: 35, y: 25, size: 'small' },
    { x: 65, y: 40, size: 'medium' },
    { x: 45, y: 70, size: 'large' },
    { x: 75, y: 60, size: 'small' },
    { x: 25, y: 55, size: 'medium' },
  ];

  return (
    <>
      {blips.map((blip, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full bg-green-400 opacity-70 ${
            blip.size === 'small' ? 'w-1 h-1' :
            blip.size === 'medium' ? 'w-2 h-2' : 'w-3 h-3'
          }`}
          style={{
            left: `${blip.x}%`,
            top: `${blip.y}%`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + index * 0.5,
            repeat: Infinity,
            delay: index * 0.3,
          }}
        />
      ))}
    </>
  );
};

interface EconomicRadarSectionProps {
  onViewCycleFeatures: () => void;
  onViewCurrentStatus: () => void;
}

export default function EconomicRadarSection({
  onViewCycleFeatures,
  onViewCurrentStatus
}: EconomicRadarSectionProps) {

  useEffect(() => {
    // 핵심 기능 로그: 경제 레이더 섹션 로드
    console.info('[ECONOMIC_RADAR] radar section loaded');
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-950/80" />

      {/* 메인 컨테이너 */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[80vh]">

          {/* 좌측: 정보 패널 */}
          <div className="space-y-6">
            {/* 액션 버튼 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="backdrop-blur-md bg-black/40 border border-white/10 rounded-xl p-6"
            >
              <button
                onClick={onViewCycleFeatures}
                className="w-full group relative overflow-hidden rounded-lg border border-green-400/50 bg-black/20 px-6 py-4 text-green-400 font-mono text-sm uppercase tracking-wider hover:bg-green-400/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="flex items-center justify-center gap-3">
                  <Eye className="w-5 h-5" />
                  경제 순환기 특징 보기
                </div>
              </button>
            </motion.div>

            {/* 현재 상황 분석 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="backdrop-blur-md bg-black/40 border border-white/10 rounded-xl p-6"
            >
              <button
                onClick={onViewCurrentStatus}
                className="w-full group relative overflow-hidden rounded-lg border border-yellow-400/50 bg-black/20 px-6 py-4 text-yellow-400 font-mono text-sm uppercase tracking-wider hover:bg-yellow-400/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="flex items-center justify-center gap-3">
                  <Activity className="w-5 h-5" />
                  현재 경제 상황 보기
                </div>
              </button>
            </motion.div>

            {/* 상태 브리핑 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="backdrop-blur-md bg-black/40 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-green-400 font-mono text-sm uppercase tracking-wider mb-4">
                경제 상황 브리핑
              </h3>
              <div className="font-mono text-green-300 text-sm leading-relaxed">
                <TypewriterText text={ECONOMIC_DATA.currentPhase} delay={80} />
              </div>
            </motion.div>

            {/* 키 메트릭 그리드 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              {Object.entries(ECONOMIC_DATA.metrics).map(([key, metric], index) => (
                <div key={key} className="backdrop-blur-md bg-black/40 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 font-mono text-xs uppercase tracking-wider">
                      {metric.label}
                    </span>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-red-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <div className="text-2xl font-mono font-bold text-white mb-1">
                    {key === 'exchange'
                      ? `${metric.value.toLocaleString()} KRW`
                      : key === 'unemployment'
                      ? `${metric.value}%`
                      : `${metric.value}%`
                    }
                  </div>
                  {/* 간단한 스파크라인 효과 */}
                  <div className="flex items-end gap-1 h-8">
                    {[0.3, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.8, 0.5, 0.6].map((height, i) => (
                      <motion.div
                        key={i}
                        className="bg-green-400 rounded-sm flex-1"
                        initial={{ height: 0 }}
                        animate={{ height: `${height * 100}%` }}
                        transition={{ delay: index * 0.1 + i * 0.05 }}
                        style={{ minHeight: '2px' }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 우측: 레이더 비주얼라이제이션 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-xl p-8">
              <h2 className="text-center text-green-400 font-mono text-lg uppercase tracking-wider mb-8">
                경제순환기 레이더
              </h2>

              {/* 레이더 컨테이너 */}
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* 동심원 그리드 */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
                      <stop offset="70%" stopColor="#10B981" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* 배경 그라데이션 */}
                  <circle cx="200" cy="200" r="190" fill="url(#radarGradient)" />

                  {/* 동심원 */}
                  <circle cx="200" cy="200" r="150" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.3" />
                  <circle cx="200" cy="200" r="100" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.4" />
                  <circle cx="200" cy="200" r="50" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.5" />

                  {/* 십자선 */}
                  <line x1="200" y1="10" x2="200" y2="390" stroke="#10B981" strokeWidth="1" opacity="0.3" />
                  <line x1="10" y1="200" x2="390" y2="200" stroke="#10B981" strokeWidth="1" opacity="0.3" />

                  {/* 방향 라벨 */}
                  <text x="200" y="25" textAnchor="middle" className="fill-green-400 font-mono text-xs opacity-70">N</text>
                  <text x="375" y="205" textAnchor="middle" className="fill-green-400 font-mono text-xs opacity-70">E</text>
                  <text x="200" y="395" textAnchor="middle" className="fill-green-400 font-mono text-xs opacity-70">S</text>
                  <text x="25" y="205" textAnchor="middle" className="fill-green-400 font-mono text-xs opacity-70">W</text>

                  {/* 4분면 텍스트 */}
                  <text x="300" y="120" textAnchor="middle" className="fill-green-300 font-mono text-sm opacity-60">회복기</text>
                  <text x="100" y="120" textAnchor="middle" className="fill-green-300 font-mono text-sm opacity-60">둔화기</text>
                  <text x="100" y="280" textAnchor="middle" className="fill-green-300 font-mono text-sm opacity-60">침체기</text>
                  <text x="300" y="280" textAnchor="middle" className="fill-green-300 font-mono text-sm opacity-60">확장기</text>
                </svg>


                {/* 경제 자산 블립 */}
                <EconomicBlips />

                {/* 중심점 */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-green-400 rounded-full opacity-80" />

              </div>

            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}