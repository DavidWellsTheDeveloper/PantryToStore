<template>
    <div>
        <h2 class="text-4xl text-center font-semibold mt-5 mb-10">
            <slot></slot>
        </h2>
        <div id="feature-highlight__main-content" :class="horizontalSwap ? 'flex-row-reverse': ''" class="flex justify-between p-10 gap-x-5">
            <p>{{ description }}</p>
            <img :src="img" :alt="alt">
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        description: {
            type: String,
            default: ''
        },
        img: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            default: ''
        },
        horizontalSwap: {
            type: Boolean,
            default: false
        }
    })
</script>

<style scoped>

</style>