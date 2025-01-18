<template>
    <div class="flex flex-col justify-between bg-gray-100 p-5 rounded-xl mx-5 mb-8">
        <div>
            <h2 class="text-3xl font-bold mb-6 whitespace-nowrap">
                <slot></slot>
            </h2>
            <p class="mb-4">{{ description }}</p>
        </div>
        <NuxtLink :to="address" class="inline-block py-4 px-8 bg-cyan-700 text-white hover:bg-teal-700 rounded-xl whitespace-nowrap">{{ linkText }}</NuxtLink>
    </div>
</template>

<!-- Desinged to be a attractive card with a heading, description and button for internal navigation -->
<script setup lang="ts">
    const props = defineProps({
        description: {
            type: String,
            default: ''
        },
        linkText: String,
        address: String
    })
</script>

<style scoped>

</style>