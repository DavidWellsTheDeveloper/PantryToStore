# PRD - Static Pantry To Store Passive income

| | |
| --- | --- |
| **Status** | **Approved** v1.0 |
| **Owner** | Dave |
| **Date** | 2026-09-08 |
| **Related docs** | `DEVELOPMENT_PLAN.md` (current SSR app), `PRD` topics overlap with Phase 4/5 there |

---

## 1. Overview

Rebuild **Pantry to Store** as a **static-first** web app that hosts on plain AWS
infrastructure (S3 + CloudFront + Route 53) at near-zero running cost, is fully
**SEO-ready** from the first request, and is structured so Google **AdSense** becomes a
passive income stream on content-rich pages.

The current app (TanStack Start SSR) is functionally good but its deployment model —
Nitro → Cloudflare Workers / Lovable Cloud — carries an always-on compute premise and
couples us to Lovable's deploy path. This rebuild keeps the product (recipes from
Spoonacular, pantry/dish search, accounts, favorites) and the **look and feel**, but:

1. Swaps the runtime for **Nuxt 4 (static generation)**.
2. Hosts public pages as **static HTML in S3 behind CloudFront** with a custom domain on
   Route 53 (same pattern as the operator's other static sites).
3. Keeps exactly **one** serverless function (not a server) as a secret-holding API proxy
   with caching — the only piece that must touch runtime compute.
4. Uses **Supabase Auth** (fully client-side) for accounts, so gated features work on a
   static host via route guards + Postgres RLS.

---

## 2. Goals

- **G1 — Behavior parity.** Home-page category sections, recipe cards, recipe detail
  (macros, scaling, favorites), pantry **and** dish search with the current filter set.
- **G2 — Look parity.** Same warm editorial palette, fonts, and layout as the current site.
- **G3 — Near-zero static hosting cost.** Pages served from S3/CDN; target **≤ $2/mo**
  before real traffic (S3 + Route 53 + request costs).
- **G4 — SEO ready.** Every public page is pre-rendered HTML with metadata, JSON-LD
  (WebSite/SearchAction/Organization/Recipe/Nutrition), sitemap, robots, canonicals.
- **G5 — AdSense-compliant and review-ready.** Ads only on publisher-content pages,
  consent infrastructure planned, privacy page present, no placeholder ad boxes.
- **G6 — Accounts on a static host.** Sign up/sign in, gated `/favorites`, `/account`.
- **G7 — Maintainable architecture.** Clean module split (config, api proxy client,
  stores/composables, components, page routes) so a solo dev + AI assistants can run it.

## 3. Non-goals (this iteration)

- Real-time sync, PWA offline modes, or push notifications.
- "Pro" paid plan (deferred; schema supports `is_pro` flag but no checkout).
- Server-rendering every possible Spoonacular recipe (budget/crawl constrained — see §14).
- Migrating the existing user data if the old DB is kept fresh (favorites are per-user
  Postgres rows — see §10).
- Moving off Spoonacular (still the content source) — but its API *cost* must be contained
  by caching (§7.2).

---

## 4. Success metrics

| Metric | Target |
| --- | --- |
| Hosting bill (S3+CF+R53+Lambda) at low traffic | **≤ ~$2/mo** |
| Spoonacular API spend (free plan now; upgrade only at real traffic) | cached so impressions don't re-bill |
| Home + recipe pages publish valid meta + JSON-LD | Lighthouse SEO ≥ 90; Rich Results clean |
| LCP (home) | ≤ 2.5 s (static HTML + preloaded hero) |
| AdSense review | Passes "publisher-content" review, ads only on eligible pages |
| Indexed pages after 6 weeks | All static public routes in Search Console |

---

## 5. Product requirements

Priorities — **P0** = launch, **P1** = first iteration after launch, **P2** = backlog.

| # | Feature | Priority | Notes |
| --- | --- | --- | --- |
| 5.1 | Home page with category sections | P0 | SSG-baked at build time |
| 5.2 | Recipe cards | P0 | Reusable, SSR-able HTML |
| 5.3 | Recipe detail page | P0 | Macros, servings scaling, ingredients, steps |
| 5.4 | Search — pantry & dish modes | P0 | Runtime calls via proxy |
| 5.5 | Search filters | P0 | diet, intolerances, meal type, cuisines, max time, max ingredients |
| 5.6 | Accounts (email + OAuth) | P0 | Supabase Auth, client-side |
| 5.7 | Gated pages: favorites, account | P0 | route guard + RLS + noindex |
| 5.8 | Favorites (save/remove, limit 10 free) | P0 | per-user, RLS |
| 5.9 | AdSense integration | P0 | config-driven slot, content-gated placement |
| 5.10 | Privacy + Terms page | P0 | required for AdSense |
| 5.11 | Tracker/food-log | P1 | mirrors current app; P1 acceptable |
| 5.12 | sitemap, robots, JSON-LD, OG | P0 | build-time generated |

---

## 6. Feature specifications

### 6.1 Home page (static, SEO)

- Pre-rendered at build time (`nuxi generate`): hero + **two category sections**
  ("Nourishing recipes to try" = healthiness sort, "Recipes home cooks love" = popularity
  sort), each with a "Browse all" expand that loads more via the proxy.
- Build-time data comes from the **proxy** during generation (cached), and the generated
  HTML contains recipe titles/images/links — **crawlable with zero JS**.
- A nightly/CI cron re-runs generation so category freshness is bounded (or, if we accept
  staleness, re-generate on deploy only). No runtime calls on the home page.
- Metadata: title, description, canonical, `og:*`; JSON-LD `WebSite` + `SearchAction`
  (search-box template) + `Organization`.

### 6.2 Recipe cards

- Reusable `RecipeCard` component: image (aspect-ratio box), title (serif), time,
  ingredient count, macro chips (calories/protein/carbs/fat), heart (favorite) when
  signed in.
- Pure-presentational, SSR-safe; used by home, search, favorites.

### 6.3 Recipe detail page (`/recipe/:id`)

Mirror the current page:
- Hero image, title, servings, time, source link; macro summary.
- Ingredient list with **unit conversion + servings scaling**.
- Step-by-step instructions (analyzed instructions; group by section).
- Favorite toggle (authenticated).
- **Recipe JSON-LD** (name, image, recipeYield, recipeIngredient, recipeInstructions,
  nutrition) + `BreadcrumbList`.
- **Ad placement:** single in-content unit **between ingredients and instructions**,
  rendered only when content threshold met (≥ 4 ingredients AND ≥ 6 steps) and
  `ADSENSE_SLOT` configured (mirrors current policy — §9.4).
- **Prerendering strategy (§14):** a seeded set of recipe URLs (drawn from the home
  categories) gets real static HTML; the rest render client-side with `noindex` until the
  crawl budget is expanded.

### 6.4 Search

- Tabs: **Pantry** (enter ingredients; `findByIngredients`) and **Dish** (free-text;
  `complexSearch`).
- Filters (all combinable): diet, intolerances, meal type, cuisines, max ready time,
  max ingredient count.
- **URL-shared state** (`?mode=pantry&ing=a,b&diet=...`) so results are shareable/refreshable;
  values validated with a schema (zod) mirroring `@tanstack/zod-adapter` behavior today.
- Search is a runtime operation → calls go to the **proxy** with TTL caching.
- Search result pages: `noindex` (results are tool output, mirroring current policy —
  §9.4); the landing page `/search` has clean meta showing the two modes.

### 6.5 Accounts (static feasibility)

**Conclusion: yes.** Supabase Auth runs entirely client-side against Supabase's own
endpoints — a static host plays no part in the auth request. Design:

- Sign in / sign up (email+password with Supabase emails) + Google OAuth (Supabase-native
  provider — the current Lovable OAuth proxy becomes unnecessary).
- Packages: `@nuxtjs/supabase` (or `@supabase/supabase-js` + a thin composable) with
  `useSupabaseUser()` exposing the session to Nuxt middleware.
- **Route guards:** Nuxt `middleware` + `definePageMeta({ middleware: 'auth' })` on
  `/favorites`, `/account`. Unauthenticated users are redirected to `/login` with a
  `redirect` query param.
- **Data authorization:** enforced by **Postgres RLS**, never by the client. A
  client-rendered "gated" page without a valid session simply gets RLS 403s/empty data —
  this is the real security boundary.
- Gated pages ship as **client-rendered SPA with `<meta name="robots" content="noindex">`**
  (they're private, like the current `ssr:false, noindex` routes).

### 6.6 Gated pages

- **Favorites** (`/favorites`): grid of saved recipe cards, remove action, free tier
  capped at 10 saves (stored per-user in Postgres; cap enforced server-side via RLS
  policy/trigger like today).
- **Account** (`/account`): profile (nickname/avatar), sign-out, deletion + data export
  affordance, "Plan" placeholder.
- **Tracker/food-log** (P1): daily logs + macro totals, still RLS + noindex.

### 6.7 AdSense integration

- Publisher `ca-pub-5412519069500643` preserved; loader via runtime-config
  `ADSENSE_PUBLISHER_ID`.
- Reactive `<AdSlot>` component:
  - Real `<ins class="adsbygoogle">` + `(adsbygoogle=[]).push({})` **only when**
    `ADSENSE_SLOT` is configured;
  - renders **nothing** in production before approval (no placeholder demo boxes);
  - dev-only placeholder box for layout QA.
- **Placement rules (§9.4)** — ads on recipe pages only, content-gated; never on
  auth/search/empty/error/404 screens; never next to misclick-prone controls.
- **Consent:** Google Consent Mode (v2) + lightweight CMP banner; ads default to
  non-personalized in EEA/UK until a CMP is configured.

### 6.8 Privacy & legal

- `/privacy` and `/terms` as static pages, linked from footer on every page (AdSense
  requirement), including: data collected, cookie/third-party vendor disclosure, Google
  Ads Settings + `aboutads.info` opt-outs, contact email (real address filled before
  submission).

---

## 7. Architecture

### 7.1 Tech stack (recommended)

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Nuxt 4** (Vue 3, Nitro, Vite) | SSG out of the box (`nuxi generate`), great SEO, vitality of ecosystem |
| Language | TypeScript (strict) | parity with current codebase |
| Styling | **Vanilla CSS**: design-token custom properties + component-scoped SFC styles + a tiny hand-rolled utility set | exact pixel-similar reproduction of the current brand (no framework theme to fight, smallest CSS bundle) |
| Page layout / responsiveness | **Flexbox** + media queries (no CSS framework) | mobile-first layouts via `flex-wrap` grids, fluid spacing, and breakpoints tuned to the current layout |
| UI primitives | **Reka UI** (headless: dialog, select, tabs, checkbox, tooltip) | accessible interactive components without Material/utility styling opinions |
| UI components | `shadcn-vue` or hand-rolled (buttons, dialog, tabs) | matches current shadcn/ui look |
| Data/auth | **Supabase** (Postgres + Auth) | existing schema/RLS reuse; free tier |
| SEO modules | `@nuxtjs/sitemap`, `@nuxtjs/robots` (+ manual JSON-LD) | build-time generated sitemap/robots |
| Runtime API | **One serverless function** (AWS Lambda — Nitro `aws-lambda` preset, already scaffolded as `build:aws`), or Cloudflare Worker alt | holds secrets, proxies+caches Spoonacular |
| Hosting | **S3 + CloudFront + Route 53** | static-only, cache-friendly, same as operator's other sites |

**Alternatives considered** (not chosen):

| Alt | Why not primary |
| --- | --- |
| Vuetify / Bootstrap / PrimeVue | component frameworks are workable but ship their own Material/utility look that fights the warm editorial brand; heavier CSS/JS hurts CWV. Kept as fallbacks (§15). |
| React (Next.js static export / Astro / TanStack Start static) | Good, but user prefers Nuxt; Nuxt emits the same static artifact |
| Cloudflare Pages (full static + Functions) | Cheapest possible, but user wants AWS S3/Route 53 per existing ops pattern; AWS Lambda variant keeps it all-AWS |
| Full SSR (Nuxt Node) | defeats the static hosting goal |

### 7.2 Where Spoonacular secrets live (the key decision)

Spoonacular requires a key on **every** call. A pure S3 static site cannot hide a key, so:

- **Client never talks to Spoonacular directly.** All Spoonacular calls go to
  `https://api.<domain>/api/spoonacular/*` (CloudFront path).
- That path is served by the **single Lambda proxy** which holds
  `SPOONACULAR_API_KEY`, forwards requests, and applies a **TTL cache** (Postgres cache
  table or S3 keyed by request hash) so repeat impressions (home regen, search re-runs,
  crawler re-hits) don't re-bill the API.
- **Rate limit / abuse guard** on the proxy (per-IP cap) so a leaked endpoint can't burn
  the API quota.
- If AWS Lambda feels heavy, the same function body deploys as a **Cloudflare Worker**
  (free tier) with zero code change (both are Nitro/`h3` targets) — the app contract is
  just "a `/api/spoonacular/*` HTTP endpoint".

### 7.3 Request flow

```
Browser ── static HTML/CSS/JS ──▶ CloudFront ◀── S3 bucket (Nuxt static output)
   │
   └── /api/spoonacular/* ──▶ CloudFront path ──▶ Lambda proxy ──▶ Spoonacular API
                                                                    │ (TTL cache in Supabase/S3)
Browser ── supabase.auth.* (client-side) ──▶ Supabase Auth
Browser ── RLS-protected reads ──▶ Supabase PostgREST (favorites, profile, food log)
```

### 7.4 Code layout (Nuxt)

```
app/
  assets/css/main.css          # vanilla CSS: design tokens (canvas/forest/clay/sand, Fraunces/Instrument) + shared classes
  components/ui/               # button, dialog, tabs, input, skeleton, checkbox, select...
  components/                  # SiteHeader, SiteFooter, RecipeCard, AdSlot, Macros, SearchBar, CookieConsent
  composables/                 # useSession(), useSearchState(), useFavorites(), useRecipes()
  middleware/auth.ts           # gated-route guard (redirect preserving ?redirect=)
  pages/
    index.vue                  # home: SSG category sections
    search.vue                 # pantry/dish tabs + filters (URL state)
    recipe/[id].vue            # detail + recipe JSON-LD + ad slot
    login.vue / signup.vue
    app/favorites.vue          # gated
    app/account.vue            # gated
    privacy.vue / terms.vue
    app/tracker.vue            # P1
  plugins/                     # supabase client, adsense loader (guarded)
  utils/                       # spoonacular types/mappers, zod schemas, macros utils (from current src/lib)
  app.config.ts                # branding tokens
server/routes/api/spoonacular/ # proxy used by the Lambda build (dev + aws-lambda preset)
nuxt.config.ts                 # ssr:true + generate config; site url; route rules (noindex for /app/*)
```

### 7.5 Env / config

- `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_ADSENSE_PUBLISHER_ID`, `NUXT_PUBLIC_ADSENSE_SLOT` (empty = no ads),
  `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (client-safe; committed as examples).
- Server-only (Lambda env vars): `SUPABASE_SERVICE_ROLE_KEY`, `SPOONACULAR_API_KEY`,
  cache credentials.
- Everything generated at build time becomes static; secrets never enter the bundle.

---

## 8. Data model (Supabase — reuse existing)

Mirror the existing migrations; keep RLS + triggers:

- `profiles` (id → auth.users, nickname, avatar_url, `is_pro`) — RLS: owner + service role.
- `favorites` (user_id, recipe_id, recipe_jsonb snapshot, created_at) — RLS: owner.
  Save cap (10 for non-pro) enforced by policy/trigger.
- `food_log_entries` (user_id, eaten_on, meal, entries_jsonb/macros) — RLS: owner. (P1)
- `recipe_cache` (optional, proxy-side): hash + payload + expires_at for TTL.

Auth: email + password via Supabase, Google OAuth via Supabase provider config
(no Lovable proxy).

---

## 9. SEO blueprint

1. **SSG-first:** home + static pages + seeded recipe pages are real HTML in the bucket;
   `nuxt generate` emits `sitemap.xml`, `robots.txt`, and per-page `<title>/description/canonical/og:*`.
2. **Structured data:** `WebSite` + `SearchAction` + `Organization` (root), `Recipe` +
   `NutritionInformation` + `BreadcrumbList` (recipe), all as JSON-LD in the static HTML.
3. **noindex rules:** `/app/*` (auth pages), `/login`, `/signup`; search result URLs stay
   `noindex` (until/unless a curated search landing becomes content).
4. **Canonicals** rerouted to production domain (`NUXT_PUBLIC_SITE_URL`) — removes the
   `.lovable.app` dependency from current meta tags.
5. **Images:** `loading="lazy"` + `decoding="async"` + aspect-ratio wrappers; hero preload.
6. **CWV:** static HTML is tiny; watch cumulative layout from ad slots (reserve min-height).

---

## 10. Deployment

### 10.1 Target (AWS, static)

- **S3 bucket** (private, origin-access) — Nuxt static output (`dist/` of `nuxi generate`).
- **CloudFront distribution** — HTTPS, custom domain, `Cache-Control` for `/assets/*`
  (immutable) vs HTML (`no-cache`/short TTL), gzip/brotli.
- **Route 53** — hosted zone + A/ALIAS to CloudFront; `api.*` subdomain for the proxy.
- **Lambda proxy** — from this repo's `build:aws` artifact (already scaffolded,
  `scripts/deploy-lambda.sh`), exposed via Function URL or API GW behind the `api.*`
  subdomain; arm64, 1024 MB, 30 s.
- **CI (GitHub Actions):** `install → lint → tsc --noEmit → build:nuxi (SSG) → aws s3
  sync (cache-bust assets) → invalidate CloudFront`. Optional nightly cron job re-runs to
  refresh category content.

### 10.2 Cost estimate (low traffic)

| Item | est./mo |
| --- | --- |
| S3 (site + cache writes) | < $0.10 |
| CloudFront (1–5 GB egress) | $0.10–0.50 |
| Route 53 (1 zone + records) | $0.50 + domain ($12/yr) |
| Lambda proxy (≲ 100k req, free tier first 12 mo) | $0–1 |
| **Total** | **≈ $1–2/mo** |

Spoonacular spend: controlled by proxy TTL cache; free plan until real traffic.

---

## 11. Non-functional

- **Performance budget:** home takes full HTML+JSON-LD >2 chars-of-benefit rule; LCP ≤ 2.5 s;
  JS per page kept lean (900 KB budget, gzip).
- **Security:** secrets only in Lambda env; RLS backend of truth; no ads click-jacking
  (no ad over interactive controls); CSP header where easy (CloudFront can set basic CSP).
- **Accessibility:** WCAG AA baseline; keyboard nav for search/filters/modals; contrast
  from current tokens already passes.
- **Caching:** asset immutability + short HTML TTL; API TTL cache; stale-while-revalidate
  option on the proxy.

---

## 12. Milestones

| Milestone | Scope | Exit criteria |
| --- | --- | --- |
| **M0 — Scaffold** | Nuxt 4 app, tokens/layout shell, header/footer, tailwind | `nuxi generate` → static site renders current look |
| **M1 — Content** | spoonacular utils/types, proxy server route, home SSG sections, recipe card, detail page | Home + `/:id` have real seeded HTML + JSON-LD |
| **M2 — Search** | pantry/dish tabs, filters, URL state, proxy calls + cache | shares URL, filters combine, `noindex` correct |
| **M3 — Accounts** | Supabase auth, middleware, favorites (RLS, cap 10), account page | signup→favorite→logout→RLS-403 verified |
| **M4 — Monetization/SEO** | sitemap/robots/JSON-LD audit, AdSlot + consent banner, privacy/terms, footer | Rich Results clean; AdSense review-ready (no ad before approve) |
| **M5 — Deploy** | S3+CF+R53, Lambda proxy deploy, GH Actions + nightly refresh | `curl` shows SSR HTML from S3; bill ≤ $2 |

---

## 13. Open questions

1. **Production domain** — do we register a new domain (e.g. `pantrytostore.com`) or reuse
   the existing one? AdSense review and canonicals depend on it.
2. **Prerender budget** — how many recipe pages should the nightly job prerender given the
   Spoonacular free plan? (Start ~40–80 and scale with traffic.) §14.
3. **Search-result URLs indexed or not?** Current decision: `noindex`. Revisit only if a
   curated "dish landing" page is added.
4. **Google OAuth** on the static site served from own domain — confirm Supabase OAuth
   redirect URL config (straightforward; replaces Lovable proxy).
5. **Favorites snapshot** (`recipe_jsonb`) vs live fetch on detail — keep snapshot approach
   (content is subject to Spoonacular availability).
6. **Keep old app running** alongside during the rebuild, or cut over? (Recommend: parallel
   until M5 deploys, then redirect.)

---

## 14. Risks & mitigations

| Risk | Likelihood / impact | Mitigation |
| --- | --- | --- |
| Spoonacular quota ($) on repeated crawls/searches | Med / Med | Proxy TTL cache; rate-limit; prerender budget; upgrade only when traffic pays |
| "Low content" AdSense flags on search/home | Med / High | Static home + seeded recipes are real content; ads only on content-gated recipe pages; privacy/footer complete |
| Auth felt "impossible on static" | Low / High (if true) | It isn't — client-side Supabase Auth + RLS; gated pages noindexed; §6.5 |
| Recipe detail URLs not all prerendered → thin index coverage | Med / Med | Seed set + nightly refresh; measure in Search Console and grow budget with traffic |
| Nuxt learning vs react familiarity | Med / Low | Small surface (SG + few pages); patterns already in this PRD |
| Locked to Nuxt if it underperforms | Low / Low | Static artifact is plain HTML/JS → Next/Astro port is mechanical |

---

## 15. Appendix — design tokens (reproduce look "very similar")

From the current site's `styles.css` / components. **These tokens are fixed** — they're the
brand of the rebuild:

- **Palette (warm editorial):** `canvas #FCF9F2` (bg), `forest #2D4032` (text/primary-dark),
  `clay #D97757` (primary/CTA), `sand #E8E2D2` (muted surfaces/borders), card `#FCFDFA`,
  radius `0.5rem`. Soft macro colors (calories/protein/carbs/fat) archived from the current
  theme if needed.
- **Type:** display `Fraunces` (serif) for headings/hero; body `Instrument Sans`.

**Styling system — vanilla CSS (recommended), isolated & reusable:**

- Tokens live as CSS custom properties on `:root` (`--canvas`, `--forest`, `--clay`,
  `--sand`, `--radius`, `--font-display`, `--font-body`).
- Each component styles itself in its SFC `<style scoped>`; shared primitives
  (`.eyebrow`, `.container`, `.btn`, `.card`, `.chip`, `.skeleton`) live in a small
  `assets/css/main.css` with a documented naming rule.
- Complex interactions (dialog, select, tabs, checkbox, tooltip) use **Reka UI** headless
  primitives — they come unstyled, so our CSS (not a theme) dictates the look.
- **Layout & mobile friendliness = flexbox, no grid framework.** Shared `.row/.col`
  helpers built on `display:flex` + `flex-wrap` render the card grids, hero, header/footer,
  and filter bars; mobile-first `@media (max-width)` breakpoints switch multi-column rows to
  single-column stacked (or horizontal-scroll) above a `--breakpoint` token (≈768px), with
  fluid `clamp()`-based spacing and tap targets ≥ 44px. Touch/finger goals: no horizontal
  scroll on pages, readable type, sticky header collapses cleanly.
- No utility preprocessor needed; if a repetitive pattern emerges, an optional tiny Sass
  or `lightningcss` layer can be added later without changing tokens.

**Fallback frameworks (acceptable, not preferred):** **Vuetify 3** if speed-to-UI wins and
we accept a Material-leaning look (its theme system lets us set the palette + fonts);
**Bootstrap 5 (+ Bootstrap Vue Next)** if we lean on a component/utility set and are
willing to override heavily; **PrimeVue** for the largest component set with a themeable
preset. All three would need custom overrides to reach the current editorial look, which is
why vanilla + Reka UI is the recommendation.

**Layout & components to port:** centered narrow-content main column (~72rem max-width),
generous vertical padding, uppercase letter-spaced eyebrow labels, soft card surfaces with
4:3 recipe imagery. Flexbox-based responsive grids down to mobile. Components: SiteHeader
(brand + nav + account), SiteFooter (links + privacy), RecipeCard, macro chips, tabs
(pantry/dish), filter chips, dialog/select/checkbox, skeleton loaders.