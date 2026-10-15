# PRD - Static Pantry To Store Passive income

| | |
| --- | --- |
| **Status** | **Active - v1.1** |
| **Owner** | Dave |
| **Date** | 2026-09-08 (Updated 2026-10-13) |
| **Related docs** | `DEVELOPMENT_PLAN.md` (current SSR app) |

---

## 1. Overview

Pantry to Store is a **static-first** web app that hosts on plain AWS
infrastructure (S3 + CloudFront + Route 53) at near-zero running cost, is fully
**SEO-ready** from the first request, and is structured so Google **AdSense** becomes a
passive income stream on content-rich pages.

The app (Nuxt 4 with static generation) delivers recipes from Spoonacular with pantry
search, dish search, accounts, favorites, and curated collections. The architecture:

1. Swaps the runtime for **Nuxt 4 (static generation)**.
2. Hosts public pages as **static HTML in S3 behind CloudFront** with a custom domain on
   Route 53.
3. Keeps exactly **one** serverless function as a secret-holding API proxy
   with caching — the only piece that must touch runtime compute.
4. Uses **Supabase Auth** (fully client-side) for accounts, so gated features work on a
   static host via route guards + Postgres RLS.

---

## 2. Goals

- **G1 — Behavior parity with completed features.** Maintain completed functionality while simplifying scope.
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
- Migrating existing user data from other systems.
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

| # | Feature | Priority | Status | Notes |
| --- | --- | --- | --- | --- |
| 5.1 | Home page with curated category sections | P0 | **Completed** | SSG-baked at build time with curated collections; shows recipe cards from curated library. |
| 5.2 | Recipe cards | P0 | **Completed** | Reusable component used across home, collections, search, favorites. |
| 5.3 | Recipe detail page | P0 | **Completed** | Macros, servings scaling, ingredients, steps, JSON-LD, curated content overlay. |
| 5.4 | Search — pantry & dish modes | P0 | **Completed** | Runtime calls via proxy with URL-shared state. |
| 5.5 | Search filters | P0 | **Completed** | Diet, intolerances, meal type, cuisines, max time, max ingredients. |
| 5.6 | "Load more" results on search | P0 | **Pending** | When reaching the bottom of search results, load additional results with a "Load more" button. |
| 5.7 | Daily new recipe recommendations on home | P1 | **Pending (deferred)** | Seeded shuffle is implemented but does not visibly change recommendations day-to-day (small curated sets produce near-identical results). Deferred — revisit only if the recipe library grows significantly. |
| 5.8 | Accounts (email + OAuth) | P0 | **Completed** | Supabase Auth, client-side with route guards. |
| 5.9 | Gated pages: favorites, account | P0 | **Completed** | Route guard + RLS + noindex for gated routes. |
| 5.10 | Favorites (save/remove, limit 10 free) | P0 | **Completed** | Per-user with RLS and free tier cap. |
| 5.11 | AdSense integration | P0 | **Completed** | Config-driven slot with placement rules; disabled when not configured. |
| 5.12 | Privacy + Terms page | P0 | **Completed** | Static pages linked in footer. |
| 5.13 | Collections hubs | P0 | **Completed** | `/collections/[slug]` pages with curated recipe lists and SEO content. |
| 5.14 | Tracker/food-log | P1 | **Pending** | Mirrors current app patterns; RLS + noindex. |
| 5.15 | sitemap, robots, JSON-LD, OG | P0 | **Completed** | Build-time generation via Nuxt modules + manual JSON-LD. |

---

## 6. Feature specifications

### 6.1 Home page (static, SEO)

- Pre-rendered at build time (`nuxi generate`): hero + curated category sections
  (Quick Weeknight Dinners, Plant-Forward Recipes, Comfort Food Favorites), each linking
  to its collection hub with "View all".
- Build-time data uses curated recipe content for consistent, high-quality publisher
  content (AdSense-friendly). The home page displays static, SEO-indexable HTML.
- **Daily fresh recommendations (FR-5.7):** Implement lightweight daily randomization
  within each category. On each build/generation cycle, rotate which subset of recipes
  appears in the limited home previews (e.g., shuffle the curated recipe list per category
  using a deterministic seed based on the current date: `seed = YYYYMMDD`). This ensures
  different recommendations daily without runtime API calls on the static home. For
  larger dynamic pools, can leverage Spoonacular's `sort=popularity/healthiness` with
  offset randomization if expanding beyond curated set.
