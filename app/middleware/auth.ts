import { ensureAuthReady, useUser } from '../composables/useAuth'

// Client-side route guard (PRD §6.5): no session → /login with ?redirect= back.
// Server/generate path renders the page shell untouched (pages using this guard are
// noindex + client-rendered, so that shell is empty and never indexed).

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return
  await ensureAuthReady()
  const user = useUser().value
  if (!user) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})