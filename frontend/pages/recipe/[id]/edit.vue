<template>
    <div class="container mx-auto px-4 py-8">
        <LoadingState v-if="loading" message="Loading recipe..." />
        
        <ErrorState
            v-else-if="error"
            :message="error"
            :show-back-link="true"
        >
            <template #back-link>
                <NuxtLink :to="`/recipe/${recipeId}`" class="text-cyan-600 hover:text-cyan-800">← Back to Recipe</NuxtLink>
            </template>
        </ErrorState>

        <div v-else-if="recipe" class="max-w-4xl mx-auto">
            <PageHeader 
                title="Edit Recipe" 
                subtitle="Update your recipe details and ingredients"
                :centered="true"
            >
                <template #icon>
                    <svg class="w-6 h-6 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                </template>
            </PageHeader>

            <form @submit.prevent="handleSubmit" class="space-y-8">
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

                    <div class="grid grid-cols-1 gap-6">
                        <div>
                            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                                Recipe Title <span class="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                v-model="formData.title"
                                type="text"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200"
                                placeholder="Enter recipe title"
                                :class="{ 'border-red-500': formErrors.title }"
                            />
                            <p v-if="formErrors.title" class="mt-1 text-sm text-red-600">{{ formErrors.title }}</p>
                        </div>

                        <div>
                            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                v-model="formData.description"
                                rows="3"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200"
                                placeholder="Brief description of your recipe (optional)"
                            ></textarea>
                        </div>

                        <div class="flex items-center space-x-3">
                            <input
                                id="is_public"
                                v-model="formData.is_public"
                                type="checkbox"
                                class="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                            />
                            <label for="is_public" class="text-sm font-medium text-gray-700">
                                Make this recipe public
                            </label>
                            <div class="flex items-center space-x-2">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
                                      :class="formData.is_public ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'">
                                    <svg v-if="formData.is_public" class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                                    </svg>
                                    <svg v-else class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
                                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
                                    </svg>
                                    {{ formData.is_public ? 'Public' : 'Private' }}
                                </span>
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

                    <div class="space-y-4">
                        <div v-for="(ingredient, index) in formData.ingredients" :key="index" 
                             class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div class="flex-1">
                                <input
                                    v-model="ingredient.name"
                                    type="text"
                                    placeholder="Ingredient name"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                                    :class="{ 'border-red-500': formErrors.ingredients?.[index]?.name }"
                                />
                                <p v-if="formErrors.ingredients?.[index]?.name" class="mt-1 text-xs text-red-600">
                                    {{ formErrors.ingredients[index].name }}
                                </p>
                            </div>
                            <div class="w-24">
                                <input
                                    v-model.number="ingredient.quantity"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Qty"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                                    :class="{ 'border-red-500': formErrors.ingredients?.[index]?.quantity }"
                                />
                                <p v-if="formErrors.ingredients?.[index]?.quantity" class="mt-1 text-xs text-red-600">
                                    {{ formErrors.ingredients[index].quantity }}
                                </p>
                            </div>
                            <div class="w-24">
                                <select
                                    v-model="ingredient.unit"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                                    :class="{ 'border-red-500': formErrors.ingredients?.[index]?.unit }"
                                >
                                    <option value="">Unit</option>
                                    <option value="cup">cup</option>
                                    <option value="tbsp">tbsp</option>
                                    <option value="tsp">tsp</option>
                                    <option value="oz">oz</option>
                                    <option value="lb">lb</option>
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                    <option value="ml">ml</option>
                                    <option value="l">l</option>
                                    <option value="piece">piece</option>
                                    <option value="slice">slice</option>
                                    <option value="clove">clove</option>
                                    <option value="pinch">pinch</option>
                                </select>
                                <p v-if="formErrors.ingredients?.[index]?.unit" class="mt-1 text-xs text-red-600">
                                    {{ formErrors.ingredients[index].unit }}
                                </p>
                            </div>
                            <button
                                type="button"
                                @click="removeIngredient(index)"
                                class="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                            >
                                <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>

                        <div v-if="formData.ingredients.length === 0" class="text-center py-8">
                            <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            <p class="text-gray-500 mb-4">No ingredients added yet</p>
                            <button
                                type="button"
                                @click="addIngredient"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Add First Ingredient
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Instructions Section -->
                <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div class="flex items-center mb-6">
                        <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <h2 class="text-2xl font-semibold text-gray-900">Instructions</h2>
                    </div>

                    <div>
                        <label for="instructions" class="block text-sm font-medium text-gray-700 mb-2">
                            Cooking Instructions <span class="text-red-500">*</span>
                        </label>
                        <textarea
                            id="instructions"
                            v-model="formData.instructions"
                            rows="8"
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200"
                            placeholder="Enter step-by-step cooking instructions..."
                            :class="{ 'border-red-500': formErrors.instructions }"
                        ></textarea>
                        <p v-if="formErrors.instructions" class="mt-1 text-sm text-red-600">{{ formErrors.instructions }}</p>
                        <p class="mt-2 text-sm text-gray-500">
                            Provide detailed step-by-step instructions for preparing this recipe.
                        </p>
                    </div>
                </div>

                <!-- Submit Section -->
                <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div v-if="submitError" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {{ submitError }}
                    </div>

                    <div class="flex justify-between items-center">
                        <div class="flex items-center space-x-4">
                            <NuxtLink 
                                :to="`/recipe/${recipeId}`"
                                class="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                Cancel
                            </NuxtLink>
                            <span class="text-sm text-gray-500">
                                {{ isFormValid ? 'Ready to save changes' : 'Please fill in all required fields' }}
                            </span>
                        </div>
                        
                        <button
                            type="submit"
                            :disabled="!isFormValid || isSubmitting"
                            class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            {{ isSubmitting ? 'Saving Changes...' : 'Save Changes' }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { apiService, type Recipe, type Ingredient } from '~/services/api';
import { useAuthStore } from '~/stores/auth';
import PageHeader from '~/components/PageHeader.vue';
import LoadingState from '~/components/LoadingState.vue';
import ErrorState from '~/components/ErrorState.vue';

definePageMeta({
    middleware: 'auth',
    name: 'recipe-edit'
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const recipe = ref<Recipe | null>(null);
const loading = ref(true);
const error = ref('');
const isSubmitting = ref(false);
const submitError = ref('');

const recipeId = computed(() => {
    const id = route.params.id;
    return Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
});

const formData = ref({
    title: '',
    description: '',
    instructions: '',
    is_public: false,
    ingredients: [] as Ingredient[]
});

const formErrors = ref<{
    title?: string;
    instructions?: string;
    ingredients?: Array<{
        name?: string;
        quantity?: string;
        unit?: string;
    }>;
}>({});

const isFormValid = computed(() => {
    return formData.value.title.trim() !== '' &&
           formData.value.instructions.trim() !== '' &&
           formData.value.ingredients.length > 0 &&
           formData.value.ingredients.every(ingredient => 
               ingredient.name.trim() !== '' && 
               ingredient.quantity > 0 && 
               ingredient.unit.trim() !== ''
           );
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
            
            // Check if user is the owner
            if (!authStore.isAuthenticated || authStore.userId !== recipe.value.created_by.id) {
                error.value = 'You do not have permission to edit this recipe';
                return;
            }
            
            // Populate form with existing data
            formData.value = {
                title: recipe.value.title,
                description: recipe.value.description || '',
                instructions: recipe.value.instructions,
                is_public: recipe.value.is_public,
                ingredients: recipe.value.ingredients.map(ingredient => ({
                    name: ingredient.name,
                    quantity: ingredient.quantity,
                    unit: ingredient.unit
                }))
            };
            
            // Ensure at least one ingredient slot
            if (formData.value.ingredients.length === 0) {
                addIngredient();
            }
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

const addIngredient = () => {
    formData.value.ingredients.push({
        name: '',
        quantity: 0,
        unit: ''
    });
};

const removeIngredient = (index: number) => {
    formData.value.ingredients.splice(index, 1);
};

const validateForm = () => {
    formErrors.value = {};
    
    if (!formData.value.title.trim()) {
        formErrors.value.title = 'Recipe title is required';
    }
    
    if (!formData.value.instructions.trim()) {
        formErrors.value.instructions = 'Instructions are required';
    }
    
    // Validate ingredients
    formErrors.value.ingredients = [];
    formData.value.ingredients.forEach((ingredient, index) => {
        const ingredientErrors: any = {};
        
        if (!ingredient.name.trim()) {
            ingredientErrors.name = 'Ingredient name is required';
        }
        
        if (!ingredient.quantity || ingredient.quantity <= 0) {
            ingredientErrors.quantity = 'Quantity must be greater than 0';
        }
        
        if (!ingredient.unit.trim()) {
            ingredientErrors.unit = 'Unit is required';
        }
        
        if (Object.keys(ingredientErrors).length > 0) {
            formErrors.value.ingredients![index] = ingredientErrors;
        }
    });
    
    return Object.keys(formErrors.value).length === 0 || 
           (formErrors.value.ingredients && formErrors.value.ingredients.every(err => !err));
};

const handleSubmit = async () => {
    if (!validateForm()) {
        return;
    }
    
    isSubmitting.value = true;
    submitError.value = '';
    
    try {
        const response = await apiService.updateRecipe(recipeId.value, {
            title: formData.value.title.trim(),
            description: formData.value.description.trim(),
            instructions: formData.value.instructions.trim(),
            is_public: formData.value.is_public,
            ingredients: formData.value.ingredients.filter(ingredient => 
                ingredient.name.trim() !== '' && 
                ingredient.quantity > 0 && 
                ingredient.unit.trim() !== ''
            )
        });
        
        if (response.error) {
            submitError.value = response.error;
        } else {
            // Redirect to recipe detail page
            await router.push(`/recipe/${recipeId.value}`);
        }
    } catch (err) {
        submitError.value = 'Failed to update recipe. Please try again.';
        console.error('Error updating recipe:', err);
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(() => {
    loadRecipe();
});
</script>

<style scoped>
/* Additional styles if needed */
</style> 