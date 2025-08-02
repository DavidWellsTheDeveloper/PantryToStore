<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
    <div class="p-6">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ recipe.title }}</h3>
        <span v-if="recipe.is_public" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Public
        </span>
        <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Private
        </span>
      </div>
      
      <p class="text-gray-600 mb-4 line-clamp-3">{{ recipe.description || 'No description available' }}</p>
      
      <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>By {{ recipe.created_by.username }}</span>
        <span>{{ formatDate(recipe.created_at) }}</span>
      </div>
      
      <div class="flex justify-between items-center">
        <NuxtLink 
          :to="`/recipe/${recipe.id}`"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
        >
          View Recipe
        </NuxtLink>
        
        <div v-if="showActions && isOwner" class="flex space-x-2">
          <NuxtLink 
            :to="`/recipe/${recipe.id}/edit`"
            class="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
          >
            Edit
          </NuxtLink>
          <button 
            @click="$emit('delete', recipe.id)"
            class="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecipeList } from '~/services/api';
import { useAuthStore } from '~/stores/auth';

interface Props {
  recipe: RecipeList;
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: false
});

defineEmits<{
  delete: [id: number]
}>();

const authStore = useAuthStore();

const isOwner = computed(() => {
  return authStore.isAuthenticated && authStore.userId === props.recipe.created_by.id;
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 