<template>
  <div class="container">
    <div v-if="!collection" class="empty">
      <NuxtLink to="/collections" class="back">← All collections</NuxtLink>
      <p class="eyebrow">Collection</p>
      <h1>Collection not found</h1>
      <p>That collection doesn't exist — but there are more below.</p>
      <div class="empty__links">
        <NuxtLink v-for="c in collections" :key="c.slug" :to="`/collections/${c.slug}`" class="chip">
          {{ c.title }}
        </NuxtLink>
      </div>
    </div>

    <template v-else>
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol class="breadcrumb__list">
          <li class="breadcrumb__item">
            <NuxtLink to="/collections">Collections</NuxtLink>
          </li>
          <li class="breadcrumb__item breadcrumb__item--current" aria-current="page">
            {{ collection.title }}
          </li>
        </ol>
      </nav>

      <header class="hero">
        <p class="eyebrow">{{ collection.eyebrow }}</p>
        <h1 class="hero__title">{{ collection.title }}</h1>
        <p class="hero__lede">{{ collection.intro }}</p>
      </header>

      <div class="recipe-grid">
        <RecipeCard v-for="r in cards" :key="r.id" :recipe="r" />
      </div>

      <div class="cta card panel">
        <p>Cooking from what you have? Find recipes that use the ingredients already in your kitchen.</p>
        <NuxtLink to="/search" class="btn btn--outline btn--sm">Search by ingredient →</NuxtLink>
      </div>

      <nav v-if="others.length" class="more" aria-label="More collections">
        <p class="eyebrow">Keep browsing</p>
        <div class="more__links">
          <NuxtLink v-for="c in others" :key="c.slug" :to="`/collections/${c.slug}`" class="chip">
            {{ c.title }}
          </NuxtLink>
        </div>
      </nav>
    </template>
  </div>
</template>

<script setup lang="ts">
import { collections, findCollection } from '../../content/collections'
import { curatedCards } from '../../content/recipes'

const route = useRoute()
const slug = String(route.params.slug)
const collection = findCollection(slug)

const cards = curatedCards(collection?.recipeIds ?? [])

const others = collections.filter((c) => c.slug !== slug)

useSeoMeta({
  title: computed(() => (collection ? collection.title : 'Collection not found')),
  description: collection?.description ?? 'Browse Pantry to Store recipe collections.',
})
useCanonical()

const siteUrl = useSiteUrl()
useHead(() => {
  if (!collection) return {}
  return {
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: collection.title,
          description: collection.description,
          url: `${siteUrl}/collections/${collection.slug}/`,
          itemListElement: cards.map((r, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: r.title,
            url: `${siteUrl}/recipe/${r.id}/`,
          })),
        }),
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Collections', item: `${siteUrl}/collections/` },
            { '@type': 'ListItem', position: 2, name: collection.title, item: `${siteUrl}/collections/${collection.slug}/` },
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
  margin: 0 0 2rem;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

.breadcrumb {
  margin: 0 0 1.5rem;
}

.breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
}

.breadcrumb__item {
  display: inline-flex;
  align-items: center;
  color: var(--muted-foreground);
}

.breadcrumb__item a {
  color: var(--muted-foreground);
  text-decoration: none;
}

.breadcrumb__item a:hover {
  color: var(--foreground);
  text-decoration: underline;
}

.breadcrumb__item + .breadcrumb__item::before {
  content: '›';
  margin-right: 0.5rem;
  color: color-mix(in srgb, var(--muted-foreground), transparent 40%);
}

.breadcrumb__item--current {
  color: var(--foreground);
}

.hero {
  max-width: 42rem;
  margin-inline: auto;
  text-align: center;
  padding: 1.5rem 0 2.5rem;
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

.cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2.5rem;
}

.cta p {
  margin: 0;
  color: var(--muted-foreground);
}

.more {
  margin-top: 2.5rem;
}

.more__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--card);
  font-size: 0.875rem;
}

.chip:hover {
  border-color: var(--primary);
  color: var(--primary);
  text-decoration: none;
}

.empty {
  max-width: 40rem;
}

.empty__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>