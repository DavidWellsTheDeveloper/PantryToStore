import { sortedRecipes } from '../../../utils/spoonacular'

// Cached sorted listings for the home category sections (+ "browse more" paging).
// maxAge > TTL of the Spoonacular data; swr serves stale while revalidating.
export default defineCachedEventHandler(
  async (event) => {
    const { sort, limit = '6', offset = '0' } = getQuery(event) as {
      sort?: string
      limit?: string
      offset?: string
    }
    if (sort !== 'healthiness' && sort !== 'popularity') {
      throw createError({ statusCode: 400, statusMessage: 'sort must be healthiness | popularity' })
    }
    const parsed = { limit: Number(limit), offset: Number(offset) }
    if (!Number.isFinite(parsed.limit) || !Number.isFinite(parsed.offset)) {
      throw createError({ statusCode: 400, statusMessage: 'limit/offset must be numbers' })
    }
    return await sortedRecipes(sort, parsed.limit, parsed.offset)
  },
  { maxAge: 60 * 60 * 6, swr: true, group: 'spoonacular', name: 'sorted' },
)