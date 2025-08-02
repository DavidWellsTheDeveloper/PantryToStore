<template>
    <component 
        :is="to ? 'NuxtLink' : 'button'"
        :to="to"
        :type="to ? undefined : type"
        :disabled="disabled"
        :class="buttonClasses"
        @click="!to && $emit('click')"
    >
        <slot name="icon">
            <svg v-if="showDefaultIcon" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
        </slot>
        <slot></slot>
    </component>
</template>

<script setup lang="ts">
interface Props {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    to?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    showDefaultIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    showDefaultIcon: false
});

defineEmits<{
    click: [];
}>();

const buttonClasses = computed(() => {
    const baseClasses = 'inline-flex items-center border font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-lg';
    
    // Size classes
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-lg'
    };
    
    // Variant classes
    const variantClasses = {
        primary: 'border-transparent text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700',
        secondary: 'border-transparent text-white bg-gray-600 hover:bg-gray-700',
        outline: 'border-cyan-300 text-cyan-700 bg-white hover:bg-cyan-50'
    };
    
    const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : '';
    
    return `${baseClasses} ${sizeClasses[props.size]} ${variantClasses[props.variant]} ${disabledClasses}`.trim();
});
</script>

<style scoped></style>