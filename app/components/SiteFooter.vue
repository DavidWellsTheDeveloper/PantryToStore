<template>
  <footer class="site-footer">
    <div class="container row row--between site-footer__inner">
      <NuxtLink to="/" class="brand" aria-label="Pantry to Store — home">
        <img src="/brand/logo-mono.svg" alt="Pantry to Store" width="128" height="36" class="brand__logo" />
      </NuxtLink>
      <nav class="links" aria-label="Footer">
        <NuxtLink to="/about" class="links__item">About</NuxtLink>
        <NuxtLink to="/collections" class="links__item">Collections</NuxtLink>
        <NuxtLink to="/contact" class="links__item">Contact</NuxtLink>
        <NuxtLink to="/privacy" class="links__item">Privacy</NuxtLink>
        <NuxtLink to="/terms" class="links__item">Terms</NuxtLink>
      </nav>
      <p class="copyright">© 2026 Pantry to Store</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid color-mix(in srgb, var(--border), transparent 40%);
  padding: 2rem 0;
}

.site-footer__inner {
  gap: 0.5rem;
}

.brand {
  display: inline-flex;
  align-items: center;
}

.brand__logo {
  display: block;
  height: 1.75rem;
  width: auto;
}

.links {
  display: flex;
  gap: 1.25rem;
}

.links__item {
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

.copyright {
  flex-basis: 100%;
  margin: 1rem 0 0;
  font-size: 0.8125rem;
  color: color-mix(in srgb, var(--muted-foreground), transparent 20%);
}
</style>