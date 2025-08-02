<template>
    <div class="text-center py-8">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
            {{ message }}
        </div>
        <div v-if="showRetry" class="mt-4">
            <button 
                @click="$emit('retry')"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
            >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {{ retryText }}
            </button>
        </div>
        <div v-if="showBackLink" class="mt-4">
            <slot name="back-link">
                <NuxtLink to="/browse" class="text-cyan-600 hover:text-cyan-800">← Back to Browse</NuxtLink>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    message: string;
    showRetry?: boolean;
    retryText?: string;
    showBackLink?: boolean;
}

withDefaults(defineProps<Props>(), {
    showRetry: false,
    retryText: 'Try Again',
    showBackLink: false
});

defineEmits<{
    retry: [];
}>();
</script>

<style scoped></style>