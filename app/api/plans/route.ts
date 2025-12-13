import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

type SubscriptionRow = {
    tier: 'free' | 'premium';
    current_period_end: string | null;
} | null;

function isPremiumSubscription(sub: SubscriptionRow) {
    if (!sub) return false;
    if (sub.tier !== 'premium') return false;
    if (!sub.current_period_end) return true;
    return new Date(sub.current_period_end).getTime() > Date.now();
}

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

        const url = new URL(req.url);
        const returnAll = url.searchParams.get('all') === '1';

        if (returnAll) {
            let subscription: SubscriptionRow = null;
            const { data: sub, error: subError } = await supabase
                .from('subscriptions')
                .select('tier, current_period_end')
                .eq('user_id', user.id)
                .maybeSingle();

            if (subError) {
                // If the table isn't created yet, treat as free.
                console.error('Error fetching subscription:', subError);
            } else {
                subscription = (sub as SubscriptionRow) ?? null;
            }

            const isPremium = isPremiumSubscription(subscription);
            if (!isPremium) {
                return NextResponse.json(
                    {
                        error: 'Premium requerido para ver el historial de evaluaciones.',
                        code: 'PREMIUM_REQUIRED',
                    },
                    { status: 403 }
                );
            }

            const { data: plans, error } = await supabase
                .from('habit_plans')
                .select('id, user_id, created_at, assessment, habits, summary')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                console.error('Error fetching plans:', error);
                return NextResponse.json(
                    { error: 'Failed to fetch plans' },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                (plans ?? []).map((plan) => ({
                    id: plan.id,
                    userId: plan.user_id,
                    createdAt: plan.created_at,
                    assessment: plan.assessment,
                    habits: plan.habits,
                    summary: plan.summary,
                }))
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
