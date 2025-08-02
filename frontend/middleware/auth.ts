export default defineNuxtRouteMiddleware(async (to, from) => {
  const { useAuthStore } = await import('~/stores/auth');
  const authStore = useAuthStore();

  // Initialize auth state if not already done
  if (process.client && !authStore.isAuthenticated) {
    authStore.initializeAuth();
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    // Redirect to login page
    return navigateTo('/login');
  }
}); 