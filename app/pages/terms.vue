<template>
  <div class="container prose">
    <p class="eyebrow">Legal</p>
    <h1>Terms of Service</h1>
    <p class="lede">Last updated: September 2026</p>

    <p>
      By using Pantry to Store ("the Service"), you agree to these Terms. If you do not
      agree, please do not use the Service.
    </p>

    <h2>The Service</h2>
    <p>
      Pantry to Store is a recipe discovery tool. It helps you find recipes by the
      ingredients you have or dishes you want to cook, and lets you save favorites with an
      optional account.
    </p>

    <h2>Accounts</h2>
    <ul>
      <li>You must provide accurate information when creating an account.</li>
      <li>You are responsible for keeping your sign-in method (email/password or Google) secure.</li>
      <li>You may delete your account at any time using the process described in our
        <NuxtLink to="/privacy">Privacy Policy</NuxtLink>.</li>
    </ul>

    <h2>Content and data sources</h2>
    <p>
      Recipe data — names, ingredients, instructions, nutrition, and imagery — is provided
      via the Spoonacular API and belongs to its respective rights holders. We make it
      available for informational use. You may not scrape, republish, or resell this content
      at scale.
    </p>

    <h2>Acceptable use</h2>
    <p>You agree not to:</p>
    <ul>
      <li>interfere with or overload the Service or its data sources;</li>
      <li>attempt to access other users' accounts or data;</li>
      <li>use the Service in violation of any applicable law.</li>
    </ul>

    <h2>Disclaimers</h2>
    <p>
      The Service is provided "as is" without warranties of any kind. Recipe content is
      informational and is not medical, dietary, or nutrition advice. Confirm ingredients
      and cooking times for yourself, especially with allergies or dietary restrictions.
    </p>

    <h2>Limitation of liability</h2>
    <p>
      To the maximum extent permitted by law, we are not liable for any indirect,
      incidental, or consequential damages arising from your use of the Service.
    </p>

    <h2>Changes to these Terms</h2>
    <p>
      We may revise these Terms. Continued use of the Service after changes take effect
      means you accept the revised Terms.
    </p>

    <h2>Contact</h2>
    <p>
      Questions:
      <a href="mailto:support@pantrytostore.com">support@pantrytostore.com</a>
    </p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Terms of Service',
  description: 'Terms governing your use of Pantry to Store.',
})
useCanonical()
</script>

<style scoped>
.lede {
  color: var(--muted-foreground);
  font-size: 0.875rem;
}
</style>