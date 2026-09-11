// Spoonacular payload types (client-safe, serializable — PRD §7.4 utils/).
// Mirrors the original app's types; must stay primitives-only so server-fn
// serialization and static payloads stay clean.

export type Macros = {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
}

export type FoundRecipe = {
  id: number
  title: string
  image: string
  usedIngredientCount?: number
  missedIngredientCount?: number
  readyInMinutes?: number
  ingredientCount?: number
  likes?: number
  macros?: Macros
  score?: number // 0-100 spoonacularScore
}

export type SpoonacularIngredient = {
  id?: number
  name?: string
  nameClean?: string
  original?: string
  amount?: number
  unit?: string
  unitShort?: string
  measures?: {
    us?: { amount?: number; unitShort?: string; unitLong?: string }
    metric?: { amount?: number; unitShort?: string; unitLong?: string }
  }
}

export type SpoonacularInstructionStep = {
  number: number
  step: string
}

export type SpoonacularInstructionGroup = {
  name?: string
  steps: SpoonacularInstructionStep[]
}

export type SpoonacularRecipe = {
  id: number
  title: string
  image?: string
  readyInMinutes?: number
  servings?: number
  spoonacularScore?: number
  sourceUrl?: string
  sourceName?: string
  summary?: string
  instructions?: string
  extendedIngredients?: SpoonacularIngredient[]
  analyzedInstructions?: SpoonacularInstructionGroup[]
  weightPerServing?: { amount?: number; unit?: string }
  nutrition?: { nutrients?: Array<{ name?: string; amount?: number; unit?: string }> }
  macros?: Macros // attached server-side by the proxy
}