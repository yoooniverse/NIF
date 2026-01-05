'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Activity, TrendingUp, TrendingDown, DollarSign, Eye } from 'lucide-react';

interface EconomicData {
  status_color: 'Red' | 'Yellow' | 'Green';
  summary_text: string;
  historical_pattern: string;
  indicators_snapshot: {
    yield_curve: {
      value: number;
      unit: string;
      date: string;
      source: string;
    };
    unemployment_rate: {
      value: number;
      unit: string;
      mom_change: number;
      date: string;
      source: string;
    };
    usd_krw: {
      value: number;
      unit: string;
      mom_change: number;
      date: string;
      source: string;
    };
  };
}

// Mock 데이터 - 실제로는 API에서 가져올 예정
const ECONOMIC_DATA = {
  spread: "-0.15%",
  unemployment: "3.9%",
  exchange: "1,340 KRW",
  currentPhase: "경기는 아직 크게 나쁘진 않지만, 돈의 흐름은 이미 '조심 모드'로 들어가 있어서 불안 신호가 켜짐",
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


// 칵핏 게이지 컴포넌트
const CockpitGauge = ({ label, value, type = 'needle' }: { label: string, value: number, type?: 'needle' | 'horizon' | 'compass' }) => {
  return (
    <div className="relative w-24 h-24 bg-slate-900 rounded-full border-2 border-slate-700 shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden group">
      {/* 반사광 효과 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-full pointer-events-none z-20" />
      
      {/* 나사 디테일 */}
      <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-slate-600 rounded-full opacity-50" />
      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-slate-600 rounded-full opacity-50" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-slate-600 rounded-full opacity-50" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-slate-600 rounded-full opacity-50" />

      {type === 'horizon' ? (
        // 인공 수평의 (Attitude Indicator)
        <div className="w-full h-full relative">
          <div className="absolute inset-0 bg-sky-600 h-1/2" />
          <div className="absolute inset-0 top-1/2 bg-amber-700 h-1/2" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-[1px] bg-white opacity-80" />
            <div className="absolute w-12 h-[2px] bg-yellow-400" />
          </div>
          {/* 눈금 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-50">
            <div className="w-6 h-[1px] bg-white" />
            <div className="w-8 h-[1px] bg-white" />
            <div className="w-6 h-[1px] bg-white" />
          </div>
        </div>
      ) : type === 'compass' ? (
        // 방향 자이로 (Heading Indicator)
        <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
          <div className="absolute inset-2 border border-white/20 rounded-full" />
          {/* 나침반 눈금 */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div 
              key={deg} 
              className="absolute w-full h-full" 
              style={{ transform: `rotate(${deg}deg)` }}
            >
              <div className="mx-auto w-[1px] h-2 bg-white/60 mt-1.5" />
            </div>
          ))}
          <div className="text-[10px] font-mono text-white font-bold mb-4">N</div>
          {/* 비행기 아이콘 */}
          <div className="absolute text-orange-500">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <path d="M12 2L2 22l10-2 10 2L12 2z" />
             </svg>
          </div>
        </div>
      ) : (
        // 일반 바늘 게이지 (Needle Gauge)
        <div className="w-full h-full relative flex items-center justify-center">
          {/* 눈금 */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div 
              key={deg} 
              className="absolute w-full h-full" 
              style={{ transform: `rotate(${deg}deg)` }}
            >
              <div className="mx-auto w-[1px] h-1.5 bg-white/40 mt-1.5" />
            </div>
          ))}
          {/* 바늘 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-0.5 h-10 bg-red-500 origin-bottom rounded-full"
            style={{ 
              marginTop: '-40px',
              marginLeft: '-1px'
            }}
            animate={{ rotate: [value - 10, value + 10, value - 5, value + 5, value] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <div className="absolute w-3 h-3 bg-slate-300 rounded-full z-10 shadow-sm" />
        </div>
      )}

      <div className="absolute bottom-2.5 text-[10px] font-mono text-green-400 font-bold bg-black/50 px-1.5 rounded">
        {label}
      </div>
    </div>
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
          className={`absolute rounded-full bg-green-400 opacity-70 ${blip.size === 'small' ? 'w-1 h-1' :
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
  data: EconomicData | null;
}

export default function EconomicRadarSection({
  onViewCycleFeatures,
  onViewCurrentStatus,
  data
}: EconomicRadarSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (data) setIsLoaded(true);
    console.info('[ECONOMIC_RADAR] radar section loaded');
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-green-400 font-mono animate-pulse">Initializing Economic Radar System...</div>
      </div>
    );
  }

  const metrics = [
    {
      key: 'yield_curve',
      label: '장단기 금리차 (10년-2년)',
      value: data.indicators_snapshot?.yield_curve?.value ?? 0,
      unit: '%p',
      trend: (data.indicators_snapshot?.yield_curve?.value ?? 0) < 0 ? 'down' : 'up'
    },
    {
      key: 'unemployment',
      label: '미국 실업률',
      value: data.indicators_snapshot?.unemployment_rate?.value ?? 0,
      unit: '%',
      trend: (data.indicators_snapshot?.unemployment_rate?.mom_change ?? 0) > 0 ? 'up' : 'down'
    },
    {
      key: 'exchange',
      label: '원/달러 환율',
      value: data.indicators_snapshot?.usd_krw?.value ?? 0,
      unit: ' KRW',
      trend: (data.indicators_snapshot?.usd_krw?.mom_change ?? 0) > 0 ? 'up' : 'down'
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-950/80" />

      {/* 메인 컨테이너 */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        
        {/* 헤더 및 타이틀 */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg border border-green-400/30 bg-black/20 px-4 py-2 text-green-400 hover:bg-green-400/10 transition-all duration-300 font-mono text-sm uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>대시보드로 돌아가기</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 ml-0 md:ml-2">
            <div className="text-green-400 font-mono text-lg uppercase tracking-wider font-bold">
              Economic Radar System
            </div>
            <div className="hidden md:block text-green-400/30">|</div>
            <div className="text-green-300/70 font-mono text-xs uppercase tracking-wider">
              Real-time Economic Analysis
            </div>
          </div>
        </div>

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
              <div className="font-mono text-green-300 text-sm leading-relaxed min-h-[4em]">
                {isLoaded && <TypewriterText text={data.summary_text} delay={40} />}
              </div>
            </motion.div>

            {/* 키 메트릭 그리드 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              {metrics.map((metric, index) => (
                <div key={metric.key} className="backdrop-blur-md bg-black/40 border border-white/10 rounded-xl p-4">
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
                    {metric.value.toLocaleString()}{metric.unit}
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
            className="relative h-full"
          >
            <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-xl p-8 h-full flex flex-col">
              <h2 className="text-center text-green-400 font-mono text-lg uppercase tracking-wider mb-8 shrink-0">
                경제순환기 레이더
              </h2>

              {/* 레이더 컨테이너 */}
              <div className="flex-1 flex items-center justify-center w-full min-h-0">
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  {/* Radar Sweep Animation */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 w-[95%] h-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                    style={{
                      background: "conic-gradient(from 0deg, transparent 60%, rgba(16, 185, 129, 0.05) 80%, rgba(16, 185, 129, 0.3) 100%)",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

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
              
              {/* 비행기 조종석 계기판 스타일 대시보드 */}
              <div className="mt-8 pt-6 border-t border-white/10 shrink-0">
                <div className="flex justify-center flex-wrap gap-2 md:gap-4 lg:gap-2 xl:gap-6">
                  <CockpitGauge label="SYS.STABLE" value={45} type="horizon" />
                  <CockpitGauge label="DATA.FLUX" value={135} type="compass" />
                  <CockpitGauge label="COMP.LOAD" value={220} type="needle" />
                </div>
                {/* 패널 나사 장식 */}
                <div className="flex justify-between mt-2 px-4 opacity-30">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-inner border border-gray-700">
                    <div className="w-full h-[1px] bg-gray-800 rotate-45 mt-[3px]" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-inner border border-gray-700">
                    <div className="w-full h-[1px] bg-gray-800 rotate-12 mt-[3px]" />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}