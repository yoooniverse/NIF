/**
 * 경제 지표를 기반으로 신호등 색상(위험도)을 결정하는 로직
 */

interface Indicators {
    yieldCurveDiff: number;    // 장단기 금리차 (10Y - 2Y)
    unemploymentRate: number;  // 실업률 (현재 값)
    unemploymentMoM: number;   // 실업률 전월 대비 변화량
    usdKrwChange: number;      // 원/달러 환율 전월 대비 변화량
}

export type StatusColor = 'Red' | 'Yellow' | 'Green';

export function determineStatusColor(indicators: Indicators): StatusColor {
    const { yieldCurveDiff, unemploymentMoM, usdKrwChange } = indicators;

    let riskScore = 0;

    // 1. 장단기 금리차 (가장 중요한 지표)
    // -0.5%p 이하면 매우 위험 (역전 심화)
    if (yieldCurveDiff < -0.5) {
        riskScore += 3;
    } else if (yieldCurveDiff < 0) {
        riskScore += 2;
    } else if (yieldCurveDiff < 0.3) {
        riskScore += 1;
    }

    // 2. 실업률 (전월 대비 증가폭)
    // 0.3%p 이상 급증 시 위험 (삼의 법칙 유사 변형)
    if (unemploymentMoM > 0.3) {
        riskScore += 2;
    } else if (unemploymentMoM > 0.1) {
        riskScore += 1;
    }

    // 3. 원/달러 환율 (전월 대비 급등)
    // 50원 이상 급등 시 외환 시장 불안
    if (usdKrwChange > 50) {
        riskScore += 2;
    } else if (usdKrwChange > 30) {
        riskScore += 1;
    }

    // 최종 신호등 결정
    if (riskScore >= 5) return 'Red';    // 위험
    if (riskScore >= 3) return 'Yellow'; // 주의
    return 'Green';                      // 양호
}
