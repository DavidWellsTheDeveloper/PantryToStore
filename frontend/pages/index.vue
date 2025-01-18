<template>
    <div>
        <div class="">
            <div id="quick-links" class="grid grid-cols-3 gap-5 justify-around py-20 px-6 bg-teal-900 text-center">
                <QuickLinkCard
                    description="View our library of recipes. When you find one you like, save it for easy access."
                    linkText="Search Recipes"
                    address="/browse"
                >
                    Browse Recipes
                </QuickLinkCard>
                <QuickLinkCard
                    description="Do you have your own recipe you'd like to use? Add it to your account and view it
                    anywhere."
                    linkText="Add Recipe"
                    address="/add"
                >
                    Add Your Own</QuickLinkCard>
                <QuickLinkCard
                    description="Manage your grocery list. Add houshold necessities, or ingredients from your favorite
                    recipes, and share lists with friends and family."
                    linkText="View Grocery List"
                    address="/grocery"
                >
                    Grocery List
                </QuickLinkCard>
            </div>
            <FeatureHighlight
                img="https://www.w3schools.com/images/w3schools_green.jpg"
                alt="some alt text"
                horizontalSwap="true"
                description="some description, lorem ibsum some description, lorem ibsum some description, lorem ibsum some description, lorem ibsum some description, lorem ibsum some description, lorem ibsum "
            >
                Some Highlight</FeatureHighlight>
            <div id="account-links" class="flex bg-cyan-800 justify-around text-center pt-5 pb-8">
                <div id="account-links-login">
                    <h2 class="text-3xl font-bold mb-6 text-white whitespace-nowrap">Have an Account</h2>
                    <NuxtLink to="/login" class="inline-block py-4 px-8 bg-cyan-600 hover:bg-cyan-500 rounded-xl whitespace-nowrap">Log In</NuxtLink>
                </div>
                <div id="account-links-signup">
                    <h2 class="text-3xl font-bold mb-6 text-white whitespace-nowrap">Sign Up</h2>
                    <NuxtLink to="/signup" class="inline-block py-4 px-8 bg-cyan-600 hover:bg-cyan-500 rounded-xl whitespace-nowrap">Sign Up</NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>