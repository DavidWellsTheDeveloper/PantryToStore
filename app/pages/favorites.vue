<template>
  <div class="container">
    <section class="head">
      <p class="eyebrow">Saved for later</p>
      <h1>Favorites</h1>
      <p v-if="count" class="head__note">{{ count }} saved recipe{{ count === 1 ? '' : 's' }}</p>
      <p v-if="isFull" class="head__note">Free tier is capped at 10 saved recipes.</p>
    </section>

    <p v-if="error" class="alert" role="alert">{{ error }}</p>

    <div v-if="loading" class="recipe-grid" aria-busy="true">
      <div v-for="n in 3" :key="n" class="skeleton skeleton--card"></div>
    </div>

    <div v-else-if="count" class="recipe-grid">
      <div v-for="f in favorites" :key="f.id" class="fav">
        <RecipeCard
          v-if="f.recipe"
          :recipe="{ id: f.recipe.id, title: f.recipe.title, image: f.recipe.image ?? '' }"
        />
        <button
          type="button"
          class="fav__remove"
          :aria-label="`Remove ${f.recipe?.title ?? 'favorite'}`"
          @click="remove(f.recipe_id)"
        >
          ×
        </button>
      </div>
    </div>

    <div v-else-if="!loading" class="empty">
      <p>No favorites yet.</p>
      <p>Tap the heart on a recipe you love to save it here.</p>
      <NuxtLink to="/search" class="btn btn--primary">Find a recipe</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Favorites',
  robots: 'noindex, nofollow',
})

const { favorites, loading, error, count, isFull, list, remove } = useFavorites()

onMounted(() => list())
</script>

<style scoped>
.head {
  margin-bottom: 1.25rem;
}

.head h1 {
  margin: 0.25rem 0 0;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
}

.head__note {
  margin: 0.375rem 0 0;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

.alert {
  color: var(--clay);
  font-weight: 500;
  font-size: 0.875rem;
}

.fav {
  position: relative;
}

.fav__remove {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1;
  border: 0;
  border-radius: 999px;
  width: 1.75rem;
  height: 1.75rem;
  background: var(--card);
  color: var(--foreground);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
  line-height: 1;
  font-size: 1.1rem;
}

.fav__remove:hover {
  background: var(--clay);
  color: var(--primary-contrast);
}

.empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--muted-foreground);
}

.empty .btn {
  margin-top: 0.75rem;
}

.skeleton--card {
  height: 340px;
}
</style>