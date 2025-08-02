<template>
    <div>
        <nav class="p-6 flex items-center justify-between bg-teal-800">
            <NuxtLink to="/" class="text-xl text-white">Pantry to Store</NuxtLink>
            <div class="flex items-center space-x-2">
                <NuxtLink to="/" class="px-3 py-2 text-white hover:text-teal-300 hover:bg-teal-700 rounded-lg transition-all duration-200 font-medium">Home</NuxtLink>
                <NuxtLink to="/browse" class="px-3 py-2 text-white hover:text-teal-300 hover:bg-teal-700 rounded-lg transition-all duration-200 font-medium">Browse Recipes</NuxtLink>
                <NuxtLink v-if="authStore.isAuthenticated" to="/my-recipes" class="px-3 py-2 text-white hover:text-teal-300 hover:bg-teal-700 rounded-lg transition-all duration-200 font-medium">My Recipes</NuxtLink>
                <NuxtLink v-if="authStore.isAuthenticated" to="/add" class="px-3 py-2 text-white hover:text-teal-300 hover:bg-teal-700 rounded-lg transition-all duration-200 font-medium">Add Recipe</NuxtLink>
            </div>
        </nav>

        <slot />

        <footer class="p-6 flex flex-wrap items-center justify-between bg-gray-900">
            <p class="text-gray-300 copyright">Copyright &copy; {{ year }}</p>
            <div class="flex mt-6: mt-0 items-center space-x-4">
                <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
                    <span class="text-white">Hello, {{ authStore.userName }}</span>
                    <button @click="logout" class="py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl">Logout</button>
                </div>
                <div v-else class="flex items-center space-x-4">
                    <NuxtLink to="/login" class="py-4 px-6 bg-teal-900 hover:bg-teal-700 text-white rounded-xl">Login</NuxtLink>
                    <NuxtLink to="/signup" class="py-4 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-xl">Sign Up</NuxtLink>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const year = computed(() => {
    return new Date().getFullYear()
})

const logout = async () => {
    await authStore.logout()
    await navigateTo('/login')
}

</script>

<style scoped></style>