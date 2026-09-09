<script setup lang="ts">
import { ensureAuthReady, useUser } from '../composables/useAuth'

const user = useUser()

const avatar = computed(() => (user.value?.email ?? '?').charAt(0).toUpperCase())

onMounted(() => ensureAuthReady())
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <NuxtLink to="/" class="brand">
        Pantry <span class="brand__accent">to</span> Store
      </NuxtLink>

      <nav class="nav" aria-label="Main">
        <NuxtLink to="/search" class="nav__link">Search</NuxtLink>
        <NuxtLink to="/favorites" class="nav__link">Favorites</NuxtLink>
        <NuxtLink v-if="user" to="/account" class="nav__account" :title="user.email ?? 'Account'">
          {{ avatar }}
        </NuxtLink>
        <NuxtLink v-else to="/login" class="btn btn--sm btn--primary">Sign in</NuxtLink>
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
  width: 100%;
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

.nav__account {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: var(--forest);
  color: var(--background);
  font-weight: 600;
}

.nav__account:hover {
  background: var(--primary);
  text-decoration: none;
}

@media (max-width: 560px) {
  .nav__link:not(.btn) {
    display: none;
  }
}
</style>