# Pantry to Store — passive income (static)

A **static-first** rebuild of [Pantry to Store](https://pantrytostore.lovable.app) for
near-zero-cost hosting on AWS (S3 + CloudFront + Route 53), SEO-first, AdSense-ready.

See **`PRD - Static Pantry To Store Passive income.md`** (approved, v1.0) for the full
product requirements, architecture, milestones, and decisions.

## Stack

- **Nuxt 4** (Vue 3, Nitro, Vite) — static generation (`nuxt generate`)
- **Vanilla CSS** — design tokens + flexbox, mobile-first (no styling framework)
- **Supabase** — Auth (client-side) + Postgres RLS for accounts/favorites
- Spoonacular proxy — one serverless function (AWS Lambda) for API-key secrecy + caching
- Hosting — AWS S3 + CloudFront + Route 53

## Commands

```bash
npm install
npm run dev        # dev server on http://localhost:3000
npm run generate  # static site → .output/public
npm run typecheck  # vue-tsc typecheck
npm run preview    # preview the generated static site
npm run build      # production build (Nitro)
```

## Env

Copy `.env.example` → `.env` and fill:
- `SPOONACULAR_API_KEY` — server-only, consumed by the `/api/spoonacular/*` proxy
  (never reaches the client bundle)
- `NUXT_PUBLIC_SUPABASE_URL` + `NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — client-safe
- `NUXT_PUBLIC_API_BASE` — proxy origin used by client interactions on the static host
  (empty same-origin in dev / at `nuxt generate`)

## Supabase (accounts/favorites — PRD §6.5–6.6)

Auth runs entirely client-side; favorites are per-user Postgres rows behind RLS.

- **Schema**: applied to the project (`icayuospjyvzzjizqcsa`) via `supabase/init.sql`
  (SQL Editor → run once): profiles, favorites + RLS, auto-profile-on-signup, admin-only
  `is_pro`, food log, and the free-tier (10) favorites **cap enforced by a DB trigger** so a
  static client can't bypass it.
- **Auth providers** — dashboard → Authentication → Providers: enable **Email** (default) and
  **Google**; set **Site URL** to `http://localhost:3000` for dev and add redirect URLs for
  `https://pantrytostore.com` (M5) so OAuth `redirectTo` works.
- Email confirmation was disabled during M3 dev; re-enable **before** real users arrive
  (requires SMTP — see PRD §6.5).
- Gated pages (`/favorites`, `/account`) render client-side, ship
  `<meta name="robots" content="noindex">`, and are excluded from `robots.txt`/sitemap.

## SEO/monetization (PRD §9, M4)

- `@nuxtjs/sitemap` + `@nuxtjs/robots` — generated at build time from `NUXT_PUBLIC_SITE_URL`
  (`https://pantrytostore.com`).
- JSON-LD: `WebSite` + `SearchAction` + `Organization` on home; `Recipe` +
  `NutritionInformation` + `BreadcrumbList` on recipe pages; canonicals on every indexed page.
- `<AdSlot>` renders nothing until `NUXT_PUBLIC_ADSENSE_PUBLISHER_ID` + `_SLOT` are set
  (post-approval); placement is content-gated (≥4 ingredients AND ≥6 steps) between
  ingredients and instructions. Dev-only placeholder for layout QA.
- **Consent**: Google Consent Mode v2 + lightweight banner (`pts-consent` cookie). Before
  AdSense submission, confirm the contact email on `/privacy` (`support@pantrytostore.com`)
  actually delivers.

## Roadmap

- **M0** — shell: tokens, layout, header/footer, home hero ✅ (this commit)
- **M1** — content: home category sections, recipe cards, recipe detail, Spoonacular utils + proxy ✅ (real seed content at build time, PRD §6.1) 
- **M2** — search: pantry/dish tabs, filters, URL state, cache ✅ (runtime via proxy, PRD §6.4)
- **M3** — accounts: Supabase auth, middleware, favorites (RLS, cap 10), account page ✅ (client-side; cap enforced via DB trigger)
- **M4** — monetization/SEO: sitemap, robots, JSON-LD audit, canonicals, AdSlot + consent, privacy/terms ✅
- **M5** — deploy: S3 + CloudFront + Route 53, Lambda proxy, CI + nightly refresh

## Deploy

Static: sync `dist/` to S3 behind CloudFront. Runtime piece: the serverless Spoonacular
proxy (see `server/routes/api/spoonacular` in this repo; packaged via the Nitro `aws-lambda`
preset). Details in PRD §7, §10.