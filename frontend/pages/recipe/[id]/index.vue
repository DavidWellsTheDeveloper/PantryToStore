<template>
    <div class="container mx-auto px-4 py-8">
        <LoadingState v-if="loading" message="Loading recipe..." />
        
        <ErrorState 
            v-else-if="error" 
            :message="error" 
            :show-back-link="true"
        />

        <div v-else-if="recipe" class="max-w-4xl mx-auto">
            <!-- Header Section -->
            <div class="bg-gradient-to-r from-cyan-300 to-teal-100 border border-cyan-200 rounded-xl shadow-lg p-8 mb-8">
                <div class="flex justify-between items-start mb-6">
                    <div class="flex-1">
                        <h1 class="text-4xl font-bold text-gray-900 mb-3 leading-tight">{{ recipe.title }}</h1>
                        <div class="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                            <div class="flex items-center space-x-2">
                                <div class="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                                    <span class="text-white font-medium text-xs">{{ recipe.created_by.username.charAt(0).toUpperCase() }}</span>
                                </div>
                                <span class="font-medium">{{ recipe.created_by.username }}</span>
                            </div>
                            <span class="text-gray-400">•</span>
                            <span class="flex items-center space-x-1">
                                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>{{ formatDate(recipe.created_at) }}</span>
                            </span>
                            <span class="text-gray-400">•</span>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
                                  :class="recipe.is_public ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'">
                                <svg v-if="recipe.is_public" class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                                </svg>
                                <svg v-else class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
                                </svg>
                                {{ recipe.is_public ? 'Public Recipe' : 'Private Recipe' }}
                            </span>
                        </div>
                    </div>
                    
                    <div v-if="isOwner" class="flex space-x-3">
                        <NuxtLink 
                            :to="`/recipe/${recipe.id}/edit`"
                            class="inline-flex items-center px-4 py-2 border border-cyan-300 shadow-sm text-sm font-medium rounded-lg text-cyan-700 bg-white hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
                        >
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Edit Recipe
                        </NuxtLink>
                        <button 
                            @click="handleDelete"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>

                <div v-if="recipe.description" class="bg-white bg-opacity-60 rounded-lg p-4 border border-cyan-100">
                    <p class="text-gray-700 text-lg leading-relaxed italic">
                        "{{ recipe.description }}"
                    </p>
                </div>
            </div>

            <!-- Ingredients Section -->
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
                <div class="flex items-center mb-6">
                    <div class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                        <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-semibold text-gray-900">Ingredients</h2>
                </div>
                
                <div v-if="recipe.ingredients && recipe.ingredients.length > 0">
                    <div class="grid gap-3">
                        <div v-for="ingredient in recipe.ingredients" :key="ingredient.id || ingredient.name" 
                            class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                            <div class="flex items-center space-x-3">
                                <div class="w-2 h-2 bg-cyan-500 rounded-full"></div>
                                <span class="font-medium text-gray-900">{{ ingredient.name }}</span>
                            </div>
                            <span class="text-gray-600 font-medium bg-white px-3 py-1 rounded-full text-sm">
                                {{ ingredient.quantity }} {{ ingredient.unit }}
                            </span>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center py-8">
                    <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p class="text-gray-500 italic">No ingredients listed</p>
                </div>
            </div>

            <!-- Instructions Section -->
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
                <div class="flex items-center mb-6">
                    <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
                        <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-semibold text-gray-900">Instructions</h2>
                </div>
                
                <div class="prose max-w-none">
                    <div v-if="recipe.instructions" class="bg-gray-50 rounded-lg p-6 border border-gray-100">
                        <div class="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
                            {{ recipe.instructions }}
                        </div>
                    </div>
                    <div v-else class="text-center py-8">
                        <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p class="text-gray-500 italic">No instructions provided</p>
                    </div>
                </div>
            </div>

            <!-- Navigation -->
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div class="flex justify-between items-center">
                    <NuxtLink 
                        to="/browse" 
                        class="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
                    >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to Browse
                    </NuxtLink>
                    
                    <NuxtLink 
                        v-if="authStore.isAuthenticated" 
                        to="/add" 
                        class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-lg"
                    >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Add New Recipe
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { apiService, type Recipe } from '~/services/api';
import { useAuthStore } from '~/stores/auth';
import LoadingState from '~/components/LoadingState.vue';
import ErrorState from '~/components/ErrorState.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const recipe = ref<Recipe | null>(null);
const loading = ref(true);
const error = ref('');

const recipeId = computed(() => {
    const id = route.params.id;
    return Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
});

const isOwner = computed(() => {
    return authStore.isAuthenticated && 
           recipe.value && 
           authStore.userId === recipe.value.created_by.id;
});

const loadRecipe = async () => {
    if (!recipeId.value || isNaN(recipeId.value)) {
        error.value = 'Invalid recipe ID';
        loading.value = false;
        return;
    }

    loading.value = true;
    error.value = '';
    
    try {
        const response = await apiService.getRecipe(recipeId.value);
        
        if (response.error) {
            error.value = response.error;
        } else if (response.data) {
            recipe.value = response.data;
        } else {
            error.value = 'Recipe not found';
        }
    } catch (err) {
        error.value = 'Failed to load recipe. Please try again.';
        console.error('Error loading recipe:', err);
    } finally {
        loading.value = false;
    }
};

const handleDelete = async () => {
    if (!recipe.value) return;
    
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await apiService.deleteRecipe(recipe.value.id);
        
        if (response.error) {
            alert('Failed to delete recipe: ' + response.error);
        } else {
            // Redirect to browse page after successful deletion
            await router.push('/browse');
        }
    } catch (err) {
        alert('Failed to delete recipe. Please try again.');
        console.error('Error deleting recipe:', err);
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

onMounted(() => {
    loadRecipe();
});

// Set page meta
definePageMeta({
    name: 'recipe-detail'
});
</script>

<style scoped>
.prose {
    max-width: none;
}
</style> 