<template>
    <div>
        <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-2">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>
        <input
            :id="inputId"
            :value="modelValue"
            :type="type"
            :placeholder="placeholder"
            :required="required"
            :disabled="disabled"
            :class="inputClasses"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
        <div v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    modelValue: string;
    type?: string;
    placeholder?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    id?: string;
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    required: false,
    disabled: false
});

defineEmits<{
    'update:modelValue': [value: string];
}>();

const inputId = computed(() => {
    return props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
});

const inputClasses = computed(() => {
    const baseClasses = 'w-full py-4 px-4 bg-cyan-100 hover:bg-teal-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors duration-200';
    const errorClasses = props.error ? 'border-2 border-red-500' : '';
    const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : '';
    
    return `${baseClasses} ${errorClasses} ${disabledClasses}`.trim();
});
</script>

<style scoped></style>