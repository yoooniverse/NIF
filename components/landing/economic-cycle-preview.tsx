"use client";

import { motion } from "framer-motion";

export function EconomicCyclePreview() {
  const blips = [
    { x: 30, y: 30, size: 'small' },   // Top-Left (둔화기)
    { x: 70, y: 35, size: 'medium' },  // Top-Right (회복기)
    { x: 40, y: 75, size: 'medium' },  // Bottom-Left (침체기)
    { x: 80, y: 65, size: 'small' },   // Bottom-Right (확장기)
    { x: 55, y: 45, size: 'small' },   // Near Center
  ];

  return (
    <div className="w-full h-full bg-[#020617] p-4 flex items-center justify-center min-h-[300px]">
      <div className="relative w-full max-w-md aspect-square">
        <h2 className="text-center text-green-400 font-mono text-lg uppercase tracking-wider mb-8 absolute top-0 w-full z-10 font-bold">
          경제순환기 레이더
        </h2>
        <div className="relative w-full h-full mt-8">
          {/* Radar Sweep Animation - 배경에 배치 */}
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

          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="radarGradient-preview" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                <stop offset="70%" stopColor="#10B981" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </radialGradient>
            </defs>
            
            {/* Main Gradient Circle (No Stroke) */}
            <circle cx="200" cy="200" r="190" fill="url(#radarGradient-preview)" />
            
            {/* Grid Circles (Stroked) */}
            <circle cx="200" cy="200" r="190" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.4" />
            <circle cx="200" cy="200" r="130" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.4" />
            <circle cx="200" cy="200" r="70" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.4" />
            
            {/* Grid Lines */}
            <line x1="200" y1="10" x2="200" y2="390" stroke="#10B981" strokeWidth="1.5" opacity="0.4" />
            <line x1="10" y1="200" x2="390" y2="200" stroke="#10B981" strokeWidth="1.5" opacity="0.4" />
            
            {/* Direction Labels */}
            <text x="200" y="25" textAnchor="middle" className="fill-green-500 font-mono text-xs font-bold opacity-90">N</text>
            <text x="375" y="205" textAnchor="middle" className="fill-green-500 font-mono text-xs font-bold opacity-90">E</text>
            <text x="200" y="395" textAnchor="middle" className="fill-green-500 font-mono text-xs font-bold opacity-90">S</text>
            <text x="25" y="205" textAnchor="middle" className="fill-green-500 font-mono text-xs font-bold opacity-90">W</text>
            
            {/* Phase Labels - 스캔 효과 위에 선명하게 표시 */}
            <text x="300" y="130" textAnchor="middle" className="fill-green-100 font-mono text-sm opacity-90 font-bold">회복기</text>
            <text x="100" y="130" textAnchor="middle" className="fill-green-100 font-mono text-sm opacity-90 font-bold">둔화기</text>
            <text x="100" y="270" textAnchor="middle" className="fill-green-100 font-mono text-sm opacity-90 font-bold">침체기</text>
            <text x="300" y="270" textAnchor="middle" className="fill-green-100 font-mono text-sm opacity-90 font-bold">확장기</text>
          </svg>
          
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
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-green-400 rounded-full opacity-80 shadow-[0_0_10px_#4ade80]" />
        </div>
      </div>
    </div>
  );
}
