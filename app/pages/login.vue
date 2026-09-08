<template>
  <div class="container">
    <p class="eyebrow">Accounts</p>
    <h1>Sign in</h1>
    <p class="muted">
      Email + Google sign-in arrives in milestone M3 via Supabase Auth (client-side, PRD §6.5).
    </p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Sign in',
  robots: 'noindex, nofollow',
})
</script>

<style scoped>
.muted {
  color: var(--muted-foreground);
  max-width: 38rem;
}
</style>