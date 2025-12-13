import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
    try {
        const supabase = await createSupabaseServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no autenticado' },
                { status: 401 }
            );
        }

        const { data: plan, error } = await supabase
            .from('habit_plans')
            .select('id, user_id, created_at, assessment, habits, summary')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('Error fetching plan:', error);
            return NextResponse.json(
                { error: 'Failed to fetch plan' },
                { status: 500 }
            );
        }

        if (!plan) {
            return NextResponse.json(
                { error: 'No plan found for this user' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: plan.id,
            userId: plan.user_id,
            createdAt: plan.created_at,
            assessment: plan.assessment,
            habits: plan.habits,
            summary: plan.summary,
        });
    } catch (error) {
        console.error('Error fetching plan:', error);
        return NextResponse.json(
            { error: 'Failed to fetch plan' },
            { status: 500 }
        );
    }
}
