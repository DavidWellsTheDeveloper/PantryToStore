<script setup lang="ts">
useHead({
  titleTemplate: (title) =>
    title ? `${title} · Pantry to Store` : 'Pantry to Store — Cook smart, eat well, waste less',
})
</script>

<template>
  <div class="site">
    <SiteHeader />
    <main class="site-main">
      <slot />
    </main>
    <SiteFooter />
    <CookieConsent />
  </div>
</template>

<style scoped>
.site {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-main {
  flex: 1;
  padding: 3rem 0 4rem;
}
</style>