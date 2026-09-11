// Curated content manifest types (PRD §6.1/§14 + AdSense prep).
// The manifest overlays original editorial copy + taxonomy onto Spoonacular snapshots so
// every recipe page reads like publisher content, not an API dump.

import type { Macros, SpoonacularIngredient, SpoonacularInstructionStep } from '../utils/spoonacular.types'

/** Snapshot half — the fact layer, machine-generated (see scripts/extract-recipe-data.mjs). */
export interface CuratedRecipeData {
  id: number
  title: string
  image?: string
  readyInMinutes?: number
  servings?: number
  extendedIngredients: SpoonacularIngredient[]
  analyzedInstructions: { steps: SpoonacularInstructionStep[] }[]
  macros?: Macros
}

/** Editorial half — original copy + taxonomy, authored by hand in app/content/recipes.ts. */
export interface CuratedEditorial {
  titleOverride?: string // cleaner display title when the API title is messy
  intro: string
  tips: string[]
  faqs: { q: string; a: string }[]
  collections: string[]
  datePublished: string // ISO date this article went live
}

export interface CuratedRecipe extends CuratedRecipeData, CuratedEditorial {
  summary: string // meta/OG description (derived from intro when possible)
}

export interface Collection {
  slug: string
  eyebrow: string
  title: string
  intro: string
  description: string // meta description
  recipeIds: number[]
}