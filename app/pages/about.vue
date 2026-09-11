<template>
  <div class="container prose">
    <p class="eyebrow">About</p>
    <h1>About Pantry to Store</h1>

    <p>
      Pantry to Store is a small, independent recipe site with one idea at its center:
      some of the best dinners start with what is already in your kitchen. We build recipes
      around the ingredients you actually have — so you spend less at the store, throw away
      less food, and cook dinner without a plan hanging over you.
    </p>

    <h2>How it works</h2>
    <ul>
      <li>
        <strong>Search by what you have.</strong> Enter the ingredients in your kitchen and
        we find recipes that use them — or search by dish name if you already know what you
        want.
      </li>
      <li>
        <strong>Curated collections.</strong> Quick weeknight dinners, one-pot and
        slow-cooker meals, plant-forward plates, and comfort favorites — grouped into
        collections so there is always somewhere to start.
      </li>
      <li>
        <strong>Recipes that respect attribution.</strong> Factual recipe data (ingredients,
        instructions, nutrition) comes from the Spoonacular API. Where a recipe has an
        original source, we link to it on every recipe page.
      </li>
    </ul>

    <h2>Our editorial approach</h2>
    <p>
      Every recipe page carries our own introduction, cook's notes, and answers to the
      questions home cooks actually ask — written by a human, not lifted from the API. We
      keep ingredient lists short, we tell you when something keeps or freezes well, and we
      never fake ratings or reviews. If a recipe is vegetarian or gluten-free as written, we
      say so plainly.
    </p>
    <p>
      Our recipe library starts small and grows deliberately. We believe a handful of recipes
      you can count on beats a thousand you will never cook.
    </p>

    <h2>Why it's free</h2>
    <p>
      Pantry to Store is free to use, supported by advertising on recipe pages — only after
      you accept non-essential cookies, and never on account or search screens. See our
      <NuxtLink to="/privacy">privacy policy</NuxtLink> for the details.
    </p>

    <h2>Contact</h2>
    <p>
      Questions, feedback, or press: reach us any time at
      <a href="mailto:support@pantrytostore.com">support@pantrytostore.com</a>.
      There is more on our <NuxtLink to="/contact">contact page</NuxtLink>.
    </p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'About',
  description:
    'Pantry to Store is a small, independent recipe site built around cooking with what you already have — curated collections, original notes, and honest attribution.',
})
useCanonical()
</script>

<style scoped>
.prose p {
  max-width: 68ch;
}

.prose li {
  max-width: 68ch;
}
</style>