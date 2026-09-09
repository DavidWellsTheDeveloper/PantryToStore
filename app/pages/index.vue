<template>
  <div class="container">
    <!-- Hero (SSG) -->
    <section class="hero">
      <p class="eyebrow">Cook smart · Eat well · Waste less</p>
      <h1 class="hero__title">Great meals start with what you already have.</h1>
      <p class="hero__lede">
        We help you cook healthy, affordable meals using the ingredients in your kitchen — so
        you save money, save time, and waste less food.
      </p>
      <div class="hero__actions">
        <NuxtLink to="/search" class="btn btn--primary btn--lg">Find a recipe</NuxtLink>
      </div>
    </section>

    <!-- Suggested: Healthy (SSG — content baked at generate time, PRD §6.1) -->
    <section class="section">
      <div class="section__head">
        <div>
          <p class="eyebrow">Healthy picks</p>
          <h2>Nourishing recipes to try</h2>
        </div>
        <button v-if="!allHealthy" type="button" class="btn btn--outline btn--sm" @click="loadMore('healthy')">
          Load more
        </button>
      </div>
      <div v-if="healthy.length" class="recipe-grid">
        <RecipeCard v-for="r in healthy" :key="r.id" :recipe="r" />
      </div>
    </section>

    <!-- Suggested: Popular -->
    <section class="section">
      <div class="section__head">
        <div>
          <p class="eyebrow">Community favorites</p>
          <h2>Recipes home cooks love</h2>
        </div>
        <button v-if="!allPopular" type="button" class="btn btn--outline btn--sm" @click="loadMore('popular')">
          Load more
        </button>
      </div>
      <div v-if="popular.length" class="recipe-grid">
        <RecipeCard v-for="r in popular" :key="r.id" :recipe="r" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { FoundRecipe } from '../utils/spoonacular.types'
import { useSpoonacularFetch, spoonacularFetch } from '../composables/useSpoonacular'

useSeoMeta({
  title: null, // brand default comes from the title template
  description:
    'Discover healthy, affordable recipes built around what you already have. Reduce food waste with smart meal prep and pantry-first cooking.',
  ogType: 'website',
})
useCanonical()

// Site-level structured data (PRD §6.1): WebSite + SearchAction + Organization.
const siteUrl = useSiteUrl()
useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            name: 'Pantry to Store',
            url: siteUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${siteUrl}/search?mode=dish&q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@type': 'Organization',
            name: 'Pantry to Store',
            url: siteUrl,
          },
        ],
      }),
    },
  ],
}))

const { data: healthyData } = await useSpoonacularFetch<FoundRecipe[]>(
  '/api/spoonacular/sorted?sort=healthiness&limit=6',
)
const { data: popularData } = await useSpoonacularFetch<FoundRecipe[]>(
  '/api/spoonacular/sorted?sort=popularity&limit=6',
)

const healthy = ref<FoundRecipe[]>(healthyData.value ?? [])
const popular = ref<FoundRecipe[]>(popularData.value ?? [])
const allHealthy = ref(false)
const allPopular = ref(false)

async function loadMore(section: 'healthy' | 'popular') {
  const isHealthy = section === 'healthy'
  const list = isHealthy ? healthy : popular
  const offset = list.value.length
  const more = await spoonacularFetch<FoundRecipe[]>(
    `/api/spoonacular/sorted?sort=${isHealthy ? 'healthiness' : 'popularity'}&limit=6&offset=${offset}`,
  )
  if (more.length) {
    const seen = new Set(list.value.map((r) => r.id))
    list.value = [...list.value, ...more.filter((r) => !seen.has(r.id))]
  }
  if (isHealthy) allHealthy.value = true
  else allPopular.value = true
}
</script>

<style scoped>
.hero {
  max-width: 40rem;
  margin-inline: auto;
  text-align: center;
  padding: 3rem 0 2rem;
}

.hero__title {
  margin-top: 0.75rem;
  font-size: clamp(2rem, 5vw, 3rem);
}

.hero__lede {
  margin-top: 1.25rem;
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  color: var(--muted-foreground);
}

.hero__actions {
  margin-top: 1.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.section {
  margin-top: 4rem;
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
</style>