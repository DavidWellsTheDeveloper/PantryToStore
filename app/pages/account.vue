<template>
  <div class="container narrow">
    <section class="head">
      <p class="eyebrow">Account</p>
      <h1>Your details</h1>
    </section>

    <div class="card row">
      <div class="col">
        <p class="label">Signed in as</p>
        <p class="value">{{ user?.email }}</p>
        <p class="label">Member since</p>
        <p class="value">{{ memberSince }}</p>
      </div>
      <div class="col">
        <p class="label">Plan</p>
        <p class="value">{{ isPro ? 'Pro' : 'Free' }}</p>
        <p v-if="!isPro" class="note">Free tier saves up to 10 favorite recipes.</p>
      </div>
    </div>

    <div class="actions">
      <button type="button" class="btn btn--primary" :disabled="busy" @click="signOut">
        {{ busy ? 'Signing out…' : 'Sign out' }}
      </button>
    </div>

    <section class="card danger">
      <h2>Delete account</h2>
      <p>
        Deleting your account removes your favorites. To delete your account, email
        <a :href="deleteMailto">support</a> from your account address — it's processed securely
        in a few days.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { signOutUser, useUser } from '../composables/useAuth'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Account',
  robots: 'noindex, nofollow',
})

const user = useUser()
const busy = ref(false)

const isPro = ref(false)
const memberSince = computed(() =>
  user.value?.created_at ? new Date(user.value.created_at).toLocaleDateString() : '—',
)

const deleteMailto = computed(
  () =>
    `mailto:${'support@pantrytostore.com'}?subject=${encodeURIComponent('Account deletion request')}&body=${encodeURIComponent(`Please delete my account: ${user.value?.email ?? ''}`)}`,
)

async function signOut() {
  busy.value = true
  try {
    await signOutUser()
    await navigateTo('/')
  } finally {
    busy.value = false
  }
}

onMounted(async () => {
  const supabase = useSupabase()
  if (!user.value || !supabase) return
  const { data } = await supabase.from('profiles').select('is_pro').eq('id', user.value.id).maybeSingle()
  isPro.value = data?.is_pro ?? false
})
</script>

<style scoped>
.narrow {
  max-width: 40rem;
}

.head {
  margin-bottom: 1.25rem;
}

.head h1 {
  margin: 0.25rem 0 0;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
}

.card {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
}

.card .col {
  flex: 1 1 15rem;
}

.label {
  margin: 0 0 0.125rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.value {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.note {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
}

.actions {
  margin-bottom: 2rem;
}

.danger {
  border-color: color-mix(in srgb, var(--clay), transparent 60%);
}

.danger h2 {
  font-size: 1.25rem;
  margin-top: 0;
}

.danger p {
  color: var(--muted-foreground);
  font-size: 0.9375rem;
}

.danger a {
  text-decoration: underline;
}
</style>