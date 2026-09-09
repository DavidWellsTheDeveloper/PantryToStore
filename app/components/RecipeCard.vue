<script setup lang="ts">
import type { FoundRecipe } from '../utils/spoonacular.types'

const props = defineProps<{ recipe: FoundRecipe }>()

const detailUrl = computed(() => `/recipe/${props.recipe.id}`)
const metaLine = computed(() => {
  const parts: string[] = []
  if (props.recipe.readyInMinutes) parts.push(`${props.recipe.readyInMinutes} min`)
  if (props.recipe.ingredientCount != null) parts.push(`${props.recipe.ingredientCount} ingredients`)
  return parts.join(' · ')
})
</script>

<template>
  <NuxtLink :to="detailUrl" class="card recipe-card">
    <div class="recipe-card__media">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        :alt="recipe.title"
        loading="lazy"
        decoding="async"
        width="800"
        height="600"
        class="recipe-card__img"
      />
    </div>
    <div class="recipe-card__body">
      <h3 class="recipe-card__title">{{ recipe.title }}</h3>
      <p v-if="metaLine" class="recipe-card__meta">{{ metaLine }}</p>
      <MacrosChips :macros="recipe.macros" />
    </div>
  </NuxtLink>
</template>

<style scoped>
.recipe-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.recipe-card:hover {
  box-shadow: 0 6px 20px rgb(60 50 30 / 0.1);
  transform: translateY(-2px);
  text-decoration: none;
}

.recipe-card__media {
  aspect-ratio: 4 / 3;
  background: var(--sand);
  overflow: hidden;
}

.recipe-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

.recipe-card__title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  line-height: 1.25;
  margin: 0;
}

.recipe-card__meta {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
}
</style>