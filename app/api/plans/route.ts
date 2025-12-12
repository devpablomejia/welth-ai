import { NextResponse } from 'next/server';
import { getLatestPlanByUserId } from '@/app/lib/storage';

export const runtime = 'nodejs';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json(
            { error: 'userId is required' },
            { status: 400 }
        );
    }

    try {
        const plan = await getLatestPlanByUserId(Number(userId));

        if (!plan) {
            return NextResponse.json(
                { error: 'No plan found for this user' },
                { status: 404 }
            );
        }

        return NextResponse.json(plan);
    } catch (error) {
        console.error('Error fetching plan:', error);
        return NextResponse.json(
            { error: 'Failed to fetch plan' },
            { status: 500 }
        );
    }
}
