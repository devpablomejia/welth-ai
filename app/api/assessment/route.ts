import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import type { AssessmentRequest, HabitPlan, Habit } from '@/app/types/assessment';
import { buildAssessmentPrompt } from '@/app/lib/prompts';
import { savePlan } from '@/app/lib/storage';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            return NextResponse.json(
                { error: 'Missing GOOGLE_GENERATIVE_AI_API_KEY configuration' },
                { status: 500 }
            );
        }

        const assessment: AssessmentRequest = await req.json();

        // Validate required fields
        if (!assessment.userId || !assessment.age || !assessment.weightKg) {
            return NextResponse.json(
                { error: 'Missing required fields in assessment' },
                { status: 400 }
            );
        }

        // Build prompt from assessment
        const prompt = buildAssessmentPrompt(assessment);

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
            userId: assessment.userId,
            createdAt: new Date().toISOString(),
            assessment,
            habits: aiResponse.habits as Habit[],
            summary: aiResponse.summary,
        };

        // Save to local file
        await savePlan(habitPlan);

        return NextResponse.json(habitPlan);
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
