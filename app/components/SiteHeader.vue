<script setup lang="ts">
import { ensureAuthReady, useUser } from '../composables/useAuth'

const user = useUser()

const avatar = computed(() => (user.value?.email ?? '?').charAt(0).toUpperCase())

// Mobile hamburger menu (client-only; desktop shows the full nav).
const open = ref(false)
const route = useRoute()

function closeMenu() {
  open.value = false
}

watch(
  () => route.fullPath,
  () => closeMenu(),
)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeMenu()
}

onMounted(() => {
  ensureAuthReady()
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// Body scroll lock while the menu is open so the panel reads like a modal on small screens.
watch(open, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <nav class="nav" aria-label="Main">
        <button
          type="button"
          class="nav__toggle"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          :aria-label="open ? 'Close menu' : 'Open menu'"
          @click="open = !open"
        >
          <svg v-if="!open" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>

        <div class="nav__links">
          <NuxtLink to="/search" class="nav__link">Search</NuxtLink>
          <NuxtLink to="/collections" class="nav__link">Collections</NuxtLink>
          <NuxtLink to="/about" class="nav__link">About</NuxtLink>
          <NuxtLink to="/favorites" class="nav__link">Favorites</NuxtLink>
          <NuxtLink v-if="user" to="/account" class="nav__account" :title="user.email ?? 'Account'">
            {{ avatar }}
          </NuxtLink>
          <NuxtLink v-else to="/login" class="btn btn--sm btn--primary">Sign in</NuxtLink>
        </div>

        <div v-show="open" id="mobile-menu" class="nav__panel">
          <NuxtLink to="/search" class="nav__panel-link" @click="closeMenu">Search recipes</NuxtLink>
          <NuxtLink to="/collections" class="nav__panel-link" @click="closeMenu">Browse collections</NuxtLink>
          <NuxtLink to="/about" class="nav__panel-link" @click="closeMenu">About</NuxtLink>
          <NuxtLink to="/favorites" class="nav__panel-link" @click="closeMenu">Favorites</NuxtLink>
          <NuxtLink to="/contact" class="nav__panel-link" @click="closeMenu">Contact</NuxtLink>
          <div class="nav__panel-action">
            <NuxtLink v-if="user" to="/account" class="btn btn--primary" @click="closeMenu">Account</NuxtLink>
            <NuxtLink v-else to="/login" class="btn btn--primary" @click="closeMenu">Sign in</NuxtLink>
          </div>
        </div>
      </nav>

      <!-- Brand sits on the right; navigation leads on the left. -->
      <NuxtLink to="/" class="brand">
        Pantry <span class="brand__accent">to</span> Store
      </NuxtLink>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
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
  position: static;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav__toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  margin-left: -0.5rem;
  border: 0;
  border-radius: var(--radius);
  background: transparent;
  color: var(--foreground);
  cursor: pointer;
}

.nav__toggle:hover {
  background: var(--secondary);
}

.nav__panel {
  display: none;
}

.nav__links {
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
  margin-left: 0.5rem;
  border-radius: 999px;
  background: var(--forest);
  color: var(--background);
  font-weight: 600;
}

.nav__account:hover {
  background: var(--primary);
  text-decoration: none;
}

/* Mobile menu — collapsed by default below the breakpoint. */
@media (max-width: 767px) {
  .nav__toggle {
    display: inline-flex;
  }

  .nav__links {
    display: none;
  }

  .nav__panel {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem 1.5rem 1.5rem;
    background: var(--background);
    border-bottom: 1px solid var(--border);
    box-shadow: 0 12px 30px rgb(60 50 30 / 0.12);
  }

  .nav__panel-link {
    display: flex;
    align-items: center;
    padding: 0.8rem 0.5rem;
    border-radius: var(--radius);
    font-size: 1rem;
    font-weight: 500;
  }

  .nav__panel-link:hover {
    background: var(--secondary);
    text-decoration: none;
  }

  .nav__panel-action {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border);
  }

  .nav__panel .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>