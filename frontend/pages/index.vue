<template>
    <div>
        <!-- Hero Section -->
        <div class="bg-gradient-to-r from-cyan-300 to-teal-100 border-b border-cyan-200">
            <div class="container mx-auto px-6 py-16 text-center">
                <div class="max-w-4xl mx-auto">
                    <div class="w-20 h-20 bg-white bg-opacity-60 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg class="w-10 h-10 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <h1 class="text-5xl font-bold text-gray-900 mb-4">Pantry to Store</h1>
                    <p class="text-xl text-gray-700 mb-8">Your ultimate recipe management and grocery planning companion</p>
                    <div class="flex justify-center space-x-4">
                        <NuxtLink to="/browse" class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-lg">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                            Browse Recipes
                        </NuxtLink>
                        <NuxtLink to="/add" class="inline-flex items-center px-8 py-4 border border-cyan-300 text-lg font-medium rounded-lg text-cyan-700 bg-white hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-lg">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Add Recipe
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Links Section -->
        <div class="container mx-auto px-6 py-16">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
                <p class="text-xl text-gray-600">Organize your recipes, plan your meals, and manage your grocery lists</p>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <QuickLinkCard
                    description="View our library of recipes. When you find one you like, save it for easy access."
                    linkText="Search Recipes"
                    address="/browse"
                >
                    Browse Recipes
                </QuickLinkCard>
                <QuickLinkCard
                    description="Do you have your own recipe you'd like to use? Add it to your account and view it anywhere."
                    linkText="Add Recipe"
                    address="/add"
                >
                    Add Your Own
                </QuickLinkCard>
                <QuickLinkCard
                    description="Manage your grocery list. Add household necessities, or ingredients from your favorite recipes, and share lists with friends and family."
                    linkText="View Grocery List"
                    address="/grocery"
                >
                    Grocery List
                </QuickLinkCard>
            </div>
        </div>

        <!-- Feature Highlights -->
        <div class="bg-gray-50 py-16">
            <div class="space-y-16">
                <FeatureHighlight
                    img="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Recipe Organization"
                    :horizontalSwap="false"
                    description="Organize all your favorite recipes in one place. Create detailed recipe cards with ingredients, instructions, and cooking notes. Keep your culinary creations safe and accessible from anywhere."
                    primaryButtonText="Browse Recipes"
                    secondaryButtonText="Add Recipe"
                    primaryButtonLink="/browse"
                    secondaryButtonLink="/add"
                    badgeText="Popular"
                >
                    Recipe Organization Made Simple
                </FeatureHighlight>
                
                <FeatureHighlight
                    img="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
                    alt="Grocery Planning"
                    :horizontalSwap="true"
                    description="Transform your recipe ingredients into smart grocery lists. Never forget an ingredient again with our intelligent shopping list generator that organizes items by category and helps you plan your meals efficiently."
                    primaryButtonText="View Grocery Lists"
                    secondaryButtonText="Plan Meals"
                    primaryButtonLink="/grocery"
                    secondaryButtonLink="/browse"
                    badgeText="Smart Lists"
                >
                    Smart Grocery Planning
                </FeatureHighlight>
            </div>
        </div>

        <!-- Account Links -->
        <div v-if="!authStore.isAuthenticated" class="bg-gradient-to-r from-cyan-300 to-teal-100 border-t border-cyan-200">
            <div class="container mx-auto px-6 py-16">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div class="bg-white bg-opacity-60 rounded-xl p-8 text-center border border-cyan-200">
                        <div class="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <h2 class="text-3xl font-bold mb-4 text-gray-900">Have an Account?</h2>
                        <p class="text-gray-700 mb-6">Welcome back! Sign in to access your saved recipes and grocery lists.</p>
                        <NuxtLink to="/login" class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-lg">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                            </svg>
                            Log In
                        </NuxtLink>
                    </div>
                    <div class="bg-white bg-opacity-60 rounded-xl p-8 text-center border border-cyan-200">
                        <div class="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                            </svg>
                        </div>
                        <h2 class="text-3xl font-bold mb-4 text-gray-900">New Here?</h2>
                        <p class="text-gray-700 mb-6">Join our community and start organizing your recipes and meal planning today!</p>
                        <NuxtLink to="/signup" class="inline-flex items-center px-8 py-4 border border-cyan-300 text-lg font-medium rounded-lg text-cyan-700 bg-white hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-lg">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                            </svg>
                            Sign Up
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
</script>

<style scoped>

</style>