import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

export async function GET() {
    try {
        const supabase = getServiceRoleClient();

        const sampleData = {
            status_color: 'Yellow',
            summary_text: '미국 장단기 금리차가 -0.42%p로 역전된 상태가 수개월째 지속되고 있습니다. 실업률은 4.1%로 연초 대비 소폭 상승하며 경기 둔화의 신호를 보내고 있습니다.',
            historical_pattern: '과거 1980년과 2007년의 침체기 직전과 매우 유사한 패턴을 보이고 있습니다. 보통 금리 역전 후 12~18개월 내에 실제 경기가 꺾였던 점을 감안할 때, 2026년 상반기 대응 전략이 중요해 보입니다.',
            indicators_snapshot: {
                yield_curve: {
                    value: -0.42,
                    unit: '%p',
                    date: new Date().toISOString().split('T')[0],
                    source: 'FRED:T10Y2Y'
                },
                unemployment_rate: {
                    value: 4.1,
                    unit: '%',
                    mom_change: 0.1,
                    date: new Date().toISOString().split('T')[0],
                    source: 'FRED:UNRATE'
                },
                usd_krw: {
                    value: 1345.5,
                    unit: 'KRW',
                    mom_change: 15.2,
                    date: new Date().toISOString().split('T')[0],
                    source: 'FRED:DEXKOUS'
                }
            }
        };

        const { data, error } = await supabase
            .from('cycle_explanations')
            .insert([sampleData])
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            message: '테스트 데이터가 성공적으로 입력되었습니다!',
            data
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
