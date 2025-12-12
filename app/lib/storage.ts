import { promises as fs } from 'fs';
import path from 'path';
import type { HabitPlan } from '@/app/types/assessment';

const DATA_DIR = path.join(process.cwd(), 'data');
const PLANS_FILE = path.join(DATA_DIR, 'habit-plans.json');

export async function ensureDataDirectory() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

export async function savePlan(plan: HabitPlan): Promise<void> {
    await ensureDataDirectory();

    let plans: HabitPlan[] = [];
    try {
        const data = await fs.readFile(PLANS_FILE, 'utf-8');
        plans = JSON.parse(data);
    } catch {
        // File doesn't exist yet, start with empty array
    }

    // Add new plan
    plans.push(plan);

    // Save back to file
    await fs.writeFile(PLANS_FILE, JSON.stringify(plans, null, 2));
}

export async function getPlansByUserId(userId: number): Promise<HabitPlan[]> {
    try {
        const data = await fs.readFile(PLANS_FILE, 'utf-8');
        const plans: HabitPlan[] = JSON.parse(data);
        return plans.filter(plan => plan.userId === userId);
    } catch {
        return [];
    }
}

export async function getLatestPlanByUserId(userId: number): Promise<HabitPlan | null> {
    const plans = await getPlansByUserId(userId);
    if (plans.length === 0) return null;

    // Sort by createdAt descending and return the most recent
    return plans.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
}
