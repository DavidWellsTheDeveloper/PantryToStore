interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  instructions: string;
  is_public: boolean;
  created_by: User;
  created_at: string;
  ingredients: Ingredient[];
}

interface Ingredient {
  id?: number;
  name: string;
  unit: string;
  quantity: number;
}

interface RecipeList {
  id: number;
  title: string;
  description: string;
  created_by: User;
  created_at: string;
  is_public: boolean;
}

class ApiService {
  private baseUrl: string;
  private csrfToken: string | null = null;

  constructor() {
    // We'll initialize baseUrl lazily to avoid calling useRuntimeConfig during module loading
    this.baseUrl = '';
  }

  private initializeBaseUrl(): void {
    if (!this.baseUrl) {
      const config = useRuntimeConfig();
      this.baseUrl = config.public.apiBase || 'http://localhost:8000';
    }
  }

  private async getCsrfToken(forceRefresh: boolean = false): Promise<string> {
    if (!this.csrfToken || forceRefresh) {
      try {
        // Initialize baseUrl lazily when first request is made
        this.initializeBaseUrl();
        const response = await fetch(`${this.baseUrl}/api/auth/csrf-token/`, {
          credentials: 'include',
        });
        const data = await response.json();
        this.csrfToken = data.csrfToken;
      } catch (error) {
        console.error('Failed to get CSRF token:', error);
        throw error;
      }
    }
    return this.csrfToken!; // Non-null assertion since we just set it above
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<ApiResponse<T>> {
    try {
      // Initialize baseUrl lazily when first request is made
      this.initializeBaseUrl();
      const url = `${this.baseUrl}/api${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add existing headers if they exist and are in object format
      if (options.headers && typeof options.headers === 'object' && !Array.isArray(options.headers)) {
        Object.assign(headers, options.headers as Record<string, string>);
      }

      // Add CSRF token for non-GET requests
      if (options.method && options.method !== 'GET') {
        const csrfToken = await this.getCsrfToken(retryCount > 0);
        if (csrfToken) {
          headers['X-CSRFToken'] = csrfToken;
        }
      }

      const defaultOptions: RequestInit = {
        credentials: 'include',
        headers,
      };

      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's a CSRF error and we haven't retried yet
        if (response.status === 403 && 
            data.detail && 
            data.detail.includes('CSRF') && 
            retryCount === 0) {
          console.log('CSRF token expired, retrying with fresh token...');
          // Clear the cached token and retry
          this.csrfToken = null;
          return this.makeRequest(endpoint, options, retryCount + 1);
        }

        return {
          error: data.error || data.message || data.detail || 'Request failed',
          data: data,
        };
      }

      return {
        data: data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication methods
  async login(username: string, password: string): Promise<ApiResponse<{ user: User }>> {
    return this.makeRequest<{ user: User }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: User }>> {
    return this.makeRequest<{ user: User }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async logout(): Promise<ApiResponse<{}>> {
    const result = await this.makeRequest<{}>('/auth/logout/', {
      method: 'POST',
    });
    // Clear CSRF token on logout
    this.csrfToken = null;
    return result;
  }

  // Method to clear cached CSRF token (useful for debugging)
  clearCsrfToken(): void {
    this.csrfToken = null;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.makeRequest<{ user: User }>('/auth/user/');
  }

  // Recipe methods
  async getRecipes(): Promise<ApiResponse<Recipe[]>> {
    return this.makeRequest<Recipe[]>('/recipes/');
  }

  async getMyRecipes(): Promise<ApiResponse<Recipe[]>> {
    return this.makeRequest<Recipe[]>('/my-recipes/');
  }

  async getRecipe(id: number): Promise<ApiResponse<Recipe>> {
    return this.makeRequest<Recipe>(`/recipes/${id}/`);
  }

  async createRecipe(recipe: Omit<Recipe, 'id' | 'created_by' | 'created_at'>): Promise<ApiResponse<Recipe>> {
    return this.makeRequest<Recipe>('/recipes/', {
      method: 'POST',
      body: JSON.stringify(recipe),
    });
  }

  async updateRecipe(id: number, recipe: Partial<Recipe>): Promise<ApiResponse<Recipe>> {
    return this.makeRequest<Recipe>(`/recipes/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(recipe),
    });
  }

  async deleteRecipe(id: number): Promise<ApiResponse<{}>> {
    return this.makeRequest<{}>(`/recipes/${id}/`, {
      method: 'DELETE',
    });
  }

  // Grocery List methods
  async getGroceryLists(): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('/grocery-lists/');
  }

  async createGroceryList(groceryList: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/grocery-lists/', {
      method: 'POST',
      body: JSON.stringify(groceryList),
    });
  }

  async updateGroceryList(id: number, groceryList: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/grocery-lists/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(groceryList),
    });
  }

  async deleteGroceryList(id: number): Promise<ApiResponse<{}>> {
    return this.makeRequest<{}>(`/grocery-lists/${id}/`, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type { User, Recipe, Ingredient, RecipeList, ApiResponse }; 