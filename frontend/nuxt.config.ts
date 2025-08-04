// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  // Generate static files for production
  nitro: {
    preset: 'static'
  },
  runtimeConfig: {
    NUXT_API_SECRET: 'default_secret_to_override',
    public: {
      // Use relative URLs in production so API calls go through the same domain (ALB/CloudFront)
      // This way /api/* requests will be handled by Nginx and routed to Django
      // For static builds, we need to hardcode the production value
      apiBase: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000'
    }
  }
})
