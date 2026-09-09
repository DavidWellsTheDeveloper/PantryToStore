// Server-only Spoonacular client — used by the /api/spoonacular/* proxy routes.
// The API key lives here (server/bundled-Nitro), never in the static bundle (PRD §7.2).

import type {
  FoundRecipe,
  Macros,
  SpoonacularRecipe,
} from '../../app/utils/spoonacular.types'

const BASE = 'https://api.spoonacular.com'

export function spoonacularKey(): string {
  const k = process.env.SPOONACULAR_API_KEY
  if (!k) throw new Error('SPOONACULAR_API_KEY not configured')
  return k
}

export function extractMacros(nutrition: SpoonacularRecipe['nutrition']): Macros | undefined {
  const list = nutrition?.nutrients
  if (!Array.isArray(list)) return undefined
  const find = (n: string): number | undefined => {
    const item = list.find((x) => x?.name === n)
    return typeof item?.amount === 'number' ? item.amount : undefined
  }
  const m: Macros = {
    calories: find('Calories'),
    protein: find('Protein'),
    carbs: find('Carbohydrates'),
    fat: find('Fat'),
  }
  if (m.calories == null && m.protein == null && m.carbs == null && m.fat == null) return undefined
  return m
}

async function fetchSpoonacular(rawPath: string): Promise<unknown> {
  const url = new URL(rawPath, BASE)
  url.searchParams.set('apiKey', spoonacularKey())
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Spoonacular ${res.status} for ${rawPath}`)
  return await res.json()
}

/** Minimal shape Spoonacular returns for a search/category result row. */
type SearchResultRow = {
  id?: number
  title?: string
  image?: string
  readyInMinutes?: number
  usedIngredientCount?: number
  missedIngredientCount?: number
  extendedIngredients?: unknown[]
  usedIngredients?: unknown[]
  missedIngredients?: unknown[]
  likes?: number
  spoonacularScore?: number
  nutrition?: SpoonacularRecipe['nutrition']
}

function toFoundRecipe(r: SearchResultRow): FoundRecipe {
  const fromExt = Array.isArray(r.extendedIngredients) ? r.extendedIngredients.length : undefined
  const fromUsedMissed =
    (Array.isArray(r.usedIngredients) ? r.usedIngredients.length : 0) +
    (Array.isArray(r.missedIngredients) ? r.missedIngredients.length : 0)
  return {
    id: r.id ?? 0,
    title: r.title ?? '',
    image: r.image ?? '',
    readyInMinutes: r.readyInMinutes,
    usedIngredientCount: r.usedIngredientCount,
    missedIngredientCount: r.missedIngredientCount,
    ingredientCount: fromExt ?? (fromUsedMissed > 0 ? fromUsedMissed : undefined),
    likes: r.likes,
    macros: extractMacros(r.nutrition),
    score: typeof r.spoonacularScore === 'number' ? r.spoonacularScore : undefined,
  }
}

/**
 * Sorted recipe listing (home categories): `sortedRecipes('healthiness' | 'popularity')`.
 * Proxy endpoints wrap this with route-level caching.
 */
export async function sortedRecipes(
  sort: 'healthiness' | 'popularity',
  number = 6,
  offset = 0,
): Promise<FoundRecipe[]> {
  const params = new URLSearchParams({ sort, sortDirection: 'desc' })
  params.set('addRecipeInformation', 'true')
  params.set('addRecipeNutrition', 'true')
  params.set('number', String(number))
  if (offset > 0) params.set('offset', String(offset))

  const json = (await fetchSpoonacular(`/recipes/complexSearch?${params}`)) as {
    results?: SearchResultRow[]
  }
  return (json?.results ?? []).map(toFoundRecipe)
}

/** Full recipe detail (SEO pages). Attaches macros. */
export async function recipeById(id: number): Promise<SpoonacularRecipe> {
  const json = (await fetchSpoonacular(`/recipes/${id}/information?includeNutrition=true`)) as SpoonacularRecipe
  json.macros = extractMacros(json.nutrition)
  return json
}

/** Pantry mode: find recipes that use the most of the given ingredients. */
export async function findByIngredients(ingredients: string[]): Promise<FoundRecipe[]> {
  const params = new URLSearchParams({
    ingredients: ingredients.join(','),
    number: '12',
    ranking: '1',
    ignorePantry: 'true',
  })
  const json = (await fetchSpoonacular(`/recipes/findByIngredients?${params}`)) as SearchResultRow[]
  return Array.isArray(json) ? json.map(toFoundRecipe) : []
}

export type ComplexSearchInput = {
  query?: string
  ingredients?: string[]
  diet?: string
  intolerances?: string[]
  type?: string
  cuisines?: string[]
  maxReadyTime?: number
  maxIngredients?: number
}

/** Dish mode (or pantry + filters): full complexSearch with all filter knobs. */
export async function complexSearch(input: ComplexSearchInput): Promise<FoundRecipe[]> {
  const params = new URLSearchParams()
  if (input.query) params.set('query', input.query)
  if (input.ingredients?.length) {
    params.set('includeIngredients', input.ingredients.join(','))
    params.set('sort', 'min-missing-ingredients')
    params.set('fillIngredients', 'true')
  }
  if (input.diet) params.set('diet', input.diet)
  if (input.intolerances?.length) params.set('intolerances', input.intolerances.join(','))
  if (input.type) params.set('type', input.type)
  if (input.cuisines?.length) params.set('cuisine', input.cuisines.join(','))
  if (input.maxReadyTime && input.maxReadyTime > 0) params.set('maxReadyTime', String(input.maxReadyTime))
  params.set('addRecipeInformation', 'true')
  params.set('addRecipeNutrition', 'true')
  params.set('number', '24')

  const json = (await fetchSpoonacular(`/recipes/complexSearch?${params}`)) as { results?: SearchResultRow[] }
  const results = (json?.results ?? []).map(toFoundRecipe)

  const cap = input.maxIngredients
  const filtered = cap && cap > 0 ? results.filter((r) => r.ingredientCount === undefined || r.ingredientCount <= cap) : results

  return filtered.slice(0, 12)
}