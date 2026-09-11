# Pantry to Store

A **static-first** recipe site that helps people cook healthy, affordable meals from the
ingredients they already have — designed to run near cost-zero on AWS (S3 + CloudFront +
Route 53), SEO-first and AdSense-ready. The site is generated as plain HTML/JS and hydrated
in the browser; there is no app server in production.

See **`PRD - Static Pantry To Store Passive income.md`** for the full product requirements,
architecture, and milestone-by-milestone decisions.

- **Framework:** Nuxt 4 (Vue 3, Nitro, Vite) — static generation via `nuxt generate`
- **Styling:** vanilla CSS design tokens + flexbox, mobile-first (no styling framework)
- **Data & Auth:** Supabase — client-side auth + Postgres with row-level security
- **Content API:** Spoonacular (key kept server-side in a small proxy)
- **Hosting (M5, in progress):** AWS S3 + CloudFront + Route 53 + one Lambda function

---

## Local development

### Prerequisites

- **Node.js** ≥ 20.19 (or ≥ 22.12) and **npm**
- A **Spoonacular API key** ([spoonacular.com/food-api](https://spoonacular.com/food-api))
- A **Supabase project** (free tier is ample for this app) — optionally Google/Gmail OAuth
  client credentials for "Sign in with Google"

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Fill in `/.env`:

| Variable | Purpose |
|---|---|
| `SPOONACULAR_API_KEY` | Server-only; consumed by the `/api/spoonacular/*` proxy. Never reaches the client bundle. |
| `NUXT_PUBLIC_SUPABASE_URL` | Supabase project URL (client-safe). |
| `NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase **anon** (publishable) key. |
| `NUXT_PUBLIC_SITE_URL` | Canonical origin used by sitemap/robots/SEO. Leave as `https://pantrytostore.com` for prod; set `http://localhost:3000` to test SEO locally. |
| `NUXT_PUBLIC_API_BASE` | Spoonacular proxy origin. Empty = same-origin (right for dev). |
| `NUXT_PUBLIC_ADSENSE_PUBLISHER_ID` / `NUXT_PUBLIC_ADSENSE_SLOT` | Leave empty unless serving ads (see below). |

### 3. Configure Supabase

1. Create a project and apply the schema: open **SQL Editor** and run `supabase/init.sql`
   (creates `profiles`, `favorites` + RLS, auto-profile on signup, admin-only `is_pro`,
   the food-log table, and a DB trigger that caps free-tier users at **10 favorites**).
2. **Authentication → Providers:** enable **Email** and, if you have Google credentials,
   **Google**.
3. **Authentication → URL Configuration:** set **Site URL** to `http://localhost:3000`
   and add `http://localhost:3000` (plus your production origin once deployed) to
   **Redirect URLs** so OAuth callbacks work.
4. During local development, email confirmation can be left off; re-enable it (with SMTP)
   before real users arrive.

### 4. Run

```bash
npm run dev          # dev server on http://localhost:3000
```

For a production-style local check of the static bundle:

```bash
npm run typecheck    # vue-tsc typecheck
npm run generate     # static site → .output/public
npm run preview      # serve .output/public locally
```

> The Spoonacular proxy runs inside the dev/preview Nitro server. At build time (`generate`)
> it seeds real recipe content into the prerendered pages, so the static output never needs
> a runtime backend to render.

---

## Deployment

**Status:** live at <https://pantrytostore.com> (api: <https://api.pantrytostore.com>). Layout:

- **Static site** — `npm run generate` output (`.output/public`) synced to an S3 bucket
  served through CloudFront (TLS, apex + `www`, real 404 page — no SPA fallback, per
  AdSense policy).
- **DNS** — the existing Route 53 hosted zone for `pantrytostore.com`; alias the apex and
  `www` to CloudFront.
- **Runtime proxy** — the Spoonacular proxy (the routes under `server/routes/api/spoonacular`)
  is packaged as a single **Lambda** with the Nitro `aws-lambda` preset:

  ```bash
  npm run build:lambda   # output → .output/server (exported handler: `handler`)
  ```

  Zip `.output/server`'s contents as the function bundle and set the Lambda handler to
  `index.handler` (Node ≥ 20). The proxy reuses `server/utils/spoonacular.ts` verbatim; its
  route-level cache (`defineCachedEventHandler`) runs in the Lambda's memory with SWR — 6h for
  listings/search, 24h for recipe detail — so Spoonacular quota stays low without an extra
  caching service. An API Gateway HTTP API (`$default` route) fronts the Lambda and is mapped
  to `https://api.pantrytostore.com`; CORS is open so the static frontend can call it directly.
- **Env for production builds** — set `NUXT_PUBLIC_API_BASE=https://api.pantrytostore.com`
  before `npm run generate`, keep `NUXT_PUBLIC_SITE_URL=https://pantrytostore.com`.
  The Spoonacular key lives in the Lambda's environment, never in the static bundle.
- **CI + nightly refresh** — generate → sync S3 → invalidate CloudFront; a scheduled run
  each night re-generates the curated library + sitemap/JSON-LD. The curated build is fully
  offline (no Spoonacular calls), so nightly runs cannot be broken by an exhausted quota (the
  proxy cache still keeps runtime Spoonacular spend low).
- **Cost** — pay-as-you-go only: S3/CloudFront usage is pennies at hobby scale, Lambda sits
  in the always-free tier, and Supabase stays on its free tier.

### Pre-launch checklist

- [x] Curated content layer: 12 editorial recipes, 4 collection hubs, About + Contact, real 404
- [x] Indexing hygiene: `/search` is `noindex`, tool/gated pages excluded from sitemap/robots
- [ ] Re-enable Supabase email confirmation (with SMTP)
- [ ] Add production origin (`https://pantrytostore.com` + `www`) to Supabase Redirect URLs
- [ ] Verify apex/www redirects, `robots.txt` and `sitemap.xml`, and the 404 page
- [ ] Grow curated library to 30+ recipes (`npm run recipe:snapshot -- --add 20`) and give the
      new recipes editorial entries before applying
- [ ] Apply to AdSense (content is now approval-credible); after approval:
      create `public/ads.txt`, set `NUXT_PUBLIC_ADSENSE_PUBLISHER_ID`/`_SLOT`, rebuild,
      confirm ads render on recipe pages only and CWV stays clean

---

## Architecture

**Static-first with SSR-quality SEO.** `nuxt generate` prerenders every public page with its
HTML, meta, JSON-LD, and content baked in (SSR rendering for crawlers, then hydration).
`nitro.prerender.crawlLinks` discovers the curated recipe pages, collection hubs, and trust
pages from the home/footer links — 56 pre-rendered routes today (12 curated recipes + 4
collection hubs + about/contact + privacy/terms + home + sitemap). Nothing is rendered on the
client for SEO-critical content — it's in the initial HTML.

### Curated content library (`app/content/`)

The recipe pages are **publisher content, not an API dump**. Each curated recipe is a
snapshot of the Spoonacular fact data (`app/content/recipe-data.ts`, machine-generated) plus
original editorial copy written by us (`app/content/recipes.ts` — intro, cook's notes, FAQs,
collections, display-title overrides). Collection hubs (`app/content/collections.ts`) group
recipes into interlinked static pages (`/collections/[slug]`), and each recipe JSON-LD block
carries author/publisher/datePublished/keywords.

- `npm run recipe:extract` — reseed `recipe-data.ts` from a local build's HTML (no API).
- `npm run recipe:snapshot` — refresh/extend `recipe-data.ts` from Spoonacular
  (`--add 20` adds the top new recipes to the manifest; `--ids a,b,c` adds specific ones).
  New recipes render fine without editorial; add an entry to `recipes.ts` to give them an
  intro/notes/FAQs.

**Build-time vs runtime backend.** During `dev`/`generate`/`preview`, the Nitro server owns
three API routes — `GET /api/spoonacular/sorted`, `/recipe/[id]`, and `/search` — which cache
Spoonacular responses in memory and keep the API key server-side. The curated recipe pages
render **without any build-time API call** (data comes from the manifest), so `generate`
works offline; non-curated `/recipe/:id` URLs fall back to the runtime proxy. The static
output is self-sufficient. After deploy, pages needing live data ("Load more", search) call
the configured `NUXT_PUBLIC_API_BASE` — the Lambda — via the same `useSpoonacularFetch`
helper.

**Client-side auth + Postgres.** Supabase runs entirely in the browser (publishable keys);
`useAuth`/`useFavorites` wrap the SDK. Rows are protected by **RLS** (`auth.uid() = user_id`)
and the free-tier favorites **cap is enforced by a DB trigger**, so a static client can't
bypass it. Gated pages (`/favorites`, `/account`) render client-side, are `noindex`, and are
excluded from `robots.txt`/sitemap.

**SEO.** `@nuxtjs/sitemap` + `@nuxtjs/robots` generate sitemap/robots at build time from
`NUXT_PUBLIC_SITE_URL`. Canonicals on every indexed page. JSON-LD: `WebSite` +
`SearchAction` + `Organization` on home; `Recipe` + `NutritionInformation` +
`BreadcrumbList` on recipe pages — eligible for rich results.

**Monetization hooks (dormant until approved).** `<AdSlot>` sits between ingredients and
instructions, content-gated (≥4 ingredients AND ≥6 steps); it renders nothing until the
AdSense env vars are set. Google **Consent Mode v2** with a lightweight banner gates ad
tracking until the visitor consents (`pts-consent` cookie).

**Layout of note:**

```
app/
  pages/            index, search, recipe/[id], login, favorites, account, privacy, terms
  components/       SiteHeader, SiteFooter, RecipeCard, MacrosChips, AdSlot, CookieConsent
  composables/      useSpoonacular, useAuth, useFavorites, useSeo, useConsent
  plugins/          supabase (client), gcm (consent mode)
  middleware/       auth guard for gated pages
server/
  utils/            spoonacular client + cache
  routes/api/       sorted, recipe/[id], search
supabase/
  init.sql          full schema (profiles, favorites+RLS, food log, cap trigger)
```

---

## Features

- **Home** — "Healthy picks" and "Community favorites" sections seeded at build time, with
  client-side "Load more" via the proxy.
- **Recipe page** — nutrition chips, image, scalable servings (ingredient amounts rescale),
  full ingredient list, step-by-step instructions, link to the source, and Recipe JSON-LD.
- **Search** — tabs for **pantry** (what's in your kitchen) and **dish** (name search),
  filters for diet/allergen/cook time/ingredient count, shareable URL state, and noindex for
  unindexed result pages.
- **Accounts & favorites** — email or Google sign-in, a heart on every recipe, favorites
  saved to your account with a free-tier cap of 10 (DB-enforced, with a path to Pro),
  plus gated `/favorites` and `/account` pages.
- **Privacy-friendly monetization** — consent-based ad injection (dormant until AdSense
  approval), real `/privacy` and `/terms` pages, robots/sitemap management for gated pages.