<script setup lang="ts">
import { useConsent } from '../composables/useConsent'

const { showBanner, decide } = useConsent()
</script>

<template>
  <div v-if="showBanner" class="cmp" role="dialog" aria-label="Cookie consent">
    <div class="cmp__inner">
      <p class="cmp__text">
        We use cookies (via our ad partner, Google AdSense) to show ads that are useful to
        you. You can accept or reject non-essential cookies below. See our
        <NuxtLink to="/privacy">Privacy Policy</NuxtLink> for details.
      </p>
      <div class="cmp__actions">
        <button type="button" class="btn btn--outline btn--sm" @click="decide(false)">Reject non-essential</button>
        <button type="button" class="btn btn--primary btn--sm" @click="decide(true)">Accept all</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cmp {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 50;
  padding: 1rem;
  pointer-events: none;
}

.cmp__inner {
  max-width: 42rem;
  margin-inline: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 8px 30px rgb(45 64 50 / 0.18);
  padding: 1rem 1.25rem;
  pointer-events: auto;
}

.cmp__text {
  flex: 1 1 20rem;
  margin: 0;
  font-size: 0.875rem;
  color: color-mix(in srgb, var(--foreground), transparent 15%);
  line-height: 1.5;
}

.cmp__actions {
  display: flex;
  gap: 0.5rem;
}
</style>