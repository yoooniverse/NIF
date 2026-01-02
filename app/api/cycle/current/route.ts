import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = getServiceRoleClient();
        console.log('[CYCLE_API] Fetching current cycle data...');

        const { data, error } = await supabase
            .from('cycle_explanations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('[CYCLE_API] Error fetching current cycle:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return NextResponse.json({
                error: 'Failed to fetch cycle data',
                details: error.message
            }, { status: 500 });
        }

        if (!data) {
            console.warn('[CYCLE_API] No cycle data found in table cycle_explanations');
            return NextResponse.json({ error: 'No cycle data found' }, { status: 404 });
        }

        // Transform data to match frontend expectations
        let summary_text = data.summary_text;
        try {
            // Check if summary_text is a JSON string (could happen if AI output is stored raw)
            const parsed = JSON.parse(summary_text);
            if (parsed && typeof parsed === 'object' && parsed.description) {
                summary_text = parsed.description;
            }
        } catch (e) {
            // Not JSON, use as is
        }

        const transformedData = {
            id: data.id,
            status_color: data.status_color,
            summary_text: summary_text,
            historical_pattern: '', // Not currently in DB
            indicators_snapshot: {
                yield_curve: {
                    value: data.yield_curve ?? 0,
                    unit: '%p',
                    date: data.updated_at,
                    source: 'FRED'
                },
                unemployment_rate: {
                    value: data.unemployment_rate ?? 0,
                    unit: '%',
                    mom_change: 0, // Placeholder
                    date: data.updated_at,
                    source: 'FRED'
                },
                usd_krw: {
                    value: data.usd_krw ?? 0,
                    unit: 'KRW',
                    mom_change: 0, // Placeholder
                    date: data.updated_at,
                    source: 'Investing.com'
                }
            },
            updated_at: data.updated_at
        };

        return NextResponse.json(transformedData);
    } catch (error: any) {
        console.error('[CYCLE_API] Unexpected error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message
        }, { status: 500 });
    }
}
