<template>
  <div class="container prose">
    <p class="eyebrow">Legal</p>
    <h1>Privacy Policy</h1>
    <p class="lede">Last updated: September 2026</p>

    <p>
      Pantry to Store ("we", "us") respects your privacy. This policy explains what data we
      collect, why, and the choices you have. It covers visitor data, advertising cookies,
      and account data.
    </p>

    <h2>Data we collect</h2>
    <ul>
      <li>
        <strong>Account data (received only if you create an account):</strong> your email
        address and the recipe favorites you save. Stored securely in our Supabase database.
        Sign-in is handled by Supabase Auth; we never see or store your password.
      </li>
      <li>
        <strong>Anonymous usage data (if you allow ad cookies — see below):</strong> Google
        AdSense uses cookies to serve and measure ads, including interest-based advertising.
        We do not collect or store this data ourselves.
      </li>
    </ul>

    <h2>Cookies and third-party vendors</h2>
    <p>
      We use a small number of cookies: a first-party consent choice cookie, and, if you
      accept, cookies set by Google AdSense, our advertising partner. Google may use cookies
      to personalize ads based on your visits across websites.
    </p>
    <ul>
      <li>Google Advertising Cookies Policy — google.com/policies/technologies/ads</li>
      <li>
        Opt out of personalized advertising:
        <a href="https://www.google.com/settings/ads" rel="noopener" target="_blank">Google Ads Settings</a>
      </li>
      <li>
        Opt out via industry programs:
        <a href="https://www.aboutads.info/choices" rel="noopener" target="_blank">aboutads.info</a>
      </li>
    </ul>
    <p>
      Google's own policies describe their data use at
      <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">policies.google.com/technologies/partner-sites</a>.
      This site does not render advertising until you accept non-essential cookies.
    </p>

    <h2>Other third parties</h2>
    <ul>
      <li>
        <strong>Recipe data:</strong> recipe content (titles, ingredients, instructions,
        nutrition) comes from the Spoonacular API and is third-party content.
      </li>
      <li>
        <strong>Fonts:</strong> the Fraunces and Instrument Sans typefaces load from Google
        Fonts, which receives a request from your browser.
      </li>
    </ul>

    <h2>Your rights</h2>
    <p>
      You may request access to, correction of, or deletion of your account and the data
      associated with it. To delete your account or export your data, email us (below) from
      the address you use to sign in, or use the deletion affordance on your
      <NuxtLink to="/account">account page</NuxtLink>. If you are in the EEA or UK, you also
      have the right to object to or restrict processing, and to lodge a complaint with your
      data protection authority.
    </p>

    <h2>Contact</h2>
    <p>
      Questions or requests:
      <a href="mailto:support@pantrytostore.com">support@pantrytostore.com</a>
    </p>

    <h2>Policy changes</h2>
    <p>
      We may update this policy as the service evolves. Changes take effect when posted on
      this page, with a revised date at the top.
    </p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy',
  description: 'How Pantry to Store collects, uses, and protects your data.',
})
useCanonical()
</script>

<style scoped>
.lede {
  color: var(--muted-foreground);
  font-size: 0.875rem;
}
</style>