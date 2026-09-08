<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <NuxtLink to="/" class="brand">
        Pantry <span class="brand__accent">to</span> Store
      </NuxtLink>

      <nav class="nav" aria-label="Main">
        <NuxtLink to="/search" class="nav__link">Search</NuxtLink>
        <NuxtLink to="/favorites" class="nav__link">Favorites</NuxtLink>
        <NuxtLink to="/login" class="btn btn--sm btn--primary">Sign in</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  height: var(--header-h);
  display: flex;
  align-items: center;
  background: color-mix(in srgb, var(--background), transparent 15%);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid color-mix(in srgb, var(--border), transparent 40%);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand {
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.brand__accent {
  color: var(--primary);
}

.nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav__link {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  color: color-mix(in srgb, var(--foreground), transparent 20%);
}

.nav__link:hover {
  background: var(--secondary);
  text-decoration: none;
}

.nav__link.router-link-active {
  color: var(--foreground);
  font-weight: 500;
}

@media (max-width: 560px) {
  .nav__link:not(.btn) {
    display: none;
  }
}
</style>