import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import type { AssessmentRequest, HabitPlan, Habit } from '@/app/types/assessment';
import { buildAssessmentPrompt } from '@/app/lib/prompts';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const FREE_EVALUATION_LIMIT = 10;

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

export async function POST(req: Request) {
    try {
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            return NextResponse.json(
                { error: 'Missing GOOGLE_GENERATIVE_AI_API_KEY configuration' },
                { status: 500 }
            );
        }

        const supabase = await createSupabaseServerClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
            console.error('Supabase auth error:', authError);
        }

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no autenticado' },
                { status: 401 }
            );
        }

        // Freemium gate: free users can generate up to N evaluations; premium is unlimited.
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
            const { count, error: countError } = await supabase
                .from('habit_plans')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user.id);

            if (countError) {
                console.error('Error counting habit plans:', countError);
                return NextResponse.json(
                    { error: 'Failed to validate plan limit' },
                    { status: 500 }
                );
            }

            const evaluationCount = count ?? 0;
            if (evaluationCount >= FREE_EVALUATION_LIMIT) {
                return NextResponse.json(
                    {
                        error: `Has alcanzado el límite de ${FREE_EVALUATION_LIMIT} evaluaciones gratuitas. Pásate a Premium para evaluaciones ilimitadas e historial completo.`,
                        code: 'FREE_LIMIT_REACHED',
                        limit: FREE_EVALUATION_LIMIT,
                    },
                    { status: 403 }
                );
            }
        }

        const assessment: AssessmentRequest = await req.json();

        // Validate required fields
        if (!assessment.age || !assessment.weightKg) {
            return NextResponse.json(
                { error: 'Missing required fields in assessment' },
                { status: 400 }
            );
        }

        // Premium-only: include recent evaluation history as context for better recommendations.
        // Keep it compact to avoid token bloat.
        let historyContext: string | undefined;
        if (isPremium) {
            const { data: history, error: historyError } = await supabase
                .from('habit_plans')
                .select('created_at, assessment, habits, summary')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(3);

            if (historyError) {
                console.error('Error fetching history context:', historyError);
            } else if (history && history.length > 0) {
                historyContext = history
                    .map((p) => {
                        const createdAt = p.created_at ? new Date(p.created_at).toISOString().slice(0, 10) : 'sin-fecha';
                        const a = (p.assessment ?? {}) as Partial<AssessmentRequest>;
                        const habits = Array.isArray(p.habits) ? (p.habits as Array<Partial<Habit>>) : [];
                        const highPriority = habits
                            .filter((h) => h?.priority === 'high')
                            .slice(0, 3)
                            .map((h) => h?.title)
                            .filter(Boolean)
                            .join('; ');

                        const scores = [
                            typeof a.wellbeingScore === 'number' ? `bienestar=${a.wellbeingScore}` : null,
                            typeof a.stressLevel === 'number' ? `estrés=${a.stressLevel}` : null,
                            typeof a.sleepRepairScore === 'number' ? `sueño=${a.sleepRepairScore}` : null,
                            typeof a.exerciseFrequencyPerWeek === 'number' ? `ejercicio/sem=${a.exerciseFrequencyPerWeek}` : null,
                        ]
                            .filter(Boolean)
                            .join(', ');

                        return `- ${createdAt}${scores ? ` (${scores})` : ''}: ${p.summary}${highPriority ? ` | Hábitos alta prioridad: ${highPriority}` : ''}`;
                    })
                    .join('\n');
            }
        }

        // Build prompt from assessment (and optional premium history context)
        const prompt = buildAssessmentPrompt(assessment, { historyContext });

        // Generate habit plan using AI
        const modelName = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

        const { text } = await generateText({
            model: google(modelName),
            prompt,
            temperature: 0.7,
        });

        // Parse AI response
        let aiResponse;
        try {
            // Try to extract JSON from the response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }
            aiResponse = JSON.parse(jsonMatch[0]);
        } catch {
            console.error('Failed to parse AI response:', text);
            return NextResponse.json(
                { error: 'Failed to parse AI response', details: text },
                { status: 500 }
            );
        }

        // Create habit plan
        const habitPlan: HabitPlan = {
            userId: user.id,
            createdAt: new Date().toISOString(),
            assessment,
            habits: aiResponse.habits as Habit[],
            summary: aiResponse.summary,
        };

        // Persist in Supabase
        const { data: savedPlan, error: saveError } = await supabase
            .from('habit_plans')
            .insert({
                user_id: user.id,
                assessment,
                habits: habitPlan.habits,
                summary: habitPlan.summary,
            })
            .select('id, user_id, created_at, assessment, habits, summary')
            .single();

        if (saveError) {
            console.error('Error saving habit plan:', saveError);
            return NextResponse.json(
                { error: 'Failed to persist habit plan' },
                { status: 500 }
            );
        }

        const responsePlan: HabitPlan = {
            id: savedPlan.id,
            userId: savedPlan.user_id,
            createdAt: savedPlan.created_at,
            assessment: savedPlan.assessment,
            habits: savedPlan.habits,
            summary: savedPlan.summary,
        };

        return NextResponse.json(responsePlan);
    } catch (error) {
        console.error('Error generating habit plan:', error);
        return NextResponse.json(
            {
                error: 'Failed to generate habit plan',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
