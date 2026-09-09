import type { AsyncData, AsyncDataOptions, NuxtApp } from 'nuxt/app'

// Spoonacular API access from the app.
//
// Static-first rule (PRD §7.2–7.3): the client never talks to Spoonacular directly.
// During `nuxt generate` (server) we hit the same-origin /api/* proxy routes; at runtime
// on a static host the client uses NUXT_PUBLIC_API_BASE, which points at the deployed
// serverless proxy (e.g. https://api.pantrytostore.com).

export function apiUrl(path: string): string {
  const config = useRuntimeConfig()
  // Server-side (SSR/prerender) always same-origin — the internal Nitro server has the proxy.
  if (import.meta.server) return path
  const base = (config.public.apiBase as string) || ''
  return base ? `${base.replace(/\/$/, '')}${path}` : path
}

/**
 * useFetch with static-hydration semantics: when Nuxt already has server-rendered data in
 * the payload for this key (prerendered page), reuse it instead of refetching — the static
 * host has no /api routes, so a hydration refetch would 404.
 */
export function useSpoonacularFetch<T>(
  path: string,
  opts: AsyncDataOptions<T> = {},
): AsyncData<T, Error> {
  const res = useFetch<T>(apiUrl(path), {
    ...opts,
    getCachedData: (key: string, nuxtApp: NuxtApp) => nuxtApp.payload.data[key] as T | undefined,
  } as any)
  return res as AsyncData<T, Error>
}

/** Imperative client call for interactions (load-more, search later). */
export function spoonacularFetch<T>(path: string): Promise<T> {
  return $fetch<T>(apiUrl(path)) as Promise<T>
}