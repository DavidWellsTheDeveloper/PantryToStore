// Canonical link + JSON-LD helpers for indexed pages (PRD §9.3–9.4).
// All public pages pre-render with an absolute canonical pointing at the
// production domain; recipe pages additionally emit BreadcrumbList.

export function useSiteUrl(): string {
  const config = useRuntimeConfig()
  return (config.public.siteUrl || '').replace(/\/$/, '')
}

export function useCanonical(path?: MaybeRef<string | undefined>) {
  const route = useRoute()
  const site = useSiteUrl()
  const href = computed(() => {
    const p = unref(path) ?? route.path
    return `${site}${p.startsWith('/') ? p : `/${p}`}`
  })
  useHead(() => ({ link: [{ rel: 'canonical', href: href.value }] }))
}