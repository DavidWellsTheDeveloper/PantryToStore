import { complexSearch, findByIngredients } from '../../../utils/spoonacular'

// Runtime search proxy (PRD §6.4): pantry (findByIngredients) and dish (complexSearch)
// modes with the full filter set. Same URL-shared shape as the client pages.
// Cached per path+query (Nitro hashes the full originalUrl).

const asString = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')
const asList = (v: unknown): string[] =>
  typeof v === 'string'
    ? v
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : []
const asNumber = (v: unknown): number => {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}

export default defineCachedEventHandler(
  async (event) => {
    const q = getQuery(event)
    const mode = q.mode === 'dish' ? 'dish' : 'pantry'
    const ingredients = asList(q.ing)
    const query = asString(q.q)
    const diet = asString(q.diet)
    const intolerances = asList(q.intol)
    const type = asString(q.type)
    const cuisines = asList(q.cuisines)
    const maxReadyTime = asNumber(q.time)
    const maxIngredients = asNumber(q.maxIng)

    const hasFilters = Boolean(
      diet || intolerances.length || type || cuisines.length || maxReadyTime > 0 || maxIngredients > 0,
    )

    if (mode === 'pantry' && ingredients.length === 0) return []
    if (mode === 'dish' && !query && !hasFilters) return []

    if (mode === 'pantry' && !hasFilters) {
      return findByIngredients(ingredients)
    }

    return complexSearch({
      query: mode === 'dish' ? query : undefined,
      ingredients: mode === 'pantry' ? ingredients : undefined,
      diet: diet || undefined,
      intolerances: intolerances.length ? intolerances : undefined,
      type: type || undefined,
      cuisines: cuisines.length ? cuisines : undefined,
      maxReadyTime: maxReadyTime || undefined,
      maxIngredients: maxIngredients || undefined,
    })
  },
  { maxAge: 60 * 60 * 6, swr: true, group: 'spoonacular', name: 'search' },
)