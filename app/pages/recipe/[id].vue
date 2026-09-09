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
        <h1 class="detail__title">{{ recipe.title }}</h1>
        <p class="detail__meta">
          <span v-if="recipe.readyInMinutes">{{ recipe.readyInMinutes }} min</span>
          <span v-if="recipe.servings">{{ recipe.servings }} servings</span>
        </p>
        <MacrosChips :macros="recipe.macros" class="detail__macros" />
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
        <section v-if="steps.length" class="card panel">
          <h2>Instructions</h2>
          <ol class="steps">
            <li v-for="step in steps" :key="step.number" class="steps__item">{{ step.step }}</li>
          </ol>
          <NuxtLink v-if="recipe.sourceUrl" :to="recipe.sourceUrl" class="btn btn--outline btn--sm source" target="_blank">
            View on {{ recipe.sourceName ?? 'the source' }} →
          </NuxtLink>
        </section>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { SpoonacularRecipe, SpoonacularIngredient } from '../../utils/spoonacular.types'
import { useSpoonacularFetch } from '../../composables/useSpoonacular'

const route = useRoute()
const id = Number(route.params.id)

const { data: recipe, error } = await useSpoonacularFetch<SpoonacularRecipe>(
  `/api/spoonacular/recipe/${id}`,
)

// Servings scaling (client interaction on a static page)
const scale = ref(recipe.value?.servings ?? 1)

function displayName(ing: SpoonacularIngredient): string {
  return ing.nameClean || ing.name || ing.original || ''
}

function amountLabel(ing: SpoonacularIngredient): string {
  const m = ing.measures?.metric ?? ing.measures?.us
  if (m?.amount != null && m.unitShort != null) {
    return `${Math.round(m.amount * scale.value * 10) / 10} ${m.unitShort}`
  }
  if (ing.amount != null) {
    const amount = Math.round(ing.amount * scale.value * 10) / 10
    return `${amount}${ing.unit ? ' ' + ing.unit : ''}`
  }
  return ing.original ?? ''
}

const isStep = (g: { name?: string; steps?: unknown }): g is { name?: string; steps: { number: number; step: string }[] } =>
  Array.isArray(g?.steps)
const steps = computed(() => {
  const groups = recipe.value?.analyzedInstructions ?? []
  return groups.flatMap((g) => (isStep(g) ? g.steps.map((s) => ({ number: s.number, step: s.step })) : []))
})

const plainSummary = computed(() => (recipe.value?.summary ?? '').replace(/<[^>]+>/g, '').slice(0, 200))

useHead(() => {
  const r = recipe.value
  if (!r) return {}
  return {
    title: r.title,
    meta: [
      { name: 'description', content: plainSummary.value },
      { property: 'og:title', content: r.title },
      { property: 'og:description', content: plainSummary.value },
      { property: 'og:type', content: 'article' },
      ...(r.image ? [{ property: 'og:image', content: r.image }] : []),
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Recipe',
          name: r.title,
          ...(r.image ? { image: [r.image] } : {}),
          recipeYield: r.servings,
          totalTime: r.readyInMinutes ? `PT${r.readyInMinutes}M` : undefined,
          recipeIngredient: r.extendedIngredients?.map((i) => i.original ?? i.name).filter(Boolean),
          recipeInstructions: steps.value.map((s) => ({ '@type': 'HowToStep', position: s.number, text: s.step })),
          nutrition: r.macros
            ? {
                '@type': 'NutritionInformation',
                calories: r.macros.calories ? `${Math.round(r.macros.calories)} calories` : undefined,
                proteinContent: r.macros.protein ? `${Math.round(r.macros.protein)} g` : undefined,
                carbohydrateContent: r.macros.carbs ? `${Math.round(r.macros.carbs)} g` : undefined,
                fatContent: r.macros.fat ? `${Math.round(r.macros.fat)} g` : undefined,
              }
            : undefined,
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

.detail__eyebrow {
  margin-bottom: 0.75rem;
}

.detail__title {
  font-size: clamp(2rem, 4.5vw, 2.75rem);
  margin-bottom: 0.25rem;
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

@media (min-width: 900px) {
  .detail__columns {
    flex-direction: row;
    align-items: flex-start;
  }

  .panel {
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

.empty {
  max-width: 36rem;
}
</style>