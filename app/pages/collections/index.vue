<template>
  <div class="container">
    <header class="hero">
      <p class="eyebrow">Recipe collections</p>
      <h1 class="hero__title">Browse all collections</h1>
      <p class="hero__lede">
        Quick weeknight dinners, set-and-forget slow-cooker meals, plant-forward plates, and the
        comfort food you crave. Every collection is a group of recipes built around real pantry
        cooking — short lists, familiar ingredients, no fuss.
      </p>
    </header>

    <div class="collection-grid">
      <NuxtLink
        v-for="col in collections"
        :key="col.slug"
        :to="`/collections/${col.slug}`"
        class="card collection-card"
      >
        <div class="collection-card__body">
          <p class="collection-card__eyebrow">{{ col.eyebrow }}</p>
          <h2 class="collection-card__title">{{ col.title }}</h2>
          <p class="collection-card__intro">{{ col.intro }}</p>
          <p class="collection-card__meta">
            {{ col.recipeIds.length }} recipes · View collection →
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collections } from '../../content/collections'

useSeoMeta({
  title: 'Browse Collections',
  description:
    'Browse Pantry to Store recipe collections — quick weeknight dinners, one-pot and slow-cooker meals, plant-forward recipes, and comfort food favorites built around what you already have.',
})
useCanonical()

const siteUrl = useSiteUrl()
useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Pantry to Store recipe collections',
        itemListElement: collections.map((c, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: c.title,
          url: `${siteUrl}/collections/${c.slug}`,
        })),
      }),
    },
  ],
}))
</script>

<style scoped>
.hero {
  max-width: 38rem;
  margin-inline: auto;
  text-align: center;
  padding: 3rem 0 1rem;
}

.hero__title {
  margin-top: 0.75rem;
}

.hero__lede {
  margin-top: 1.25rem;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--muted-foreground);
}

.collection-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-top: 2.5rem;
}

.collection-card {
  flex: 1 1 240px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.collection-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.collection-card__eyebrow {
  margin: 0;
}

.collection-card__title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  margin: 0;
}

.collection-card__intro {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--muted-foreground);
}

.collection-card__meta {
  margin-top: auto;
  padding-top: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--clay);
}
</style>