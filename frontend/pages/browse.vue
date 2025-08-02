<template>
    <div class="container mx-auto px-4 py-8">
        <PageHeader 
            title="Browse Recipes" 
            subtitle="Discover delicious recipes from our community"
        >
            <template #icon>
                <svg class="w-6 h-6 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
            </template>
            <template #actions>
                <CTAButton 
                    v-if="authStore.isAuthenticated" 
                    to="/add" 
                    :show-default-icon="true"
                >
                    Add Recipe
                </CTAButton>
            </template>
        </PageHeader>

        <LoadingState v-if="loading" message="Loading recipes..." />
        
        <ErrorState v-else-if="error" :message="error" />

        <div v-else-if="recipes.length === 0" class="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
            <div class="text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
                <p class="text-gray-600 mb-6">Get started by creating your first recipe and sharing it with the community.</p>
                <div v-if="authStore.isAuthenticated">
                    <NuxtLink 
                        to="/add" 
                        class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-lg"
                    >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Create Your First Recipe
                    </NuxtLink>
                </div>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecipeCard 
                v-for="recipe in recipes" 
                :key="recipe.id" 
                :recipe="recipe"
                :show-actions="false"
                @delete="handleDeleteRecipe"
            />
        </div>

        <div v-if="recipes.length > 0" class="mt-8">
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div class="text-center">
                    <div class="flex items-center justify-center space-x-2 text-gray-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        <span class="font-medium">
                            Showing {{ recipes.length }} recipe{{ recipes.length === 1 ? '' : 's' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService, type RecipeList } from '~/services/api';
import { useAuthStore } from '~/stores/auth';
import RecipeCard from '~/components/RecipeCard.vue';
import PageHeader from '~/components/PageHeader.vue';
import LoadingState from '~/components/LoadingState.vue';
import ErrorState from '~/components/ErrorState.vue';
import CTAButton from '~/components/CTAButton.vue';

const authStore = useAuthStore();

const recipes = ref<RecipeList[]>([]);
const loading = ref(true);
const error = ref('');

const loadRecipes = async () => {
    loading.value = true;
    error.value = '';
    
    try {
        const response = await apiService.getRecipes();
        
        if (response.error) {
            error.value = response.error;
        } else {
            recipes.value = response.data || [];
        }
    } catch (err) {
        error.value = 'Failed to load recipes. Please try again.';
        console.error('Error loading recipes:', err);
    } finally {
        loading.value = false;
    }
};

const handleDeleteRecipe = async (recipeId: number) => {
    if (!confirm('Are you sure you want to delete this recipe?')) {
        return;
    }
    
    try {
        const response = await apiService.deleteRecipe(recipeId);
        
        if (response.error) {
            alert('Failed to delete recipe: ' + response.error);
        } else {
            // Remove recipe from list
            recipes.value = recipes.value.filter(recipe => recipe.id !== recipeId);
        }
    } catch (err) {
        alert('Failed to delete recipe. Please try again.');
        console.error('Error deleting recipe:', err);
    }
};

onMounted(() => {
    loadRecipes();
});
</script>

<style scoped>

</style>