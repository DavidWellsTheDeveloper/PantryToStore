export default defineNuxtPlugin(async () => {
  // Import and use the store within the plugin function to ensure Pinia is initialized
  const { useAuthStore } = await import('~/stores/auth');
  const authStore = useAuthStore();
  
  // Initialize auth state from localStorage
  authStore.initializeAuth();
}); 