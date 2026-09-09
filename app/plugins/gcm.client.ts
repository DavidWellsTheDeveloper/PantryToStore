import { initConsentMode } from '../composables/useConsent'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return
  initConsentMode()
})