<template>
    <div class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
        <p class="mt-2 text-gray-600">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
interface Props {
    message?: string;
}

withDefaults(defineProps<Props>(), {
    message: 'Loading...'
});
</script>

<style scoped></style>