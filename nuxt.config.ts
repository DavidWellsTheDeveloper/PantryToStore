// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/sitemap', '@nuxtjs/robots'],

  // Canonical origin for sitemap/robots/SEO (PRD §9.4). Pantry to Store currently
  // owns pantrytostore.com in Route 53; M5 wires the DNS/CloudFront.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://pantrytostore.com',
  },
  robots: {
    disallow: ['/login', '/favorites', '/account'],
  },
  sitemap: {
    exclude: ['/login', '/favorites', '/account'],
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      // titleTemplate lives at runtime (layout) so it type-checks as a function.
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#FCF9F2' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Instrument+Sans:wght@400;500;600&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      // Static host runtime calls go to the serverless Spoonacular proxy (PRD §7.2).
      // Empty = same-origin (dev/preview, where the Nitro proxy runs).
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      // AdSense (empty until approved — §6.7 / §9.4 of the PRD)
      adsensePublisher: process.env.NUXT_PUBLIC_ADSENSE_PUBLISHER_ID || '',
      adsenseSlot: process.env.NUXT_PUBLIC_ADSENSE_SLOT || '',
      // Supabase (client-safe publishable keys — §7.5)
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabasePublishableKey: process.env.NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
    },
  },

  // SSR for SEO; all public pages get statically pre-rendered via `nuxt generate`.
  ssr: true,

  // Crawl links (recipe cards → /recipe/:id) so the category sections seed real recipe
  // pages into the static output (PRD §6.1 + §6.3 prerendering strategy).
  nitro: {
    prerender: { crawlLinks: true },
  },
})