Proyecto Next.js (App Router) con Vercel AI SDK + Gemini.

## Getting Started

### 1) Configura variables de entorno

- Copia `.env.example` a `.env.local`
- Completa `GOOGLE_GENERATIVE_AI_API_KEY`
- Completa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 1.1) Configura Supabase (Auth + DB)

1. Crea un proyecto en Supabase.
2. En **Authentication → Providers** habilita **Email**.
   - En **Authentication → Settings** desactiva **Confirm email** (no usamos email real).
   - Asegúrate de presionar **Save changes** si aparece el botón.
3. (Opcional) En **Authentication → URL Configuration** configura `Site URL` (por ejemplo `http://localhost:3000`).
4. En **Project Settings → API** copia:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Verifica que el **project ref** del dashboard coincida con el de tu `NEXT_PUBLIC_SUPABASE_URL` (ej: `https://<ref>.supabase.co`).
5. En **SQL Editor** crea las tablas usadas por el backend:

```sql
create extension if not exists pgcrypto;

-- Profiles (username is the real unique identity)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "read own profile"
on public.profiles
for select
using (auth.uid() = user_id);

create policy "insert own profile"
on public.profiles
for insert
with check (auth.uid() = user_id);

create policy "update own profile"
on public.profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Stores generated habit plans per user
create table if not exists public.habit_plans (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users(id) on delete cascade,
	created_at timestamptz not null default now(),
	assessment jsonb not null,
	habits jsonb not null,
	summary text not null
);

alter table public.habit_plans enable row level security;

-- Users can only read their own plans
create policy "read own habit plans"
on public.habit_plans
for select
using (auth.uid() = user_id);

-- Users can only create plans for themselves
create policy "insert own habit plans"
on public.habit_plans
for insert
with check (auth.uid() = user_id);
```

### 2) Corre el proyecto

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Endpoint

- POST `/api/chat` (streaming) usando el modelo definido por `GEMINI_MODEL`.
- POST `/api/assessment` genera y persiste el plan en Supabase.
- GET `/api/plans` devuelve el último plan del usuario autenticado.

Nota: el usuario es la identidad real y es único. Internamente usamos Supabase Email Auth con un email **sintético** (por ejemplo `usuario@welth.local`) solo para cumplir el requisito de Supabase; no pedimos ni almacenamos un email real.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
