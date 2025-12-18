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

// Mock 데이터 (실제로는 API에서 가져옴)
const MOCK_CYCLE_DATA = {
  status_color: 'Yellow' as const,
  summary_text: '미국 장단기 금리차가 -0.4%p로 역전된 상태가 지속되고 있습니다. 실업률은 4.2%로 안정세를 보이지만, 원/달러 환율이 전월 대비 35.2원 상승하며 변동성이 확대되고 있습니다.',
  historical_pattern: '과거 1980년 이후 금리차가 역전된 사례에서, 평균 12~18개월 후 경기 침체(Recession)가 뒤따랐던 역사적 패턴이 관찰됩니다. 현재 상황은 2007년 금융위기 직전의 패턴과 유사하며, 실업률 상승이 아직 미미한 수준임을 고려할 때 주의 단계로 평가됩니다.',
  indicators_snapshot: {
    yield_curve: {
      value: -0.42,
      unit: '%p',
      date: '2025-12-11',
      source: 'FRED:T10Y2Y'
    },
    unemployment_rate: {
      value: 4.2,
      unit: '%',
      mom_change: 0.1,
      date: '2025-11-30',
      source: 'FRED:UNRATE'
    },
    usd_krw: {
      value: 1330.5,
      unit: 'KRW',
      mom_change: 35.2,
      date: '2025-12-11',
      source: 'FRED:DEXKOUS'
    }
  },
  updated_at: '2025-12-12T09:00:00Z'
};

export default function CyclePage() {
  const [showModal, setShowModal] = useState(false);
  const [showCycleModal, setShowCycleModal] = useState(false);

  useEffect(() => {
    // 핵심 기능 로그: 경제 순환기 지도 페이지 로드
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
    <div className="min-h-screen bg-[#020617] text-white">
      {/* 헤더 - Military HUD 스타일 */}
      <div className="border-b border-green-400/20 bg-black/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-4">
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
      />

      {/* 경제 순환기 특징 모달 - Military HUD 스타일 */}
      {showCycleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#020617] border border-green-400/20 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto backdrop-blur-md">
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
                  <div key={phase.phase} className="rounded-xl border border-green-400/20 bg-black/40 backdrop-blur-md p-6 mb-4">
                    <div className="flex items-start gap-4 mb-4">
                      {/* 단계 번호 */}
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg font-mono border-2 ${
                          index === 0 ? 'bg-green-500/20 border-green-400 text-green-400' :
                          index === 1 ? 'bg-blue-500/20 border-blue-400 text-blue-400' :
                          index === 2 ? 'bg-yellow-500/20 border-yellow-400 text-yellow-400' :
                          'bg-red-500/20 border-red-400 text-red-400'
                        }`}>
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
                      <div className="p-4 bg-green-400/5 rounded-lg border border-green-400/20">
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
          <div className="w-full max-w-2xl bg-[#020617] border border-green-400/20 rounded-xl shadow-2xl backdrop-blur-md">
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
                <div className="flex items-center gap-6 p-6 bg-black/40 border border-green-400/20 rounded-xl backdrop-blur-md">
                  <div className={`w-20 h-20 rounded-full ${getTrafficLightColor(MOCK_CYCLE_DATA.status_color)} flex items-center justify-center shadow-lg border-2 border-white/20`}>
                    <div className="text-white font-bold text-2xl">
                      {MOCK_CYCLE_DATA.status_color === 'Yellow' ? '⚠️' : '🚦'}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-1 font-mono uppercase tracking-wider">{getTrafficLightText(MOCK_CYCLE_DATA.status_color)}</div>
                    <div className="text-green-300/70 font-mono text-sm uppercase tracking-wider">Status: {MOCK_CYCLE_DATA.status_color}</div>
                  </div>
                </div>

                {/* 상세 설명 */}
                <div className="p-6 bg-black/40 border border-green-400/20 rounded-xl backdrop-blur-md">
                  <p className="text-green-300/80 leading-relaxed font-mono text-sm">{MOCK_CYCLE_DATA.summary_text}</p>
                </div>

                {/* 주요 지표 요약 */}
                <div className="grid grid-cols-3 gap-4 p-6 bg-black/40 border border-green-400/20 rounded-xl backdrop-blur-md">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 font-mono">{MOCK_CYCLE_DATA.indicators_snapshot.yield_curve.value}%p</div>
                      <div className="text-green-300/70 font-mono text-xs uppercase tracking-wider">금리차</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 font-mono">{MOCK_CYCLE_DATA.indicators_snapshot.unemployment_rate.value}%</div>
                      <div className="text-green-300/70 font-mono text-xs uppercase tracking-wider">실업률</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 font-mono">{MOCK_CYCLE_DATA.indicators_snapshot.usd_krw.value.toLocaleString()}</div>
                      <div className="text-green-300/70 font-mono text-xs uppercase tracking-wider">원/달러</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}