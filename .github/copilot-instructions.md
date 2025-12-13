# Copilot instructions (welth-ai)

## Project snapshot

- Next.js App Router (Next 16 / React 19) in `app/`.
- AI: Vercel AI SDK + Gemini.
  - Streaming chat is Edge runtime: `app/api/chat/route.ts`.
  - Assessment generation is Node runtime: `app/api/assessment/route.ts`.
- Auth + persistence: Supabase Auth + Postgres.
  - Browser client: `lib/supabase/client.ts`.
  - Server client (cookies are async in this Next version): `lib/supabase/server.ts`.
  - Route protection: `middleware.ts` for `/dashboard/:path*`.

## Commands / workflows

- Dev: `npm run dev`
- Lint: `npm run lint`
- Build / prod: `npm run build`, `npm run start`

## Required env vars

- `GOOGLE_GENERATIVE_AI_API_KEY` (required for `/api/chat` and `/api/assessment`)
- `GEMINI_MODEL` (optional; defaults to `gemini-2.0-flash`)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Data flow (end-to-end)

- UI submits an assessment from `app/_components/AssessmentForm.tsx` → `POST /api/assessment`.
- API generates a plan using `buildAssessmentPrompt()` in `app/lib/prompts.ts` and Gemini (`ai` + `@ai-sdk/google`).
- API persists the plan in Supabase table `habit_plans` (see schema in `README.md`).
- Tracking view loads latest plan via `GET /api/plans` from `app/dashboard/tracking/page.tsx`.

## Supabase conventions (important)

- Username is the “real” identity in the UI; internally we use a synthetic email `${username}@welth.local` for Supabase Email Auth.
  - Registration/login UI: `app/auth/page.tsx`.
  - The displayed name prefers `user.user_metadata.username`.
- DB tables + RLS:
  - `profiles(user_id PK, username UNIQUE)` to enforce unique usernames.
  - `habit_plans(user_id FK, assessment jsonb, habits jsonb, summary text)`.
- Server-side access always derives user from cookies:
  - In API routes use `const supabase = await createSupabaseServerClient(); await supabase.auth.getUser();`
  - Do not pass `userId` from the client (RLS + session are the source of truth).

## Runtime boundaries

- Keep `app/api/chat/route.ts` Edge-safe (no Node-only APIs).
- `app/api/assessment/route.ts` and `app/api/plans/route.ts` run on `nodejs` runtime and can use Node-compatible libs.

## UI conventions

- Tailwind v4 theme tokens are defined in `app/globals.css` via `@theme` (avoid hard-coding new colors).
- Reuse existing UI primitives in `components/ui/*` (Radix + CVA patterns).

## Legacy code to avoid

- `app/lib/storage.ts` is deprecated (old JSON file persistence). Use Supabase-backed API routes instead.
- `lib/auth.ts` was the old localStorage auth; current flows use Supabase.
- `PROYECTO.md` describes some legacy flow (e.g., `userId` in requests) and may be outdated vs the Supabase-backed implementation.
