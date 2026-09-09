import type { SupabaseClient } from '@supabase/supabase-js'

// Favorites (PRD §6.6): per-user rows in Postgres with RLS. Client-only reads/writes;
// the DB trigger (`supabase/migrations/*_enforce_favorites_cap.sql`) enforces the free
// (non-pro) cap of 10 — never trust this layer for the cap, it only makes the UI friendly.

const FREE_LIMIT = 10

export type FavoriteRecipe = { id: number; title: string; image?: string }

export type FavoriteRow = {
  id: string
  recipe_id: number
  recipe: FavoriteRecipe | null
  created_at: string
}

function client(): SupabaseClient {
  const c = useSupabase()
  if (!c) throw new Error('Supabase is not configured')
  return c
}

export function useFavorites() {
  const favorites = useState<FavoriteRow[]>('favorites', () => [])
  const loading = useState<boolean>('favorites-loading', () => false)
  const error = useState<string | null>('favorites-error', () => null)

  const count = computed(() => favorites.value.length)
  const isFull = computed(() => count.value >= FREE_LIMIT)

  async function list() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await client()
        .from('favorites')
        .select('id, recipe_id, recipe, created_at')
        .order('created_at', { ascending: false })
      if (err) throw new Error(err.message)
      favorites.value = (data ?? []) as FavoriteRow[]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Could not load favorites'
    } finally {
      loading.value = false
    }
  }

  async function add(recipe: FavoriteRecipe) {
    error.value = null
    const user = useUser().value
    if (!user) throw new Error('Sign in to save favorites')
    const { error: err } = await client()
      .from('favorites')
      .insert({ user_id: user.id, recipe_id: recipe.id, recipe })
    if (err) {
      const msg = err.message
      error.value = /limit|Free tier/i.test(msg)
        ? `Free tier limit reached (${FREE_LIMIT} recipes).`
        : msg
      throw new Error(error.value)
    }
    await list()
  }

  async function remove(recipeId: number) {
    const { error: err } = await client().from('favorites').delete().eq('recipe_id', recipeId)
    if (err) throw new Error(err.message)
    favorites.value = favorites.value.filter((f) => f.recipe_id !== recipeId)
  }

  function isFavorite(recipeId: number): ComputedRef<boolean> {
    return computed(() => favorites.value.some((f) => f.recipe_id === recipeId))
  }

  return { favorites, loading, error, count, isFull, isFavorite, list, add, remove }
}