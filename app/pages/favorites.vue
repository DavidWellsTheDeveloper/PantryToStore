<template>
  <div class="container">
    <p class="eyebrow">Favorites</p>
    <h1>Your favorites</h1>
    <p class="muted">
      Recipes you save live here. Accounts and gated pages land in milestone M3 (PRD §6.5–6.6),
      protected by Supabase Auth + RLS.
    </p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Favorites',
  robots: 'noindex, nofollow',
})
</script>

<style scoped>
.muted {
  color: var(--muted-foreground);
  max-width: 38rem;
}
</style>