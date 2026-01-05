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
    description: '경제가 바닥을 찍고, 조금씩 살아나기 시작하는 시기',
    characteristics: [
      '일자리를 잃는 사람이 더 이상 늘지 않고, 서서히 줄기 시작함',
      '공장과 회사들이 다시 조금씩 물건을 더 만들기 시작함',
      '주식시장이 먼저 반등하며 오르기 시작함',
      '기업들이 다시 돈을 벌기 시작함',
      '대출·카드 사용이 조금씩 늘어남'
    ],
    historicalPattern: '보통 큰 불황이 끝난 뒤 약 6~12개월 정도 이어짐. 실제 경제가 좋아지기 전에 주식시장이 먼저 반응하는 경우가 많음. 2009년 금융위기 이후에는 IT·기술 기업을 중심으로 강한 반등이 나타났음.'
  },
  {
    phase: '확장기',
    color: 'bg-blue-500',
    description: '경제가 본격적으로 잘 돌아가고, 모두가 활기를 느끼는 시기',
    characteristics: [
      '일자리가 계속 늘어나고 취업이 잘 됨',
      '회사들이 빠르게 성장하고 생산량이 크게 증가함',
      '사람들의 소비가 늘어남 (쇼핑·여행·외식 증가)',
      '기업들이 새로운 사업과 투자를 적극적으로 시작함',
      '물가가 서서히 오르기 시작함'
    ],
    historicalPattern: '확장기는 보통 3~5년 정도 지속됨. 이 시기에 주식시장이 가장 크게 오르는 경우가 많음. 1980~1990년대에는 7~10년 가까이 호황이 이어진 적도 있음.'
  },
  {
    phase: '둔화기',
    color: 'bg-yellow-500',
    description: '경제는 아직 성장 중이지만, 힘이 빠지기 시작하는 시기',
    characteristics: [
      '이자율이 올라가면서 대출 부담이 커짐',
      '사람들의 소비가 예전만큼 늘지 않음',
      '기업들의 수익이 예전보다 덜 늘어남',
      '새 사업이나 투자를 미루는 회사가 많아짐',
      '주식시장이 자주 흔들리고 불안해짐'
    ],
    historicalPattern: '보통 경기가 너무 뜨거워진 뒤 나타남. 중앙은행이 "과열됐다"고 판단해 돈줄을 조이기 시작함. 2006~2007년, 2022년처럼 큰 위기 직전에 자주 나타난 단계.'
  },
  {
    phase: '침체기',
    color: 'bg-red-500',
    description: '경제가 실제로 힘들어지고, 모두가 움츠러드는 시기',
    characteristics: [
      '실직자가 늘어나고 취업이 어려워짐',
      '소비와 투자가 크게 줄어듦',
      '회사들이 문을 닫거나 구조조정을 단행함',
      '주식시장과 자산 가격이 크게 하락함',
      '금융시장 전반에 불안감이 퍼짐'
    ],
    historicalPattern: '침체기는 보통 6개월~1년 반 정도 지속됨. 정부와 중앙은행이 급하게 돈을 풀고 금리를 내림. 2008년 금융위기, 2020년 코로나 이후에는 강한 회복기가 뒤따라옴.'
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