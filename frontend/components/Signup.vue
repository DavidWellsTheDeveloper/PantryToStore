<template>
    <div
        class="max-w-md p-8 my-10 bg-white border border-cyan-200 rounded-xl shadow-lg mx-auto">
        <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-r from-cyan-300 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-900">Create Account</h2>
            <p class="text-gray-600 mt-2">Join our community today</p>
        </div>
        
        <div class="space-y-4">
            <FormInput
                v-model="user.username"
                placeholder="Username"
                :disabled="loading"
                :error="errors.username"
            />
            
            <FormInput
                v-model="user.email"
                type="email"
                placeholder="Email"
                :disabled="loading"
                :error="errors.email"
            />
            
            <FormInput
                v-model="user.password"
                type="password"
                placeholder="Password"
                :disabled="loading"
                :error="errors.password"
            />
            
            <FormInput
                v-model="user.confirmPassword"
                type="password"
                placeholder="Confirm Password"
                :disabled="loading"
                :error="errors.confirmPassword"
            />
            
            <div v-if="authStore.error" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ authStore.error }}
            </div>
            
            <button @click.prevent="signup"
                class="w-full py-4 px-4 bg-cyan-700 text-white hover:bg-teal-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                :disabled="!isFormValid || loading">
                {{ loading ? 'Signing up...' : 'Sign Up' }}
            </button>
        </div>
        
        <div class="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p class="mb-3 text-sm font-medium text-gray-700">Password requirements:</p>
            <ul class="space-y-1 text-xs">
                <li class="flex items-center space-x-2">
                    <svg class="w-4 h-4" :class="passwordValidation.minLength ? 'text-green-500' : 'text-red-500'" fill="currentColor" viewBox="0 0 20 20">
                        <path v-if="passwordValidation.minLength" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    <span :class="passwordValidation.minLength ? 'text-green-700' : 'text-red-700'">At least 8 characters</span>
                </li>
                <li class="flex items-center space-x-2">
                    <svg class="w-4 h-4" :class="passwordValidation.hasCapital ? 'text-green-500' : 'text-red-500'" fill="currentColor" viewBox="0 0 20 20">
                        <path v-if="passwordValidation.hasCapital" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    <span :class="passwordValidation.hasCapital ? 'text-green-700' : 'text-red-700'">Contains a capital letter</span>
                </li>
                <li class="flex items-center space-x-2">
                    <svg class="w-4 h-4" :class="passwordValidation.hasNumberOrSymbol ? 'text-green-500' : 'text-red-500'" fill="currentColor" viewBox="0 0 20 20">
                        <path v-if="passwordValidation.hasNumberOrSymbol" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    <span :class="passwordValidation.hasNumberOrSymbol ? 'text-green-700' : 'text-red-700'">Contains a number or symbol</span>
                </li>
                <li class="flex items-center space-x-2">
                    <svg class="w-4 h-4" :class="passwordValidation.passwordsMatch ? 'text-green-500' : 'text-red-500'" fill="currentColor" viewBox="0 0 20 20">
                        <path v-if="passwordValidation.passwordsMatch" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    <span :class="passwordValidation.passwordsMatch ? 'text-green-700' : 'text-red-700'">Passwords match</span>
                </li>
            </ul>
        </div>
        
        <div class="text-center mt-6">
            <p class="text-gray-600">Already have an account? 
                <NuxtLink to="/login" class="text-cyan-600 hover:text-cyan-700 font-medium">Login</NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import FormInput from '~/components/FormInput.vue';

const authStore = useAuthStore();

const user = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
});

const errors = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
});

const loading = ref(false);

const passwordValidation = computed(() => {
    const password = user.value.password;
    const confirmPassword = user.value.confirmPassword;
    return {
        minLength: password.length >= 8,
        hasCapital: /[A-Z]/.test(password),
        hasNumberOrSymbol: /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        passwordsMatch: password !== '' && confirmPassword !== '' && password === confirmPassword
    };
});

const isFormValid = computed(() => {
    return user.value.username.trim() !== '' &&
           user.value.email.trim() !== '' &&
           passwordValidation.value.minLength &&
           passwordValidation.value.hasCapital &&
           passwordValidation.value.hasNumberOrSymbol &&
           user.value.password === user.value.confirmPassword &&
           !Object.values(errors.value).some(error => error !== '');
});

const validateForm = () => {
    // Reset errors
    errors.value = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    // Validate username
    if (!user.value.username.trim()) {
        errors.value.username = 'Username is required';
    }

    // Validate email
    if (!user.value.email.trim()) {
        errors.value.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(user.value.email)) {
        errors.value.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!user.value.password) {
        errors.value.password = 'Password is required';
    } else if (!passwordValidation.value.minLength) {
        errors.value.password = 'Password must be at least 8 characters long';
    } else if (!passwordValidation.value.hasCapital) {
        errors.value.password = 'Password must contain at least one capital letter';
    } else if (!passwordValidation.value.hasNumberOrSymbol) {
        errors.value.password = 'Password must contain at least one number or symbol';
    }

    // Validate confirm password
    if (!user.value.confirmPassword) {
        errors.value.confirmPassword = 'Please confirm your password';
    } else if (user.value.password !== user.value.confirmPassword) {
        errors.value.confirmPassword = 'Passwords do not match';
    }

    return Object.values(errors.value).every(error => error === '');
};

const signup = async () => {
    if (validateForm()) {
        loading.value = true;
        
        try {
            const success = await authStore.register(
                user.value.username,
                user.value.email,
                user.value.password
            );
            
            if (success) {
                // Redirect to home page or dashboard
                await navigateTo('/');
            } else {
                // API validation errors will be shown in the error display
                console.log("Registration failed:", authStore.error);
            }
        } catch (err) {
            console.error("Registration error:", err);
        } finally {
            loading.value = false;
        }
    } else {
        console.log("Form validation failed");
    }
};
</script>

<style scoped></style> 