- Metadata: title, description, canonical, `og:*`; JSON-LD `WebSite` + `SearchAction`
  (search-box template) + `Organization` + `ItemList` for collections.

### 6.2 Recipe cards

- Reusable `RecipeCard` component: image (aspect-ratio box), title (serif), time,
  ingredient count, macro chips (calories/protein/carbs/fat), heart (favorite) when
  signed in.
- Pure-presentational, SSR-safe; used by home, collections, search, favorites.

### 6.3 Recipe detail page (`/recipe/:id`)

Completed implementation:
- Hero image, title, servings, time, source link; macro summary.
- Ingredient list with **unit conversion + servings scaling**.
- Step-by-step instructions (analyzed instructions grouped by section).
- Favorite toggle (authenticated).
- **Recipe JSON-LD** (name, image, recipeYield, recipeIngredient, recipeInstructions,
  nutrition) + `BreadcrumbList`.
- **Ad placement:** single in-content unit **between ingredients and instructions**,
  rendered only when content threshold met (≥ 4 ingredients AND ≥ 6 steps) and
  `ADSENSE_SLOT` configured.
- Supports both curated recipes (static editorial content) and dynamic recipes via
  API proxy with runtime fetching and `noindex` behavior as appropriate.

### 6.4 Search

- Tabs: **Pantry** (enter ingredients; `findByIngredients`) and **Dish** (free-text;
  `complexSearch`).
- Filters (all combinable): diet, intolerances, meal type, cuisines, max ready time,
  max ingredient count.
- **URL-shared state** (`?mode=pantry&ing=a,b&diet=...`) so results are shareable/refreshable;
  validated on the server proxy.
- Search is a runtime operation → calls go to the **proxy** with TTL caching (6h with SWR).
- Search result pages: `noindex, nofollow` (results are tool output).
- **Load more (FR-5.6):** Add pagination support. When search returns results, track `offset`/`page`.
  Display "Load more" button at the bottom of results when more results are available (Spoonacular
  supports `number` and `offset` params). Update URL state to preserve pagination (e.g., `&page=2` or `&offset=12`).
  Maintain client state across filter/mode changes. For pantry mode with `findByIngredients`,
  Spoonacular returns up to 12 results per call; for complexSearch also supports pagination.

### 6.5 Accounts (static feasibility)

**Conclusion: yes.** Supabase Auth runs entirely client-side against Supabase's own
endpoints. Design:

- Sign in / sign up (email+password) via Supabase; OAuth providers configurable via Supabase.
- Uses Supabase client with `useSupabaseUser()` exposing the session to Nuxt middleware.
- **Route guards:** Nuxt `middleware` + `definePageMeta({ middleware: 'auth' })` on
  `/favorites`, `/account`. Unauthenticated users redirected to `/login` with `redirect` param.
- **Data authorization:** enforced by **Postgres RLS**, never by client. Gated pages ship
  as client-rendered with `<meta name="robots" content="noindex">`.

### 6.6 Gated pages

- **Favorites** (`/favorites`): grid of saved recipe cards, remove action, free tier
  capped at 10 saves (enforced server-side via RLS policies).
- **Account** (`/account`): profile (nickname/avatar), sign-out, account management.
- **Tracker/food-log** (P1): daily logs + macro totals, RLS + noindex.

### 6.7 AdSense integration

- Publisher ID configurable via `NUXT_PUBLIC_ADSENSE_PUBLISHER_ID`; slot via
  `NUXT_PUBLIC_ADSENSE_SLOT`.
- Reactive `<AdSlot>` component: loads `<ins class="adsbygoogle">` + pushes only when
  configured; renders nothing in production before approval; dev-only placeholder for QA.
- **Placement rules:** ads on recipe pages only, content-gated (≥4 ingredients AND ≥6 steps);
  never on auth/search/empty/error/404 screens; never next to misclick-prone controls.
- **Consent:** Google Consent Mode (v2) ready; ads default appropriately.

### 6.8 Privacy & legal

- `/privacy` and `/terms` as static pages, linked from footer on every page.

## 7. Architecture

### 7.1 Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Nuxt 4** (Vue 3, Nitro, Vite) | SSG out of the box (`nuxi generate`), great SEO |
| Language | TypeScript (strict) | type safety and consistency |
| Styling | **Vanilla CSS** with design tokens + scoped styles | matches current warm editorial brand; minimal bundle |
| UI primitives | **Reka UI** (headless) | accessible interactive components |
| Data/auth | **Supabase** (Postgres + Auth) | schema/RLS reuse; free tier |
| SEO modules | `@nuxtjs/sitemap`, `@nuxtjs/robots` | build-time generation |
| Runtime API | **One serverless function** (AWS Lambda via Nitro `aws-lambda` preset) | holds secrets, proxies+caches Spoonacular |
| Hosting | **S3 + CloudFront + Route 53** | static-only, cache-friendly |

