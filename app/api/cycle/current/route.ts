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

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('[CYCLE_API] Unexpected error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message
        }, { status: 500 });
    }
}
