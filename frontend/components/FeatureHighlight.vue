<template>
    <div class="container mx-auto px-6 py-16">
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div 
                class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                :class="horizontalSwap ? 'lg:grid-flow-col-dense' : ''"
            >
                <!-- Content Section -->
                <div 
                    class="p-8 lg:p-12"
                    :class="horizontalSwap ? 'lg:col-start-2' : ''"
                >
                    <div class="max-w-lg">
                        <!-- Icon Header -->
                        <div class="flex items-center mb-6">
                            <div class="w-12 h-12 bg-gradient-to-r from-cyan-300 to-teal-100 rounded-lg flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <div class="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        </div>
                        
                        <!-- Title -->
                        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            <slot></slot>
                        </h2>
                        
                        <!-- Description -->
                        <div class="prose prose-lg max-w-none">
                            <p class="text-gray-700 leading-relaxed mb-6">
                                {{ description }}
                            </p>
                        </div>
                        
                        <!-- Call to Action -->
                        <div v-if="showButtons" class="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                            <NuxtLink 
                                :to="primaryButtonLink"
                                class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-lg"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                                {{ primaryButtonText }}
                            </NuxtLink>
                            <NuxtLink 
                                :to="secondaryButtonLink"
                                class="inline-flex items-center px-6 py-3 border border-cyan-300 text-sm font-medium rounded-lg text-cyan-700 bg-white hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {{ secondaryButtonText }}
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                
                <!-- Image Section -->
                <div 
                    class="relative"
                    :class="horizontalSwap ? 'lg:col-start-1' : ''"
                >
                    <div class="aspect-w-16 aspect-h-12 lg:aspect-h-10">
                        <div class="relative overflow-hidden rounded-lg lg:rounded-none lg:rounded-r-xl">
                            <!-- Gradient Overlay -->
                            <div class="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 z-10"></div>
                            
                            <!-- Image -->
                            <img 
                                :src="img" 
                                :alt="alt"
                                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            >
                            
                            <!-- Decorative Elements -->
                            <div class="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm z-20"></div>
                            <div class="absolute bottom-4 left-4 w-6 h-6 bg-cyan-500/30 rounded-full backdrop-blur-sm z-20"></div>
                        </div>
                    </div>
                    
                    <!-- Feature Badge -->
                    <div v-if="badgeText" class="absolute -top-4 -right-4 z-30">
                        <div class="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                            <div class="flex items-center space-x-2">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                                <span>{{ badgeText }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
        },
        primaryButtonText: {
            type: String,
            default: 'Learn More'
        },
        secondaryButtonText: {
            type: String,
            default: 'Try It Out'
        },
        primaryButtonLink: {
            type: String,
            default: '#'
        },
        secondaryButtonLink: {
            type: String,
            default: '#'
        },
        showButtons: {
            type: Boolean,
            default: true
        },
        badgeText: {
            type: String,
            default: 'Featured'
        }
    })
</script>

<style scoped>

</style>