### 7.2 Spoonacular proxy

- Client never talks to Spoonacular directly. All calls go to `/api/spoonacular/*`.
- Proxy holds `SPOONACULAR_API_KEY`, forwards requests, applies TTL caching (Nitro cache
  with SWR; 6h default) to minimize API spend.
- Rate limiting/abuse guard on proxy as needed.

### 7.3 Code layout (Nuxt)

```
app/
  assets/css/main.css
  components/
  composables/
  middleware/auth.ts
  pages/
    index.vue, search.vue, recipe/[id].vue, login.vue, signup.vue
    favorites.vue, account.vue, privacy.vue, terms.vue
    collections/index.vue, collections/[slug].vue
  utils/
  content/ (curated recipes, collections)
server/routes/api/spoonacular/
nuxt.config.ts
```

### 7.4 Env / config

- Client-safe: `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_API_BASE`, `NUXT_PUBLIC_ADSENSE_PUBLISHER_ID`,
  `NUXT_PUBLIC_ADSENSE_SLOT`, `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Server-only: `SPOONACULAR_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## 8. Completed Features

### Implemented
- **Home page** with curated sections, hero, SEO metadata and structured data.
- **Recipe cards** component with macros, favorites state, responsive layout.
- **Recipe detail** with scaling, instructions, JSON-LD, ad gating logic.
- **Search** (pantry + dish) with filters, URL state, proxy integration, noindex.
- **Collections** hub pages with editorial content and interlinking.
- **Accounts** via Supabase Auth, auth middleware, gated routes (favorites, account).
- **Favorites** with add/remove, list, free tier cap (RLS), error handling.
- **AdSlot** component with config gating and dev placeholder.
- **Privacy/Terms** static pages, footer links.
- **Proxy API** for Spoonacular (sorted listings, recipe detail, search) with Nitro caching.
- **Curated content** system (recipes.ts, collections.ts) for SEO-friendly publisher content.

### Verified via codebase
All core UI and data flows exist as described in the codebase inspection.

## 9. Implementation Notes

### 9.1 Daily new recipe recommendations (Home)

> **Status (2026-10-15): Deferred.** The seeded shuffle works mechanically, but with the current small curated sets the same recipes appear on consecutive days (observed: seeds `2026-10-13` and `2026-10-14` both yielded the same first pick for `quick-weeknight-dinners`). Not worth further investment until the library grows; deprioritized per product decision.

To achieve "new recipe recommendations daily" on the static home:
- Generate a deterministic shuffle seed from current date: `new Date().toISOString().slice(0,10)` → `YYYY-MM-DD`.
- For each home section (collection), take the collection's `recipeIds` array and shuffle it using the date seed (e.g., Fisher-Yates with seeded RNG like Mulberry32).
- Display first `limit` items from the shuffled list. This changes daily on each build/regeneration.
- If we later pull from dynamic API pools, we can use `sort` + `offset` with random offset, but curated set is fine for now.
- Shuffle implementation can live in `app/utils/randomize.ts` or inline in home page generation.

Example seeded shuffle:
```ts
function seededShuffle<T>(arr: T[], seedStr: string): T[] {
  const s = seedStr.split('-').reduce((a,b)=>a*parseInt(b),1)
  const copy = [...arr]
  let seed = s % 2147483647
  for (let i = copy.length-1; i>0; i--) {
    seed = (seed * 16807) % 2147483647
    const j = Math.floor((seed/2147483647)*(i+1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
```

### 9.2 Load more on search

Enhance search to support pagination:
- Track `offset` (or `page`). Default `offset=0`, `number=12` (match current API behavior).
- When user clicks "Load more", append results to existing list rather than replacing.
- Update URL query params (`offset` or `page`) without full reload; preserve all filters.
- For pantry mode via `findByIngredients`, Spoonacular returns fixed set; we can request
  more by passing `number` and handling client-side or re-asking with same params (API returns
  up to 100 total in practice; default 12). Our proxy passes through; current server uses
  `number: '12'` for findByIngredients and caps complexSearch to 12. To support load more,
  extend proxy to accept `number`/`offset` and return next batch; also return/indicate if
  more exist (or just rely on getting empty results).
