import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

export async function GET() {
    try {
        const supabase = getServiceRoleClient();

        const sampleData = {
            status_color: 'Yellow',
            summary_text: '미국 장단기 금리차가 -0.42%p로 역전된 상태가 수개월째 지속되고 있습니다. 실업률은 4.1%로 연초 대비 소폭 상승하며 경기 둔화의 신호를 보내고 있습니다.',
            yield_curve: -0.42,
            unemployment_rate: 4.1,
            usd_krw: 1345.5,
            updated_at: new Date().toISOString()
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
