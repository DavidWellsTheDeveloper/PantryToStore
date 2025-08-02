<template>
    <div class="bg-gradient-to-r from-cyan-300 to-teal-100 border border-cyan-200 rounded-xl shadow-lg p-8 mb-8">
        <div :class="layoutClass">
            <div class="flex items-center space-x-4">
                <div :class="iconContainerClass">
                    <slot name="icon">
                        <svg class="w-6 h-6 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                    </slot>
                </div>
                <div>
                    <h1 class="text-4xl font-bold text-gray-900" :class="{ 'mb-2': subtitle }">{{ title }}</h1>
                    <p v-if="subtitle" class="text-gray-700 mt-1">{{ subtitle }}</p>
                </div>
            </div>
            <div v-if="$slots.actions" class="flex items-center space-x-4">
                <slot name="actions"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title: string;
    subtitle?: string;
    centered?: boolean;
    iconSize?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
    centered: false,
    iconSize: 'medium'
});

const layoutClass = computed(() => {
    return props.centered 
        ? 'flex items-center justify-center' 
        : 'flex justify-between items-center';
});

const iconContainerClass = computed(() => {
    const baseClasses = 'bg-white bg-opacity-60 flex items-center justify-center';
    
    switch (props.iconSize) {
        case 'small':
            return `${baseClasses} w-10 h-10 rounded-lg`;
        case 'large':
            return `${baseClasses} w-16 h-16 rounded-full mx-auto mb-4`;
        default: // medium
            return `${baseClasses} w-12 h-12 rounded-lg`;
    }
});
</script>

<style scoped></style>