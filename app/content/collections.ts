// Collection hubs — the topical layer that turns the recipe library into indexable,
// interlinked content (AdSense/SEO prep). Each hub is a static `/collections/[slug]` page.

import type { Collection } from './types'

export const collections: Collection[] = [
  {
    slug: 'quick-weeknight-dinners',
    eyebrow: 'Collection',
    title: 'Quick Weeknight Dinners',
    intro:
      'Real dinners that come together in about an hour, with a short grocery list. These are the recipes we reach for when the pantry is doing most of the work — one skillet, one pot, or one sheet pan, and a plate on the table without a fuss.',
    description:
      'Quick, practical dinner recipes that use what is already in your kitchen — most in under an hour, several in one pot or sheet pan.',
    recipeIds: [30338, 38925, 677801, 791498, 840670, 1063113, 1164981],
  },
  {
    slug: 'one-pot-and-crockpot-meals',
    eyebrow: 'Collection',
    title: 'One-Pot & Slow-Cooker Meals',
    intro:
      'Slow-cooker braises and one-pot dinners that do the work while you do anything else. Long, low cooking is the shortcut — it turns cheap cuts tender and thickens soups and beans into something that fills the house with the right smell.',
    description:
      'Set-and-forget slow-cooker braises, soups, and one-pot dinners that turn pantry staples and affordable cuts into comfort food.',
    recipeIds: [38925, 201159, 716873, 909604, 968153, 1164981],
  },
  {
    slug: 'plant-forward-recipes',
    eyebrow: 'Collection',
    title: 'Fresh & Plant-Forward Recipes',
    intro:
      'Vegetables, beans, and grains doing the headlining. Plant-forward does not mean complicated — it means cauliflower, white beans, tofu, and greens treated like the main event, with a few swaps from the rest of our library to make any of them heartier.',
    description:
      'Vegetarian and flexible recipes that put vegetables, beans, tofu, and grains first — many are vegan as written.',
    recipeIds: [30338, 38925, 840670, 945221, 1063113, 1164981],
  },
  {
    slug: 'comfort-food-favorites',
    eyebrow: 'Collection',
    title: 'Comfort Food Favorites',
    intro:
      'The dishes you crave when the day runs long: roasted chicken and potatoes, a pot roast that braises itself, a crispy casserole, soup that thickens overnight into leftovers you actually look forward to. Gentle, generous cooking with short ingredient lists.',
    description:
      'Cozy, generous recipes — pot roast, sheet pan chicken, crispy casseroles, and rustic soup — that lean on pantry staples.',
    recipeIds: [201159, 716873, 791498, 840670, 909604, 968153],
  },
]

const collectionMap = new Map(collections.map((c) => [c.slug, c]))

export function findCollection(slug: string): Collection | undefined {
  return collectionMap.get(slug)
}

/**
 * Home page sections. Each maps to a collection; the rendered section shows its first
 * `limit` recipes and links "View all" to the hub page.
 */
export const homeSections: { collection: string; eyebrow: string; limit: number }[] = [
  { collection: 'quick-weeknight-dinners', eyebrow: 'Cook this week', limit: 6 },
  { collection: 'plant-forward-recipes', eyebrow: 'Fresh & plant-forward', limit: 6 },
  { collection: 'comfort-food-favorites', eyebrow: 'Comfort food', limit: 6 },
]