/**
 * Deprecated.
 *
 * This project previously persisted habit plans to `data/habit-plans.json`.
 * Persistence is now handled by Supabase (see `/api/assessment` and `/api/plans`).
 */
export function deprecatedStorageModule(): never {
    throw new Error(
        'app/lib/storage.ts is deprecated. Use Supabase-backed API routes instead.',
    );
}
