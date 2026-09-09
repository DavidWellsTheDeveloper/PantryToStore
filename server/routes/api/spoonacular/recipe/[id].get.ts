import { recipeById } from '../../../../utils/spoonacular'

// Full recipe detail (SEO pages). Cache generously — recipe content is static-ish;
// swr keeps old content serving while a single revalidation refreshes it.
export default defineCachedEventHandler(
  async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    if (!Number.isInteger(id) || id <= 0) {
      throw createError({ statusCode: 400, statusMessage: 'invalid recipe id' })
    }
    return await recipeById(id)
  },
  { maxAge: 60 * 60 * 24, swr: true, group: 'spoonacular', name: 'recipe' },
)