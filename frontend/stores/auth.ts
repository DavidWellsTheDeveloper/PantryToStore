import { defineStore } from 'pinia';
import { apiService, type User, type ApiResponse } from '~/services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && state.user !== null,
    userName: (state) => state.user?.username || '',
    userEmail: (state) => state.user?.email || '',
    userId: (state) => state.user?.id || null,
  },

  actions: {
    async login(username: string, password: string): Promise<boolean> {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiService.login(username, password);
        
        if (response.error) {
          this.error = response.error;
          return false;
        }

        if (response.data?.user) {
          this.user = response.data.user;
          this.isAuthenticated = true;
          this.error = null;
          
          // Save to localStorage for persistence
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(this.user));
            localStorage.setItem('isAuthenticated', 'true');
          }
          
          return true;
        }

        this.error = 'Login failed - no user data received';
        return false;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Login failed';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(username: string, email: string, password: string): Promise<boolean> {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiService.register(username, email, password);
        
        if (response.error) {
          this.error = response.error;
          return false;
        }

        if (response.data?.user) {
          this.user = response.data.user;
          this.isAuthenticated = true;
          this.error = null;
          
          // Save to localStorage for persistence
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(this.user));
            localStorage.setItem('isAuthenticated', 'true');
          }
          
          return true;
        }

        this.error = 'Registration failed - no user data received';
        return false;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Registration failed';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout(): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        await apiService.logout();
      } catch (error) {
        console.error('Logout API call failed:', error);
        // Continue with logout even if API call fails
      }

      // Clear state
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;

      // Clear localStorage
      if (process.client) {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }

      this.loading = false;
    },

    async checkAuth(): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiService.getCurrentUser();
        
        if (response.error) {
          // User not authenticated or session expired
          this.clearAuth();
          return;
        }

        if (response.data?.user) {
          this.user = response.data.user;
          this.isAuthenticated = true;
          
          // Update localStorage
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(this.user));
            localStorage.setItem('isAuthenticated', 'true');
          }
        } else {
          this.clearAuth();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        this.clearAuth();
      } finally {
        this.loading = false;
      }
    },

    clearAuth(): void {
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;
      
      if (process.client) {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    },

    initializeAuth(): void {
      // Initialize from localStorage on client side
      if (process.client) {
        const storedUser = localStorage.getItem('user');
        const storedAuth = localStorage.getItem('isAuthenticated');
        
        if (storedUser && storedAuth === 'true') {
          try {
            this.user = JSON.parse(storedUser);
            this.isAuthenticated = true;
            
            // Verify authentication with server
            this.checkAuth();
          } catch (error) {
            console.error('Failed to parse stored user data:', error);
            this.clearAuth();
          }
        }
      }
    },

    clearError(): void {
      this.error = null;
    },

    setError(error: string): void {
      this.error = error;
    },
  },
}); 