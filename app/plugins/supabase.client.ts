import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'

// Client-side Supabase (PRD §6.5). Client-only plugin: it never runs during SSR or
// `nuxt generate`, so the static build has no auth machinery and no network calls.
// Exposes app.$supabaseClient + app.$supabaseReady; the user state lives in a shared
// useState so every component (header, favorites, account) sees session changes.

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.public.supabasePublishableKey as string
  if (!url || !key) return

  const client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  const user = useState<User | null>('supabase-user', () => null)
  let resolveReady!: () => void
  const ready = new Promise<void>((r) => (resolveReady = r))

  client.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })

  client.auth.getSession().then(({ data }) => {
    user.value = data.session?.user ?? null
    resolveReady()
  }).catch(() => resolveReady())

  nuxtApp.provide('supabaseClient', client as SupabaseClient)
  nuxtApp.provide('supabaseReady', ready)
})