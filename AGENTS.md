# Agent Instructions for Pantry to Store

## Project Overview
Pantry to Store is a Nuxt 4 (Vue 3, TypeScript) static-first application. Public pages are pre-rendered via `nuxi generate` for S3 + CloudFront hosting. A single Nitro serverless proxy (`/api/spoonacular/*`) handles Spoonacular API calls with caching (secrets live only server-side). Supabase Auth (client-side) powers gated features with Postgres RLS.

## Key Principles
- Static-first: prefer pre-rendered/static content. No secrets in client bundle.
- Vanilla CSS with design tokens (`assets/css/main.css`) and scoped component styles. Use Reka UI (headless) for interactive primitives.
- TypeScript strict mode. No `any` unless unavoidable and justified.
- Follow existing code style, patterns, and conventions in the codebase.
- Security: never log secrets/keys; RLS is the backend truth.
- SEO: maintain JSON-LD, canonical URLs, proper meta tags, robots/sitemap rules.

## Common Commands
- Dev: `npm run dev`
- Build (static): `npm run generate` or `npx nuxt generate`
- Build (full): `npm run build`
- Preview: `npm run preview`
- Type check: `npx nuxt typecheck` or `npx vue-tsc --noEmit`
- Lint: `npx eslint .` (if configured) — only run if config exists

## Codebase Notes
- Curated content lives in `app/content/` (recipes, collections, types). Home page uses curated editorial content.
- API proxy routes in `server/routes/api/spoonacular/` call server utils in `server/utils/spoonacular.ts`.
- Search supports pantry + dish modes with URL-shared state; pagination via `offset`/`number`.
- Home sections use seeded daily randomization (`app/utils/randomize.ts`) for daily fresh recommendations.
- AdSense: `<AdSlot>` only renders when configured and content-gated per recipe rules.

## When Making Changes
- Read surrounding files first to match existing patterns (imports, naming, styling).
- Update types in `app/utils/spoonacular.types.ts` if API shapes change.
- Keep proxy backward compatible; existing consumers expect current return shapes.
- For search pagination, preserve filter/mode state and reset offset on new searches.
- For home randomization, ensure deterministic by date (YYYY-MM-DD) for static builds.

## Git & Commits
- Only commit when explicitly requested by the user.
- Write concise, conventional commit messages matching repo style.
- Never commit secrets, API keys, or credentials.
