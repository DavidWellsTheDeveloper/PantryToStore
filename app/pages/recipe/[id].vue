<template>
  <div class="container">
    <NuxtLink to="/" class="back">← All recipes</NuxtLink>

    <div v-if="error || !recipe" class="empty">
      <p class="eyebrow">Recipe</p>
      <h1>Recipe unavailable</h1>
      <p>We couldn't load this recipe right now.</p>
      <NuxtLink to="/search" class="btn btn--primary">Search recipes</NuxtLink>
    </div>

    <article v-else class="detail">
      <header class="detail__header">
        <p class="detail__eyebrow">Recipe</p>
        <div class="detail__titleRow">
          <h1 class="detail__title">{{ recipe.title }}</h1>
          <button
            type="button"
            class="fav-btn"
            :class="{ 'fav-btn--active': isFav }"
            :disabled="favBusy"
            :aria-label="isFav ? 'Remove from favorites' : 'Save to favorites'"
            :title="user ? (isFav ? 'Remove from favorites' : 'Save to favorites') : 'Sign in to save favorites'"
            @click="toggleFavorite"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" :class="{ 'fav-btn__svg': isFav }" aria-hidden="true">
              <path
                d="M12 21s-8-5.35-8-11A4.75 4.75 0 0 1 12 6a4.75 4.75 0 0 1 8 4c0 5.65-8 11-8 11Z"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <p class="detail__meta">
          <span v-if="recipe.readyInMinutes">{{ timeLabel }}</span>
          <span v-if="recipe.servings">{{ recipe.servings }} servings</span>
        </p>
        <MacrosChips :macros="recipe.macros" class="detail__macros" />
        <p v-if="curated?.intro" class="detail__intro">{{ curated.intro }}</p>
        <p v-if="favError" class="fav-error" role="status">{{ favError }}</p>
      </header>

      <div v-if="recipe.image" class="detail__media">
        <img :src="recipe.image" :alt="recipe.title" width="1200" height="675" class="detail__img" />
      </div>

      <div class="detail__columns">
        <!-- Ingredients + scaling -->
        <section v-if="recipe.extendedIngredients?.length" class="card panel">
          <div class="panel__head">
            <h2>Ingredients</h2>
            <label class="scale">
              Servings
              <button type="button" :disabled="scale <= 1" aria-label="Fewer servings" @click="scale--">−</button>
              <span>{{ scale }}</span>
              <button type="button" aria-label="More servings" @click="scale++">+</button>
            </label>
          </div>
          <ul class="ingredients">
            <li v-for="(ing, i) in recipe.extendedIngredients" :key="ing.id ?? i" class="ingredients__item">
              <span class="ingredients__amount">
                {{ amountLabel(ing) }}
              </span>
              <span class="ingredients__name">{{ displayName(ing) }}</span>
            </li>
          </ul>
        </section>

        <!-- Instructions -->
        <div class="panel-col">
          <AdSlot v-if="canShowAd" class="panel" />
          <section v-if="steps.length" class="card panel">
            <h2>Instructions</h2>
            <ol class="steps">
              <li v-for="step in steps" :key="step.number" class="steps__item">{{ step.step }}</li>
            </ol>
            <NuxtLink v-if="recipe.sourceUrl" :to="recipe.sourceUrl" class="btn btn--outline btn--sm source" target="_blank">
              View on {{ recipe.sourceName ?? 'the source' }} →
            </NuxtLink>
          </section>
          <section v-if="curated?.tips.length" class="card panel">
            <h2>Cook's notes</h2>
            <ul class="tips">
              <li v-for="(tip, i) in curated.tips" :key="i" class="tips__item">{{ tip }}</li>
            </ul>
          </section>
        </div>
      </div>

      <section v-if="curated?.faqs.length" class="card panel faq">
        <h2>Recipe questions</h2>
        <dl class="faq__list">
          <div v-for="(f, i) in curated.faqs" :key="i" class="faq__item">
            <dt class="faq__q">{{ f.q }}</dt>
            <dd class="faq__a">{{ f.a }}</dd>
          </div>
        </dl>
      </section>

      <section v-if="related.length" class="related">
        <div class="section__head">
          <div>
            <p class="eyebrow">Try next</p>
            <h2>More {{ related ? relatedTitle : '' }}</h2>
          </div>
          <NuxtLink v-if="relatedHub" :to="`/collections/${relatedHub}`" class="btn btn--outline btn--sm">
            View all →
          </NuxtLink>
        </div>
        <div class="recipe-grid">
          <RecipeCard v-for="r in related" :key="r.id" :recipe="r" />
        </div>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { SpoonacularRecipe, SpoonacularIngredient } from '../../utils/spoonacular.types'
