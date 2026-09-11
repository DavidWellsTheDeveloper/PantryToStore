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
        <NuxtLink to="/collections" class="btn btn--outline btn--lg">Browse collections</NuxtLink>
      </div>
    </section>

    <!-- Curated sections (SSG — baked at generate time, PRD §6.1) -->
    <section v-for="section in homeSections" :key="section.collection" class="section">
      <div class="section__head">
        <div>
          <p class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ findCollection(section.collection)?.title ?? 'Recipes' }}</h2>
        </div>
        <NuxtLink :to="`/collections/${section.collection}`" class="btn btn--outline btn--sm">
          View all →
        </NuxtLink>
      </div>
      <div class="recipe-grid">
        <RecipeCard v-for="r in cardsFor(section.collection)" :key="r.id" :recipe="r" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { homeSections, collections, findCollection } from '../content/collections'
import { curatedCards } from '../content/recipes'

useSeoMeta({
  title: null, // brand default comes from the title template
  description:
    'Discover healthy, affordable recipes built around what you already have. Reduce food waste with smart meal prep and pantry-first cooking.',
  ogType: 'website',
})
useCanonical()

function cardsFor(collectionSlug: string) {
  const col = findCollection(collectionSlug)
  return curatedCards(col?.recipeIds ?? []).slice(0, homeSections.find((s) => s.collection === collectionSlug)?.limit ?? 6)
}

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
            logo: `${siteUrl}/favicon.ico`,
          },
          {
            '@type': 'ItemList',
            name: 'Pantry to Store collections',
            itemListElement: collections.map((c, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: c.title,
              url: `${siteUrl}/collections/${c.slug}`,
            })),
          },
        ],
      }),
    },
  ],
}))
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