- Update `server/routes/api/spoonacular/search.get.ts` to accept `offset`/`number` from query.
- Update `server/utils/spoonacular.ts`: `findByIngredients` and `complexSearch` should accept
  pagination params (defaulting to current behavior for backward compat).
- In `app/pages/search.vue`, add `offset` ref, `loadingMore` ref, `hasMore` computed (if
  results length < total expected or next call returns < requested), and "Load more" button
  shown when `searched && results.length > 0 && hasMore`.
- On "Load more", call `churnMore()` that fetches with current params + offset, appends
  to `results`, increments offset.

Also consider that complexSearch may have different total counts; Spoonacular returns `totalResults`
in response. Our proxy could pass through shape or just return array - but easier to return
array plus headers? Or extend to return `{results, totalResults, offset}`. But current API
consumers expect `FoundRecipe[]`. Alternative: add optional `includeMeta` param or create
new endpoint. For minimal change, keep existing endpoints returning arrays but also support
`offset`/`number`; detect if more by requesting next page and comparing lengths.

## 10. Deployment & Operations (Current State)

- Static generation via `nuxi generate` produces `dist/` for S3 hosting.
- Single Lambda proxy from Nitro AWS Lambda preset (referenced in build scripts).
- Environment variables configured per §7.4.
- CI/CD: build → lint → typecheck → generate → deploy (as configured).
- Caching: HTML short TTL, assets immutable, API responses cached 6h with SWR in Nitro.

## 11. Milestones

| Milestone | Scope | Exit criteria |
| --- | --- | --- |
| **M0 — Complete** | Core scaffold, auth, favorites, search, collections, recipe detail | App functional as-is. |
| **M1 — Home daily randomization** | Add seeded shuffle for home sections; update index.vue | *Deferred* — code in place but randomization not visibly changing output with current library size. |
| **M2 — Load more search** | Extend proxy for pagination, update search UI with "Load more" | "Load more" button appears when results exist and more available; appends results; preserves filters/URL; works for both modes. |
| **M3 — Polish & QA** | Lint, typecheck, verify SEO, test on static preview | All checks pass; search pagination smooth; home rotation correct for test dates. |
| **M4 — Deploy** | Build and deploy updated static + proxy | Production updated; features working end-to-end. |

## 12. Risks & Mitigations

| Risk | Likelihood / impact | Mitigation |
| --- | --- | --- |
| Spoonacular quota on increased search pagination | Med / Med | Proxy TTL cache; reasonable page sizes (12); SWR caching; monitor usage. |
| Load more UX breaks on filter changes | Low / Med | Reset offset/results on mode/filter change; clear pagination state. |
| Seeded shuffle predictability | Low / Low | Deterministic by date is intended for static daily refresh; not for security. |
| Recipe detail not prerendered for all IDs | Med / Med | Curated set prerendered via collections/crawl; dynamic fall back to runtime with appropriate SEO. |

---

## 13. Change Log

- **v1.4 (2026-10-15):** DNS/host canonicalization: extended the CloudFront viewer-request function (`slash-normalize`) so `www.pantrytostore.com` 301s to the apex domain in a single hop (combined with trailing-slash normalization). Added a visible breadcrumb to collection pages (Collections › {collection}), aligned with the BreadcrumbList JSON-LD.
- **v1.3 (2026-10-15):** Fixed Search Console "page with redirect" issue: production host 301s subpaths to a trailing slash, so sitemap + canonical + JSON-LD URLs now emit trailing slashes to match the served URL (`site.trailingSlash`, `useSeo` `canonicalPath`). Added BreadcrumbList JSON-LD to collection pages and enriched recipe breadcrumbs. Added internal links: recipe → collection/search, about → collections, collection → search CTA. Added og/twitter meta across pages and footer credit link.
- **v1.2 (2026-10-15):** SEO pass: added og/twitter meta across pages, BreadcrumbList JSON-LD on collection pages, footer credit link. Marked FR-5.7 deferred (randomization not visibly working with current library size).
- **v1.1 (2026-10-13):** Removed legacy Lovable references and "feature parity with old site" language. Moved completed features to explicit status table. Added FR-5.6 (Load more on search). Added FR-5.7 (Daily new recipe recommendations on home). Clarified current implementation state based on codebase audit. Added implementation notes for both features.
- **v1.0 (2026-09-08):** Initial approved PRD.

---

*This document reflects the current implemented state and the requested feature additions.*
