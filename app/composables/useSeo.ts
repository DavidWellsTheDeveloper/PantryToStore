// Canonical link + JSON-LD helpers for indexed pages (PRD §9.3–9.4).
// All public pages pre-render with an absolute canonical pointing at the
// production domain; recipe pages additionally emit BreadcrumbList.

export function useSiteUrl(): string {
  const config = useRuntimeConfig()
  return (config.public.siteUrl || '').replace(/\/$/, '')
}

// Production host (S3 static site behind CloudFront) 301s subpaths to a trailing
// slash, so canonical/JSON-LD URLs must match the served URL to avoid
// "page with redirect" in Search Console (PRD §9.3–9.4). Root stays as-is.
export function canonicalPath(path: string): string {
  const withLeading = path.startsWith('/') ? path : `/${path}`
  return withLeading === '/' ? '/' : `${withLeading.replace(/\/+$/, '')}/`
}

export function useCanonical(path?: MaybeRef<string | undefined>) {
  const route = useRoute()
  const site = useSiteUrl()
  const href = computed(() => `${site}${canonicalPath(unref(path) ?? route.path)}`)
  useHead(() => ({ link: [{ rel: 'canonical', href: href.value }] }))
}