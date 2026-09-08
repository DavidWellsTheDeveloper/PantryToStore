<template>
  <div class="container">
    <p class="eyebrow">Search</p>
    <h1>Find a recipe</h1>
    <p class="muted">
      Search by what's in your pantry or by dish name, with filters for diet, allergens, cook
      time, and ingredient count. Coming in milestone M2 (PRD §6.4).
    </p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Search',
  description:
    'Search recipes by what is in your pantry or by dish name. Filter by diet, allergens, cook time, and ingredient count.',
})
</script>

<style scoped>
.muted {
  color: var(--muted-foreground);
  max-width: 38rem;
}
</style>