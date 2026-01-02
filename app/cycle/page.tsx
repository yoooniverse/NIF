'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import EconomicRadarSection from '@/components/cycle/EconomicRadarSection';

// 경제 순환기 단계별 특징 데이터
const CYCLE_PHASES = [
  {
    phase: '회복기',
    color: 'bg-emerald-500',
    description: '경기 바닥을 지나 상승세로 전환되는 시기',
    characteristics: [
      '실업률이 정점을 찍고 하락하기 시작',
      '생산량 증가율이 점차 높아짐',
      '주가 상승세 시작',
      '기업 이익 증가',
      '신용 이용률 증가'
    ],
    historicalPattern: '역사적으로 회복기는 경기 침체 후 평균 6-12개월 동안 지속되며, 주가 상승률이 GDP 성장률을 앞서는 특징이 있습니다. 2009년 금융위기 이후의 회복기는 특히 강력했으며, 기술주 중심의 상승장이 이어졌습니다.'
  },
  {
    phase: '확장기',
    color: 'bg-blue-500',
    description: '경기가 본격적으로 확장되는 시기',
    characteristics: [
      '실업률 지속 하락',
      '생산량 빠른 증가',
      '소비 지출 증가',
      '투자 활성화',
      '물가 상승 압력'
    ],
    historicalPattern: '확장기는 평균 3-5년 지속되며, 이 기간 동안 주가가 가장 크게 상승하는 경향이 있습니다. 1980년대와 1990년대의 장기 확장기는 각각 92개월과 120개월을 기록했습니다.'
  },
  {
    phase: '둔화기',
    color: 'bg-yellow-500',
    description: '경기 과열이 식으며 성장세가 둔화되는 시기',
    characteristics: [
      '생산량 증가율 둔화',
      '실업률 상승 전환',
      '기업 투자 감소',
      '물가 상승률 정점',
      '금리 인상 가능성'
    ],
    historicalPattern: '둔화기는 확장기의 말기에 발생하며, 평균 6-12개월 지속됩니다. 이 시기에는 금리 인상으로 인해 주식 시장 변동성이 커지며, 일부 기업들의 실적 둔화가 관찰됩니다.'
  },
  {
    phase: '침체기',
    color: 'bg-red-500',
    description: '경기가 급격히 위축되는 시기',
    characteristics: [
      '생산량 감소',
      '실업률 급증',
      '소비 위축',
      '기업 도산 증가',
      '자산 가격 하락'
    ],
    historicalPattern: '침체기는 평균 8-18개월 지속되며, 1970년대 이후 10번의 침체기 중 8번이 16개월 이내에 종료되었습니다. 이 기간 동안 주식 시장은 평균 30-50% 하락하는 경향이 있습니다.'
  }
] as const;

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
  updated_at: string;
}

