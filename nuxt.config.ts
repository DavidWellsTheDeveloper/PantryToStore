// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: (title) => (title ? `${title} · Pantry to Store` : 'Pantry to Store — Cook smart, eat well, waste less'),
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
      // AdSense (empty until approved — §6.7 / §9.4 of the PRD)
      adsensePublisher: process.env.NUXT_PUBLIC_ADSENSE_PUBLISHER_ID || '',
      adsenseSlot: process.env.NUXT_PUBLIC_ADSENSE_SLOT || '',
    },
  },

  // SSR for SEO; all public pages get statically pre-rendered via `nuxt generate`.
  ssr: true,
})