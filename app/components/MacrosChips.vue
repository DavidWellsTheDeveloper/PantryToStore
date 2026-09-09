<script setup lang="ts">
import type { Macros } from '../utils/spoonacular.types'

defineProps<{ macros?: Macros }>()
</script>

<template>
  <span v-if="macros" class="macros" aria-label="Macronutrients">
    <span v-if="macros.calories != null" class="macros__item macros__item--calories">
      {{ Math.round(macros.calories) }} kcal
    </span>
    <span v-if="macros.protein != null" class="macros__item macros__item--protein">
      {{ Math.round(macros.protein) }}g protein
    </span>
    <span v-if="macros.carbs != null" class="macros__item macros__item--carbs">
      {{ Math.round(macros.carbs) }}g carbs
    </span>
    <span v-if="macros.fat != null" class="macros__item macros__item--fat">
      {{ Math.round(macros.fat) }}g fat
    </span>
  </span>
</template>

<style scoped>
.macros {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.macros__item {
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 999px;
  padding: 0.125rem 0.625rem;
}

.macros__item--calories {
  background: var(--macro-calories-soft);
  color: color-mix(in srgb, var(--macro-calories), black 45%);
}

.macros__item--protein {
  background: var(--macro-protein-soft);
  color: color-mix(in srgb, var(--macro-protein), black 45%);
}

.macros__item--carbs {
  background: var(--macro-carbs-soft);
  color: color-mix(in srgb, var(--macro-carbs), black 45%);
}

.macros__item--fat {
  background: var(--macro-fat-soft);
  color: color-mix(in srgb, var(--macro-fat), black 45%);
}
</style>