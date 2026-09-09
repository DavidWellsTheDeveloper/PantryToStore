import type { SupabaseClient, User } from '@supabase/supabase-js'

// Client-side auth composables (PRD §6.5). Server/SSR returns nothing meaningful:
// there is no auth state during `nuxt generate` and all pages relying on it are
// noindex + client-rendered.

export function useSupabase(): SupabaseClient | null {
  const app = useNuxtApp()
  return (app.$supabaseClient as SupabaseClient | undefined) ?? null
}

export function useUser(): Ref<User | null> {
  return useState<User | null>('supabase-user', () => null)
}

/** Resolves once the initial session has been read (client only). */
export async function ensureAuthReady(): Promise<void> {
  if (import.meta.server) return
  const app = useNuxtApp()
  if (app.$supabaseReady) await (app.$supabaseReady as Promise<void>)
}

async function withClient<T>(fn: (client: SupabaseClient) => Promise<T>): Promise<T> {
  const client = useSupabase()
  if (!client) throw new Error('Supabase is not configured (NUXT_PUBLIC_SUPABASE_URL/KEY)')
  return fn(client)
}

export function signInWithEmail(email: string, password: string) {
  return withClient((c) => c.auth.signInWithPassword({ email, password }))
}

export function signUpWithEmail(email: string, password: string) {
  return withClient((c) => c.auth.signUp({ email, password }))
}

export function signInWithGoogle() {
  return withClient((c) =>
    c.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    }),
  )
}

export function signOutUser() {
  return withClient((c) => c.auth.signOut())
}

export function resetPassword(email: string) {
  return withClient((c) =>
    c.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }),
  )
}