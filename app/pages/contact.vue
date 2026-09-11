<template>
  <div class="container prose">
    <p class="eyebrow">Contact</p>
    <h1>Contact us</h1>

    <p>
      We read every message. The fastest way to reach us is by email, and we normally reply
      within two business days.
    </p>

    <p class="contact-card">
      <a href="mailto:support@pantrytostore.com" class="contact-card__mail">support@pantrytostore.com</a>
    </p>

    <h2>Good to know</h2>
    <ul>
      <li>
        <strong>Recipe requests:</strong> tell us which dish or ingredient you want more of —
        suggestions shape what we add to the library next.
      </li>
      <li>
        <strong>Corrections:</strong> spotted a wrong amount or a broken link? Send the recipe
        name and what you found.
      </li>
      <li>
        <strong>Privacy & account data:</strong> to request access, export, or deletion of
        your account data, email us from the address you use to sign in. This is also covered
        in our <NuxtLink to="/privacy">privacy policy</NuxtLink>.
      </li>
      <li>
        <strong>Partnerships & press:</strong> happy to talk — just say who you are and what
        you are working on.
      </li>
    </ul>

    <p>
      To help us help you, please send the email from the address you used to create your
      account (if it is an account question) and include as much context as you can.
    </p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Contact',
  description:
    'Contact Pantry to Store — recipe requests, corrections, privacy and account data requests, partnerships, and press.',
})
useCanonical()
</script>

<style scoped>
.contact-card {
  margin: 1.5rem 0;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
}

.contact-card__mail {
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
}

.contact-card__mail:hover {
  text-decoration: underline;
}
</style>