export default function CyclePage() {
  const [showModal, setShowModal] = useState(false);
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [cycleData, setCycleData] = useState<EconomicData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCycleData = async () => {
      try {
        const response = await fetch('/api/cycle/current');
        if (response.ok) {
          const data = await response.json();
          setCycleData(data);
        } else if (response.status === 404) {
          console.warn('[CYCLE] No data found in cycle_explanations table');
          setCycleData(null); // Explicitly set to null to indicate empty state
        } else {
          console.error('[CYCLE] Failed to fetch cycle data');
        }
      } catch (error) {
        console.error('[CYCLE] Error fetching cycle data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCycleData();
    console.info('[CYCLE] page loaded');
  }, []);

  const getTrafficLightColor = (status: string) => {
    switch (status) {
      case 'Red':
        return 'bg-red-500';
      case 'Yellow':
        return 'bg-yellow-500';
      case 'Green':
        return 'bg-green-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getTrafficLightText = (status: string) => {
    switch (status) {
      case 'Red':
        return '위험';
      case 'Yellow':
        return '주의';
      case 'Green':
        return '양호';
      default:
        return '주의';
    }
  };

  return (
    <>
      <style jsx global>{`
        .custom-modal-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-modal-scroll::-webkit-scrollbar-track {
          background: #020617;
          border-radius: 4px;
        }
        .custom-modal-scroll::-webkit-scrollbar-thumb {
          background: #10B981;
          border-radius: 4px;
          border: 2px solid #020617;
        }
        .custom-modal-scroll::-webkit-scrollbar-thumb:hover {
          background: #22c55e;
        }
        .custom-modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: #10B981 #020617;
        }
      `}</style>
      <div className="min-h-screen bg-[#020617] text-white">
        {/* 헤더 - Military HUD 스타일 */}
        <div className="border-b border-green-400/20 bg-black/40 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg border border-green-400/30 bg-black/20 px-4 py-2 text-green-400 hover:bg-green-400/10 transition-all duration-300 font-mono text-sm uppercase tracking-wider"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>대시보드로 돌아가기</span>
              </Link>
              <div className="flex items-center gap-3">
                <div className="text-green-400 font-mono text-lg uppercase tracking-wider font-bold">
                  Economic Radar System
                </div>
                <div className="text-green-300/70 font-mono text-xs uppercase tracking-wider">
                  Real-time Economic Analysis
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 - Military Economic Radar System */}
        <EconomicRadarSection
          onViewCycleFeatures={() => setShowCycleModal(true)}
          onViewCurrentStatus={() => setShowModal(true)}
          data={cycleData}
        />

        {/* 경제 순환기 특징 모달 - Military HUD 스타일 */}
        {showCycleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div
              className="w-full max-w-4xl bg-[#020617] border border-green-400/20 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto backdrop-blur-md rounded-xl custom-modal-scroll"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-green-400 font-mono text-xl uppercase tracking-wider font-bold">경제 순환기 분석</h3>
                  <button
                    onClick={() => setShowCycleModal(false)}
                    className="p-2 hover:bg-green-400/10 rounded-lg transition-colors border border-green-400/30"
                  >
                    <X className="h-6 w-6 text-green-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  {CYCLE_PHASES.map((phase, index) => (
                    <div key={phase.phase} className="rounded-xl border border-green-400/20 bg-black/40 backdrop-blur-md p-6 mb-4 rounded-xl">
                      <div className="flex items-start gap-4 mb-4">
                        {/* 단계 번호 */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-green-500/20 border-green-400 text-green-400 flex items-center justify-center font-bold text-lg font-mono border-2">
                            {index + 1}
                          </div>
                        </div>

                        {/* 제목과 설명 */}
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-green-400 mb-2 font-mono uppercase tracking-wider">{phase.phase}</h3>
                          <p className="text-green-300/80 text-sm leading-relaxed">{phase.description}</p>
                        </div>
                      </div>

                      {/* 주요 특징 */}
                      <div className="mb-6">
                        <h4 className="text-green-400 font-mono text-sm uppercase tracking-wider mb-4">Key Characteristics</h4>
                        <ul className="space-y-3">
                          {phase.characteristics.map((char, idx) => (
                            <li key={idx} className="text-green-300/70 text-sm flex items-start gap-3">
                              <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 mt-2" />
                              <span>{char}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 역사적 패턴 */}
                      <div>
                        <h4 className="text-green-400 font-mono text-sm uppercase tracking-wider mb-4">Historical Patterns</h4>
                        <div className="p-4 bg-green-400/5 rounded-xl border border-green-400/20">
                          <p className="text-green-300/80 text-sm leading-relaxed">{phase.historicalPattern}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 현재 상황 모달 - Military HUD 스타일 */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#020617] border border-green-400/20 rounded-xl shadow-2xl backdrop-blur-md rounded-xl">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-green-400 font-mono text-xl uppercase tracking-wider font-bold">현재 경제 상황</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-green-400/10 rounded-lg transition-colors border border-green-400/30"
                  >
                    <X className="h-6 w-6 text-green-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* 신호등과 상태 */}
                  <div className="flex items-center gap-6 p-6 bg-black/40 border border-green-400/20 rounded-xl backdrop-blur-md rounded-xl">
                    <div className={`w-20 h-20 rounded-full ${cycleData ? getTrafficLightColor(cycleData.status_color) : 'bg-gray-500'} flex items-center justify-center shadow-lg border-2 border-white/20`}>
                      <div className="text-white font-bold text-2xl">
                        {cycleData?.status_color === 'Yellow' ? '⚠️' : '🚦'}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400 mb-1 font-mono uppercase tracking-wider">{cycleData ? getTrafficLightText(cycleData.status_color) : '데이터 없음'}</div>
                      <div className="text-green-300/70 font-mono text-sm uppercase tracking-wider">Status: {cycleData?.status_color || 'Unknown'}</div>
                    </div>
                  </div>

                  {/* 상세 설명 */}
                  <div className="p-6 bg-black/40 border border-green-400/20 rounded-xl backdrop-blur-md">
                    <p className="text-green-300/80 leading-relaxed font-mono text-sm">{cycleData?.summary_text}</p>
                  </div>

                  {/* 주요 지표 요약 */}
                  <div className="grid grid-cols-3 gap-4 p-6 bg-black/40 border border-green-400/20 rounded-xl backdrop-blur-md rounded-xl">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 font-mono">{cycleData?.indicators_snapshot?.yield_curve?.value ?? 0}%p</div>
                      <div className="text-green-300/70 font-mono text-xs uppercase tracking-wider">금리차</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 font-mono">{cycleData?.indicators_snapshot?.unemployment_rate?.value ?? 0}%</div>
                      <div className="text-green-300/70 font-mono text-xs uppercase tracking-wider">실업률</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 font-mono">{cycleData?.indicators_snapshot?.usd_krw?.value?.toLocaleString() ?? 0}</div>
                      <div className="text-green-300/70 font-mono text-xs uppercase tracking-wider">원/달러</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}