<template>
  <div class="container">
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

    <!-- M1: category sections render here (PRD §6.1) -->
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Pantry to Store',
  description:
    'Discover healthy, affordable recipes built around what you already have. Reduce food waste with smart meal prep and pantry-first cooking.',
})
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
</style>