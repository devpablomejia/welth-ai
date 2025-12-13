export enum UserSex {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}

export enum ActivityLevel {
    SEDENTARY = "SEDENTARY",
    LIGHTLY_ACTIVE = "LIGHTLY_ACTIVE",
    MODERATELY_ACTIVE = "MODERATELY_ACTIVE",
    VERY_ACTIVE = "VERY_ACTIVE",
    EXTREMELY_ACTIVE = "EXTREMELY_ACTIVE"
}

export enum EndOfDayFeeling {
    EXHAUSTED = "EXHAUSTED",
    TIRED = "TIRED",
    NEUTRAL = "NEUTRAL",
    ENERGETIC = "ENERGETIC",
    VERY_ENERGETIC = "VERY_ENERGETIC"
}

export enum AlcoholFrequency {
    NEVER = "NEVER",
    RARELY = "RARELY",
    OCCASIONALLY = "OCCASIONALLY",
    WEEKLY = "WEEKLY",
    DAILY = "DAILY"
}

export interface AssessmentRequest {
    age: number;
    weightKg: number;
    heightM: number;
    userSex: UserSex;
    wakeTime: string; // ISO 8601 time string
    sleepTime: string; // ISO 8601 time string
    breakfastTime: string; // ISO 8601 time string
    lunchTime: string; // ISO 8601 time string
    dinnerTime: string; // ISO 8601 time string
    waterCupsDay: number;
    wakeDifficulty: number; // 1-10 scale
    nightAwakenings: number;
    sleepRepairScore: number; // 1-10 scale
    sleepOnsetScore: number; // 1-10 scale
    activityLevel: ActivityLevel;
    exerciseFrequencyPerWeek: number;
    stressLevel: number; // 1-10 scale
    endOfDayFeeling: EndOfDayFeeling;
    wellbeingScore: number; // 1-10 scale
    readinessChange: number; // 1-10 scale
    confidenceChange: number; // 1-10 scale
    drinksAlcohol: boolean;
    alcoholFrequency: AlcoholFrequency;
    smokesTobacco: boolean;
    tobaccoUnitsPerDay: number;
    fruitServingsDay: number;
    vegetableServingsDay: number;
    processedFoodWeek: number;
}

export interface Habit {
    id: string;
    title: string;
    description: string;
    category: string;
    frequency: string;
    timeOfDay?: string;
    priority: "high" | "medium" | "low";
    reasoning: string;
}

export interface HabitPlan {
    id?: string;
    userId: string;
    createdAt: string;
    assessment: AssessmentRequest;
    habits: Habit[];
    summary: string;
}
