<template>
  <div class="container">
    <section class="hero">
      <p class="eyebrow">Your recipes, saved</p>
      <h1>Sign in to Pantry to Store</h1>
      <p class="hero__lede">Save favorites, track meals, and keep your kitchen on repeat.</p>
    </section>

    <section class="panel card">
      <div class="tabs" role="tablist" aria-label="Auth mode">
        <button
          type="button"
          role="tab"
          :aria-selected="mode === 'in'"
          class="tabs__item"
          :class="{ 'tabs__item--active': mode === 'in' }"
          @click="mode = 'in'"
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="mode === 'up'"
          class="tabs__item"
          :class="{ 'tabs__item--active': mode === 'up' }"
          @click="mode = 'up'"
        >
          Create account
        </button>
      </div>

      <form class="form" @submit.prevent="submit">
        <label class="field">
          <span class="field__label" for="auth-email">Email</span>
          <input
            id="auth-email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="input"
            placeholder="you@example.com"
          />
        </label>

        <label class="field">
          <span class="field__label" for="auth-password">Password</span>
          <input
            id="auth-password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="input"
            placeholder="••••••••"
          />
        </label>

        <p v-if="error" class="alert alert--error" role="alert">{{ error }}</p>
        <p v-if="info" class="alert" role="status">{{ info }}</p>

        <button type="submit" class="btn btn--primary" :disabled="busy">
          {{ busy ? 'One moment…' : mode === 'in' ? 'Sign in' : 'Create account' }}
        </button>
      </form>

      <div class="or"><span>or</span></div>

      <button type="button" class="btn btn--outline btn--google" :disabled="busy" @click="google">
        Continue with Google
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ensureAuthReady, signInWithEmail, signUpWithEmail, signInWithGoogle, useUser } from '../composables/useAuth'

useSeoMeta({
  title: 'Sign in',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const mode = ref<'in' | 'up'>('in')
const email = ref('')
const password = ref('')
const error = ref('')
const info = ref('')
const busy = ref(false)

const redirectTo = computed(() =>
  typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
    ? route.query.redirect
    : '/',
)

function friendly(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'Incorrect email or password.'
  if (/already registered/i.test(message)) return 'An account with this email already exists. Try signing in.'
  if (/password should be at least/i.test(message)) return message
  if (/rate limit/i.test(message)) return 'Too many attempts. Please wait a moment and try again.'
  if (/email not confirmed|confirmation/i.test(message)) return 'Please confirm your email first (check your inbox).'
  return message
}

async function submit() {
  error.value = ''
  info.value = ''
  busy.value = true
  try {
    const res =
      mode.value === 'up'
        ? await signUpWithEmail(email.value, password.value)
        : await signInWithEmail(email.value, password.value)
    if (res.error) {
      error.value = friendly(res.error.message)
      return
    }
    if (mode.value === 'up' && !res.data.session) {
      info.value = `Check ${email.value} for a confirmation link, then sign in.`
    }
  } catch (e) {
    error.value = e instanceof Error ? friendly(e.message) : 'Something went wrong. Try again.'
  } finally {
    busy.value = false
  }
}

async function google() {
  error.value = ''
  try {
    await signInWithGoogle()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not start Google sign-in.'
  }
}

const user = useUser()
watch(user, (u) => {
  if (u) navigateTo(redirectTo.value)
})

onMounted(async () => {
  await ensureAuthReady()
  if (useUser().value) navigateTo(redirectTo.value)
})
</script>

<style scoped>
.hero {
  max-width: 30rem;
  margin: 0 auto 1.5rem;
  text-align: center;
}

.hero h1 {
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  margin: 0.5rem 0 0;
}

.hero__lede {
  color: var(--muted-foreground);
}

.panel {
  max-width: 26rem;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tabs {
  display: flex;
  gap: 0.25rem;
  background: var(--secondary);
  border-radius: var(--radius);
  padding: 0.25rem;
}

.tabs__item {
  flex: 1;
  border: 0;
  background: transparent;
  border-radius: calc(var(--radius) - 0.15rem);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--muted-foreground);
}

.tabs__item--active {
  background: var(--card);
  color: var(--foreground);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field__label {
  font-size: 0.8125rem;
  font-weight: 500;
}

.input {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--background);
  color: var(--foreground);
  font: inherit;
  padding: 0.5rem 0.75rem;
}

.input:focus {
  outline: 2px solid var(--forest);
  outline-offset: 1px;
}

.alert {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
}

.alert--error {
  color: var(--clay);
  font-weight: 500;
}

.or {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: var(--muted-foreground);
  font-size: 0.75rem;
}

.or::before,
.or::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.btn--google {
  width: 100%;
}
</style>