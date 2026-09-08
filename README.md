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
bun install
bun run dev        # dev server on http://localhost:3000
bun run generate   # static site → dist/
bun run preview    # preview the generated static site
bun run build      # production build (Nitro)
```

## Env

Copy `.env.example` → `.env` and fill `NUXT_PUBLIC_SITE_URL` etc. Public vars only;
secrets live in the serverless proxy, never in the static bundle (PRD §7.2).

## Roadmap

- **M0** — shell: tokens, layout, header/footer, home hero ✅ (this commit)
- **M1** — content: home category sections, recipe cards, recipe detail, Spoonacular utils + proxy
- **M2** — search: pantry/dish tabs, filters, URL state, cache
- **M3** — accounts: auth, middleware, favorites (RLS), account page
- **M4** — monetization/SEO: sitemap, JSON-LD audit, AdSlot + consent, privacy/terms
- **M5** — deploy: S3 + CloudFront + Route 53, Lambda proxy, CI + nightly refresh

## Deploy

Static: sync `dist/` to S3 behind CloudFront. Runtime piece: the serverless Spoonacular
proxy (see `server/routes/api/spoonacular` in this repo; packaged via the Nitro `aws-lambda`
preset). Details in PRD §7, §10.