import { useSpoonacularFetch } from '../../composables/useSpoonacular'
import { useFavorites } from '../../composables/useFavorites'
import { ensureAuthReady, useUser } from '../../composables/useAuth'
import { findCuratedRecipe, curatedCards } from '../../content/recipes'
import { findCollection } from '../../content/collections'
import { formatMinutes } from '../../utils/format'

const route = useRoute()
const id = Number(route.params.id)

const curated = findCuratedRecipe(id)

// Curated recipes are baked straight from the manifest (static-first, no API at build).
// Anything outside the curated library falls back to the runtime proxy.
const { data: apiRecipe, error } = curated
  ? ({ data: ref<SpoonacularRecipe | null>(null), error: ref<Error | null>(null) } as any)
  : await useSpoonacularFetch<SpoonacularRecipe>(`/api/spoonacular/recipe/${id}`)

const recipe = computed<SpoonacularRecipe | null>(() => curated ?? apiRecipe.value ?? null)

const fav = useFavorites()
const user = useUser()
const favBusy = ref(false)
const isFav = fav.isFavorite(id)
const favError = computed(() => fav.error.value ?? '')

onMounted(async () => {
  await ensureAuthReady()
  if (user.value) await fav.list()
})

async function toggleFavorite() {
  if (!user.value) {
    await navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }
  favBusy.value = true
  try {
    if (isFav.value) {
      await fav.remove(id)
    } else {
      await fav.add({ id, title: recipe.value?.title ?? 'Recipe', image: recipe.value?.image })
    }
  } catch {
    // fav.error is already set by the composable
  } finally {
    favBusy.value = false
  }
}

// Servings scaling (client interaction on a static page)
const scale = ref(recipe.value?.servings ?? 1)

function displayName(ing: SpoonacularIngredient): string {
  return ing.nameClean || ing.name || ing.original || ''
}

/** Render a measurement nicely: preserve common kitchen fractions, plain decimals otherwise. */
function prettyAmount(amount: number): string {
  const eps = 0.02
  const frac = [
    [3, 4, '¾'],
    [2, 3, '⅔'],
    [1, 2, '½'],
    [1, 3, '⅓'],
    [1, 4, '¼'],
  ] as const
  for (const [num, den, glyph] of frac) {
    if (Math.abs(amount - num / den) < eps) return glyph
  }
  if (Math.abs(amount - Math.round(amount)) < eps) return String(Math.round(amount))
  return String(Math.round(amount * 10) / 10)
}

function amountLabel(ing: SpoonacularIngredient): string {
  const m = ing.measures?.metric ?? ing.measures?.us
  if (m?.amount != null && m.unitShort != null) {
    return `${prettyAmount(Math.round(m.amount * scale.value * 10) / 10)} ${m.unitShort}`
  }
  if (ing.amount != null) {
    const scaled = Math.round(ing.amount * scale.value * 10) / 10
    return `${prettyAmount(scaled)}${ing.unit ? ' ' + ing.unit : ''}`
  }
  return ing.original ?? ''
}

const isStep = (g: { name?: string; steps?: unknown }): g is { name?: string; steps: { number: number; step: string }[] } =>
  Array.isArray(g?.steps)
const steps = computed(() => {
  const groups = recipe.value?.analyzedInstructions ?? []
  return groups.flatMap((g) => (isStep(g) ? g.steps.map((s) => ({ number: s.number, step: s.step })) : []))
})

const timeLabel = computed(() => formatMinutes(recipe.value?.readyInMinutes))

// AdSense placement rule (PRD §6.3): single in-content unit between ingredients and
// instructions, only when the recipe has real content (≥4 ingredients AND ≥6 steps).
const canShowAd = computed(
  () => (recipe.value?.extendedIngredients?.length ?? 0) >= 4 && steps.value.length >= 6,
)

// Related recipes share the recipe's first collection.
const relatedHub = computed(() => curated?.collections[0])
const related = computed(() => {
  if (!curated) return [] as ReturnType<typeof curatedCards>
  const slug = curated.collections[0]
  const hub = slug ? findCollection(slug) : undefined
  const ids = (hub?.recipeIds ?? []).filter((rid) => rid !== id)
  return curatedCards(ids.slice(0, 4))
})
const relatedTitle = computed(() => {
  const hub = relatedHub.value ? findCollection(relatedHub.value) : undefined
  return hub ? hub.title.replace(/^.*?:\s*/, '') : ''
})

const plainSummary = computed(() => (recipe.value?.summary ?? '').replace(/<[^>]+>/g, '').slice(0, 200))
const metaDescription = computed(() => {
  if (curated) return curated.summary
  return plainSummary.value
})

useCanonical()
const siteUrl = useSiteUrl()
const recipeUrl = computed(() => `${siteUrl}/recipe/${id}`)

