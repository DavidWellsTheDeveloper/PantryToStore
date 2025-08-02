<template>
    <div
        class="max-w-md p-8 my-10 bg-white border border-cyan-200 rounded-xl shadow-lg mx-auto">
        <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-r from-cyan-300 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p class="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ error }}
        </div>
        
        <form @submit.prevent="login" class="space-y-4">
            <FormInput
                v-model="user.username"
                placeholder="Username"
                :required="true"
                :disabled="loading"
            />
            <FormInput
                v-model="user.password"
                type="password"
                placeholder="Password"
                :required="true"
                :disabled="loading"
            />
            <button type="submit"
                class="w-full py-4 px-4 bg-cyan-700 text-white hover:bg-teal-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                :disabled="loading">
                {{ loading ? 'Logging in...' : 'Login' }}
            </button>
        </form>
        
        <div class="text-center">
            <p class="text-gray-600">Don't have an account? 
                <NuxtLink to="/signup" class="text-cyan-600 hover:text-cyan-700 font-medium">Sign up</NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import FormInput from '~/components/FormInput.vue';

const authStore = useAuthStore();

const user = ref({
    username: '',
    password: ''
});

const loading = ref(false);
const error = ref('');

const login = async () => {
    if (!user.value.username || !user.value.password) {
        error.value = 'Please enter both username and password';
        return;
    }

    loading.value = true;
    error.value = '';

    try {
        const success = await authStore.login(user.value.username, user.value.password);
        
        if (success) {
            // Redirect to home page or dashboard
            await navigateTo('/');
        } else {
            error.value = authStore.error || 'Login failed';
        }
    } catch (err) {
        error.value = 'Login failed. Please try again.';
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped></style>