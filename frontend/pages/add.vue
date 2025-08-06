<template>
    <div class="container mx-auto px-4 py-8">
        <PageHeader 
            title="Add New Recipe" 
            subtitle="Share your culinary creation with the community"
            :centered="true"
            icon-size="large"
        >
            <template #icon>
                <svg class="w-8 h-8 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
            </template>
        </PageHeader>

        <!-- Form Section -->
        <div class="max-w-4xl mx-auto">
            <form @submit.prevent="submitRecipe" class="space-y-8">
                <!-- Basic Information -->
                <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div class="flex items-center mb-6">
                        <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h2 class="text-2xl font-semibold text-gray-900">Basic Information</h2>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Recipe Title *</label>
                            <input
                                v-model="recipe.title"
                                type="text"
                                id="title"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                :class="{ 'border-red-500': errors.title }"
                                placeholder="Enter your recipe title"
                            >
                            <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
                        </div>
                        
                        <div class="md:col-span-2">
                            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                v-model="recipe.description"
                                id="description"
                                rows="3"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                placeholder="Brief description of your recipe"
                            ></textarea>
                        </div>
                        
                        <div class="flex items-center space-x-3">
                            <div class="flex items-center">
                                <input
                                    v-model="recipe.is_public"
                                    type="checkbox"
                                    id="is_public"
                                    class="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                                >
                                <label for="is_public" class="ml-2 text-sm font-medium text-gray-700">Make this recipe public</label>
                            </div>
                            <div class="flex items-center text-xs text-gray-500">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>{{ recipe.is_public ? 'Visible to everyone' : 'Only visible to you' }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ingredients Section -->
                <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                                <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                </svg>
                            </div>
                            <h2 class="text-2xl font-semibold text-gray-900">Ingredients</h2>
                        </div>
                        <button
                            type="button"
                            @click="addIngredient"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                        >
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Add Ingredient
                        </button>
                    </div>
                    
                    <div v-if="recipe.ingredients.length === 0" class="text-center py-8">
                        <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <p class="text-gray-500">No ingredients added yet</p>
                        <p class="text-gray-400 text-sm">Click "Add Ingredient" to get started</p>
                    </div>
                    
                    <div v-else class="space-y-4">
                        <div
                            v-for="(ingredient, index) in recipe.ingredients"
                            :key="index"
                            class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                        >
                            <div class="flex-1">
                                <input
                                    v-model="ingredient.name"
                                    type="text"
                                    placeholder="Ingredient name"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                >
                            </div>
                            <div v-if="ingredient.unit !== 'toTaste'" class="w-24">
                                <input
                                    v-model.number="ingredient.quantity"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Amount"
                                    :required="ingredient.unit !== 'toTaste'"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                >
                            </div>
                            <div class="w-24">
                                <select
                                    v-model="ingredient.unit"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                >
                                    <option value="">Unit</option>
                                    <option value="cup">Cup</option>
                                    <option value="tbsp">Tbsp</option>
                                    <option value="tsp">Tsp</option>
                                    <option value="oz">Oz</option>
                                    <option value="lb">Lb</option>
                                    <option value="g">Gram</option>
                                    <option value="kg">Kg</option>
                                    <option value="ml">mL</option>
                                    <option value="l">Liter</option>
                                    <option value="piece">Piece</option>
                                    <option value="slice">Slice</option>
                                    <option value="clove">Clove</option>
                                    <option value="pinch">Pinch</option>
                                    <option value="whole">Whole</option>
                                    <option value="toTaste">To Taste</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                @click="removeIngredient(index)"
                                class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Instructions Section -->
                <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div class="flex items-center mb-6">
                        <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <h2 class="text-2xl font-semibold text-gray-900">Instructions</h2>
                    </div>
                    
                    <div>
                        <label for="instructions" class="block text-sm font-medium text-gray-700 mb-2">Cooking Instructions *</label>
                        <textarea
                            v-model="recipe.instructions"
                            id="instructions"
                            rows="8"
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.instructions }"
                            placeholder="Step-by-step instructions for your recipe..."
                        ></textarea>
                        <p v-if="errors.instructions" class="text-red-500 text-sm mt-1">{{ errors.instructions }}</p>
                        <p class="text-gray-500 text-sm mt-2">Be detailed and clear. Include cooking times, temperatures, and any special techniques.</p>
                    </div>
                </div>

                <!-- Error Display -->
                <div v-if="submitError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {{ submitError }}
                </div>

                <!-- Submit Section -->
                <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div class="flex justify-between items-center">
                        <div class="text-sm text-gray-600">
                            <p>* Required fields</p>
                            <p class="mt-1">Your recipe will be {{ recipe.is_public ? 'public and visible to everyone' : 'private and only visible to you' }}</p>
                        </div>
                        <div class="flex space-x-4">
                            <NuxtLink
                                to="/browse"
                                class="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
                            >
                                Cancel
                            </NuxtLink>
                            <button
                                type="submit"
                                :disabled="loading || !isFormValid"
                                class="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                {{ loading ? 'Saving Recipe...' : 'Save Recipe' }}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { apiService, type Recipe, type Ingredient } from '~/services/api';
import PageHeader from '~/components/PageHeader.vue';

// Page metadata
definePageMeta({
    middleware: 'auth'
});

// Form data
const recipe = ref({
    title: '',
    description: '',
    instructions: '',
    is_public: false,
    ingredients: [] as Ingredient[]
});

// Form state
const loading = ref(false);
const submitError = ref('');
const errors = ref({
    title: '',
    instructions: ''
});

// Computed properties
const isFormValid = computed(() => {
    return recipe.value.title.trim() !== '' &&
           recipe.value.instructions.trim() !== '' &&
           recipe.value.ingredients.length > 0 &&
           recipe.value.ingredients.every(ing => 
               ing.name.trim() !== '' && 
               ing.unit !== '' && 
               (ing.unit === 'toTaste' || ing.quantity > 0)
           );
});

// Methods
const addIngredient = () => {
    recipe.value.ingredients.push({
        name: '',
        quantity: 0,
        unit: ''
    });
};

const removeIngredient = (index: number) => {
    recipe.value.ingredients.splice(index, 1);
};

const validateForm = () => {
    errors.value = {
        title: '',
        instructions: ''
    };

    if (!recipe.value.title.trim()) {
        errors.value.title = 'Recipe title is required';
    }

    if (!recipe.value.instructions.trim()) {
        errors.value.instructions = 'Instructions are required';
    }

    return !Object.values(errors.value).some(error => error !== '');
};

const submitRecipe = async () => {
    if (!validateForm()) {
        return;
    }

    if (!isFormValid.value) {
        submitError.value = 'Please fill in all required fields and add at least one ingredient';
        return;
    }

    loading.value = true;
    submitError.value = '';

    try {
        const response = await apiService.createRecipe(recipe.value);

        if (response.error) {
            submitError.value = response.error;
        } else {
            // Success! Redirect to the new recipe
            const newRecipe = response.data;
            await navigateTo(`/recipe/${newRecipe?.id}`);
        }
    } catch (error) {
        submitError.value = 'Failed to save recipe. Please try again.';
        console.error('Error creating recipe:', error);
    } finally {
        loading.value = false;
    }
};

// Initialize with one ingredient
addIngredient();
</script>

<style scoped>
/* Custom styles for form elements */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}
</style>