useHead(() => {
  const r = recipe.value
  if (!r) return {}
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: r.title,
    url: recipeUrl.value,
    mainEntityOfPage: recipeUrl.value,
    ...(r.image ? { image: [r.image] } : {}),
    recipeYield: r.servings,
    totalTime: r.readyInMinutes ? `PT${r.readyInMinutes}M` : undefined,
    recipeIngredient: r.extendedIngredients?.map((i) => i.original ?? i.name).filter(Boolean),
    recipeInstructions: steps.value.map((s) => ({ '@type': 'HowToStep', position: s.number, text: s.step })),
    nutrition: recipe.value?.macros
      ? {
          '@type': 'NutritionInformation',
          calories: recipe.value.macros.calories ? `${Math.round(recipe.value.macros.calories)} calories` : undefined,
          proteinContent: recipe.value.macros.protein ? `${Math.round(recipe.value.macros.protein)} g` : undefined,
          carbohydrateContent: recipe.value.macros.carbs ? `${Math.round(recipe.value.macros.carbs)} g` : undefined,
          fatContent: recipe.value.macros.fat ? `${Math.round(recipe.value.macros.fat)} g` : undefined,
        }
      : undefined,
  }
  if (curated) {
    ld.description = curated.intro
    ld.keywords = curated.collections
      .map((slug) => findCollection(slug)?.title)
      .filter(Boolean)
      .join(', ')
    ld.datePublished = curated.datePublished
    ld.dateModified = curated.datePublished
    ld.author = { '@type': 'Organization', name: 'Pantry to Store', url: `${siteUrl}/about` }
    ld.publisher = { '@type': 'Organization', name: 'Pantry to Store', url: siteUrl }
  }
  for (const key of Object.keys(ld)) if (ld[key] == null) delete ld[key]

  return {
    title: r.title,
    meta: [
      { name: 'description', content: metaDescription.value },
      { property: 'og:title', content: r.title },
      { property: 'og:description', content: metaDescription.value },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: recipeUrl.value },
      ...(r.image ? [{ property: 'og:image', content: r.image }] : []),
    ],
    script: [
      { type: 'application/ld+json', innerHTML: JSON.stringify(ld) },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
            { '@type': 'ListItem', position: 2, name: r.title, item: recipeUrl.value },
          ],
        }),
      },
    ],
  }
})
</script>

<style scoped>
.back {
  display: inline-block;
  margin: 0 0 1.5rem;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

.detail__header {
  max-width: 42rem;
}

.detail__titleRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.detail__title {
  font-size: clamp(2rem, 4.5vw, 2.75rem);
  margin-bottom: 0.25rem;
}

.fav-btn {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--card);
  color: var(--muted-foreground);
  cursor: pointer;
}

.fav-btn:hover:not(:disabled) {
  color: var(--primary);
  border-color: var(--primary);
}

.fav-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.fav-btn--active {
  color: var(--primary);
  border-color: var(--primary);
}

.fav-btn--active .fav-btn__svg path {
  fill: currentColor;
}

.fav-error {
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--clay);
}

.detail__meta {
  display: flex;
  gap: 1rem;
  margin: 0;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

.detail__macros {
  margin-top: 1rem;
}

.detail__intro {
  margin: 1.25rem 0 0;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--muted-foreground);
}

.detail__media {
  margin: 2rem 0;
  border-radius: var(--radius);
  overflow: hidden;
}

.detail__img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.detail__columns {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
}

@media (min-width: 900px) {
  .detail__columns {
    flex-direction: row;
    align-items: flex-start;
  }

  .panel,
  .panel-col {
    flex: 1;
  }
}

.panel {
  padding: 1.5rem;
}

.panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.panel h2 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
}

.scale {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
}

.scale button {
  border: 1px solid var(--border);
  background: var(--background);
  border-radius: var(--radius);
  width: 1.75rem;
  height: 1.75rem;
  line-height: 1;
}

.scale span {
  font-variant-numeric: tabular-nums;
}

.ingredients {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ingredients__item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9375rem;
}

.ingredients__amount {
  font-variant-numeric: tabular-nums;
  min-width: 3.5rem;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding-left: 1.4rem;
  margin: 0 0 1.25rem;
}

.steps__item::marker {
  font-weight: 600;
  color: var(--primary);
}

.source {
  margin-top: 0.5rem;
}

.tips {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tips__item {
  position: relative;
  padding-left: 1.75rem;
  font-size: 0.9375rem;
  line-height: 1.55;
}

.tips__item::before {
  content: '✦';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--clay);
}

.faq {
  margin-top: 1.5rem;
}

.faq__list {
  margin: 0;
}

.faq__item {
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--border);
}

.faq__item:last-child {
  border-bottom: 0;
}

.faq__q {
  font-weight: 600;
  font-size: 0.9375rem;
}

.faq__a {
  margin: 0.25rem 0 0;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--muted-foreground);
}

.related {
  margin-top: 2.5rem;
}

.section__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.section__head h2 {
  margin: 0.25rem 0 0;
  font-size: 1.5rem;
}

.empty {
  max-width: 36rem;
}
</style>