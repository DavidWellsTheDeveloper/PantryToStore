// Curated recipe library — editorial overlay + taxonomy.
//
// This is the "publisher content" layer (AdSense prep): original intro, chef's notes,
// and FAQs written in our own voice on top of the Spoonacular fact data in
// app/content/recipe-data.ts. The API titles are kept as canonical names when they are
// clean; where a title is messy or brand-referencing we override it for display.

import type { CuratedEditorial, CuratedRecipe } from './types'
import { recipeData } from './recipe-data'

const DATE_PUBLISHED = '2026-09-10'

type EditorialWithOverrides = CuratedEditorial & { readyInMinutes?: number; servings?: number }

const editorial: Record<number, EditorialWithOverrides> = {
  30338: {
    titleOverride: undefined,
    intro:
      'A warm, smoky vegetable dish that feels more like a small celebration than a side. Charring the peppers first is what makes the almond sauce sing, and it happily uses up that half cauliflower taking up fridge space. Serve it over rice, with scrambled eggs, or tucked into a tortilla.',
    tips: [
      'Char the peppers over an open flame if you can — the smoky bits that reach the sauce are the whole point.',
      'The almond sauce keeps for about three days in the fridge; make extra and drizzle it over roasted vegetables or grain bowls.',
      'This is vegetarian as written but a little crisp chorizo on top (or a fried egg) turns it into a quick dinner.',
    ],
    faqs: [
      { q: 'Can I make this ahead?', a: 'The sauce and the charred peppers can be made a day ahead. Cook the vegetables just before serving so they stay tender.' },
      { q: 'No almond butter on hand?', a: 'Tahini or sunflower seed butter works in the same volume, though the flavor will shift a little warmer and nuttier.' },
    ],
    collections: ['quick-weeknight-dinners', 'plant-forward-recipes'],
    datePublished: DATE_PUBLISHED,
  },
  38925: {
    titleOverride: 'Italian White Beans',
    intro:
      'Dried beans, a slow simmer, and almost nothing else — this is pantry cooking at its most honest. The beans turn creamy and the olive oil pools into a sauce you will want bread for. It also reheats beautifully, which makes it a meal you look forward to a second and third time.',
    tips: [
      'Soaking the beans overnight shortens the simmer and makes them easier to digest.',
      'Reserve a splash of the cooking liquid when you reheat leftovers — it loosens the beans back to creamy.',
      'In a hurry? Canned cannellini beans work: skip the long cook and simmer everything together for about 15 minutes.',
    ],
    faqs: [
      { q: 'Do I need to soak the beans overnight?', a: 'It helps, but it is not a hard rule. A quick soak (boil for 2 minutes, rest for an hour) gets you most of the way there, and canned beans skip it entirely.' },
      { q: 'What do you eat this with?', a: 'Crusty bread and a handful of greens, or spooned over pasta. Leftovers also make a great base for roasted chicken.' },
    ],
    collections: ['quick-weeknight-dinners', 'one-pot-and-crockpot-meals', 'plant-forward-recipes'],
    datePublished: DATE_PUBLISHED,
  },
  201159: {
    titleOverride: 'Zesty Slow-Cooker Italian Pot Roast',
    intro:
      'A set-and-forget slow-cooker dinner that turns a tough, affordable cut into something the whole table asks for again. Canned tomato soup does the braising work, so you do not need stock or a long list of spices. Let it cook while you are out and come home to a finished pot.',
    tips: [
      'Sear the roast in a hot pan for a few minutes per side before it goes in the cooker — five minutes of work, noticeably better depth.',
      'The cornstarch-style gravy step is the finishing touch that turns pot liquor into a proper sauce; worth doing, optional if you are out of flour.',
      'Shredded leftovers freeze well in the cooking liquid, which keeps the meat moist when reheated.',
    ],
    faqs: [
      { q: 'How long should I cook it for?', a: 'About 10–12 hours on low, or 5–6 hours on high, until the beef pulls apart easily. Cooking times vary with your slow cooker, so check a little before you expect it done.' },
      { q: 'Can I make this with chicken instead?', a: 'Yes, use bone-in thighs and cook on low for about 4 hours. Skip the overnight-low window — white meat dries out long before the day is up.' },
    ],
    collections: ['one-pot-and-crockpot-meals', 'comfort-food-favorites'],
    datePublished: DATE_PUBLISHED,
  },
  677801: {
    titleOverride: 'Chicken Lettuce Wraps',
    intro:
      'Crisp lettuce, saucy ground chicken, and the crunch of water chestnuts — a takeout classic you can make in one skillet. The sauce comes together in a bowl you can microwave, so there is no splitting pans or specialty equipment. Lighter than it tastes, and fast enough for a weeknight.',
    tips: [
      'Warm the sauce briefly to melt the peanut butter into everything instead of leaving it streaky.',
      'Butter lettuce holds its shape best; if you only have iceberg, that works too, just use the inner leaves.',
      'Double the sauce if you like your wraps drippy — it keeps in the fridge for a week.',
    ],
    faqs: [
      { q: 'Is this gluten-free?', a: 'As written, it uses tamari or soy sauce — choose tamari and check the chili garlic sauce label to keep it gluten-free.' },
      { q: 'Can I use turkey instead of chicken?', a: 'Yes, swap in ground turkey or pork with no other changes. Both cook in the same time and take the same sauce.' },
    ],
    collections: ['quick-weeknight-dinners', 'comfort-food-favorites'],
    datePublished: DATE_PUBLISHED,
  },
  716873: {
    titleOverride: 'Slow-Cooker Jalapeño Popper Taquitos',
    intro:
      'Slow-cooked chicken gets shredded into a creamy, spicy filling that rolls into golden, crispy taquitos. Cream cheese and pickled jalapeños do the heavy lifting, so the flavor is big without a long ingredient list. Make a double batch — the extras freeze before baking.',
    tips: [
      'Roll them tight and place seam-side down on the tray so they do not unroll in the oven.',
      'A final couple of minutes under the broiler adds real crunch; watch them closely so the tops do not burn.',
      'Unbaked taquitos freeze well laid out on a tray, then transferred to a bag for up to two months.',
    ],
    faqs: [
      { q: 'Can I use fresh jalapeños instead of jarred?', a: 'Yes — use two finely chopped fresh jalapeños seeded, adjust to taste. Jarred are mellower and more consistent, which is why the recipe leans on them.' },
      { q: 'Corn or flour tortillas?', a: 'Flour roll more easily and brown nicely; corn are sturdier and give a more rustic flavor. Both work — warm them briefly so they do not crack.' },
    ],
    collections: ['one-pot-and-crockpot-meals', 'comfort-food-favorites'],
    datePublished: DATE_PUBLISHED,
    readyInMinutes: 360,
  },
  791498: {
    titleOverride: 'Chip-Topped Chicken Taco Casserole',
    intro:
      'A no-judgment weeknight casserole built from a bag of chips and a can of soup. It comes out crunchy on top, gooey in the middle, and is the kind of dinner that disappears fastest when you are feeding kids. The grocery list is short and almost everything in it is a pantry staple.',
    tips: [
      'Crush the chips coarsely — fine crumbs turn to mush; big pieces stay crunchy on top.',
      'Cream of mushroom soup swaps in neatly if you are out of cream of chicken.',
      'Reheat leftovers in the oven (not the microwave) to bring the crunch back.',
    ],
    faqs: [
      { q: 'Do I have to layer it, or can I just mix everything?', a: 'Layering keeps the chips from turning soggy before the bake. Mix everything except half the chips, top with the rest, and it still works.' },
      { q: 'Can I make this ahead?', a: 'Assemble it the night before, keep it covered in the fridge, and add 10 minutes to the bake. Hold off on crushing the top layer of chips until just before it goes in.' },
    ],
    collections: ['quick-weeknight-dinners', 'comfort-food-favorites'],
    datePublished: DATE_PUBLISHED,
  },
  840670: {
    titleOverride: 'Pizza Margherita Grilled Cheese',
    intro:
      'Everything you love about pizza, folded into a sandwich that cooks in one skillet. Fire-roasted tomatoes make a quick from-scratch sauce while the mozzarella does the stretchy work. Thirty minutes and mostly pantry ingredients stand between you and this.',
    tips: [
      'Press the sandwich gently with a spatula as it cooks for even browning.',
      'If the cheese is not melting before the bread darkens, cover the pan for 30 seconds to trap the heat.',
      'The sauce batch is worth doubling — it refrigerates and turns leftover lunches into pizza-ish anything.',
    ],
    faqs: [
      { q: 'What bread works best?', a: 'Sourdough is ideal — sturdy enough to hold the sauce and it toasts beautifully. Ciabatta and good country bread are close seconds.' },
      { q: 'Is this vegetarian?', a: 'Yes — this is a meat-free meal as written. Add pepperoni slices or prosciutto under the cheese if you want the pizza swap.' },
    ],
    collections: ['quick-weeknight-dinners', 'plant-forward-recipes', 'comfort-food-favorites'],
    datePublished: DATE_PUBLISHED,
  },
  909604: {
    titleOverride: 'One-Pot Chicken & Potatoes',
    intro:
      'One sheet pan, a pile of chicken thighs, and potatoes that soak up every dripping. It is a low-mess roast that feeds a hungry crowd and leaves you with a single pan to wash. Salt, pepper, garlic, olive oil — this is proof you do not need a long marinade to eat well.',
    tips: [
      'Skin-on, bone-in thighs give the crispiest results; the skin also protects the meat while the potatoes get tender.',
      'Spread everything in a single layer so the chicken browns instead of steaming.',
      'Five minutes of broiling at the end adds color; watch carefully so garlic does not scorch.',
    ],
    faqs: [
      { q: 'Can I use breast instead of thighs?', a: 'Thighs are the right choice here because they stay juicy at the longer roast time. If you swap breasts, pull them out earlier and finish the potatoes alone.' },
      { q: 'Do the potatoes actually get crispy?', a: 'They caramelize in the chicken drippings rather than crisping like fries — which is exactly what you want them to soak up. For extra color, toss them once halfway through.' },
    ],
    collections: ['one-pot-and-crockpot-meals', 'comfort-food-favorites'],
    datePublished: DATE_PUBLISHED,
  },
  945221: {
    titleOverride: 'Peanut Butter Banana Oat Breakfast Cookies',
    intro:
      'A soft, cookie-shaped breakfast you can make ahead and grab all week. Mashed banana and applesauce do the binding, so the recipe is egg-free and dairy-free without trying to be. They lean more snack than dessert, which is exactly what makes them good at 7 am.',
    tips: [
      'Let the dough rest for ten minutes before scooping so the oats hydrate and hold together.',
      'Flatten each cookie gently — they will not spread on their own.',
      'They turn a little chewier by day two, which most people here consider an upgrade; store them airtight.',
    ],
    faqs: [
      { q: 'Do they keep?', a: 'In a covered container at room temperature, about four days. They also freeze well for up to two months — pull out two the night before.' },
      { q: 'Can I skip the protein powder?', a: 'Yes. Leave it out and the cookies are still great, just softer and slightly lower in protein.' },
    ],
    collections: ['plant-forward-recipes'],
    datePublished: DATE_PUBLISHED,
  },
  968153: {
    titleOverride: 'Split Pea and Ham Soup',
    intro:
      'The patient reward at the end of a good ham dinner. Split peas thicken into a rustic, rib-sticking soup that tastes even better the next day, and it finds a use for the bone you were about to throw out. Low effort, most of it just time on the stove.',
    tips: [
      'Sort the dried peas and rinse them — a stray pebble is the one surprise this soup does not need.',
      'Stir occasionally as it cooks; split peas like to settle on the bottom.',
      'Leftovers thicken in the fridge, so loosen them with a splash of water or stock when you reheat.',
    ],
    faqs: [
      { q: 'No ham bone — can I still make it?', a: 'Yes, use a smoked ham hock instead, or simmer with a cup of chopped leftover ham and a little extra salt.' },
      { q: 'How long does it keep?', a: 'About four days in the fridge and three months in the freezer. Portion it into containers before freezing so you can pull out single servings.' },
    ],
    collections: ['one-pot-and-crockpot-meals', 'comfort-food-favorites'],
    datePublished: DATE_PUBLISHED,
  },
  1063113: {
    titleOverride: 'Vegan Scrambled Tofu',
    intro:
      'A tofu scramble that actually scrambles — soft, seasonable, and fast. Smoked paprika gives it the color and gentle smoke you would expect from a pan of eggs. Brilliant on toast at breakfast, or loaded into a burrito for a quick dinner.',
    tips: [
      'Drain the tofu well and crumble it into uneven chunks, not dust — uneven texture is what makes it feel scrambled.',
      'Add the paprika when the onion is in the pan so it blooms in the oil before the tofu goes in.',
      'Season early. Tofu absorbs flavor as it cooks, so a little again at the end keeps the top tasting as good as the middle.',
    ],
    faqs: [
      { q: 'Which tofu should I buy?', a: 'Firm or extra-firm. Silken tofu will collapse into porridge, which is a different (still edible) thing entirely.' },
      { q: 'What are the best add-ins?', a: 'Sautéed mushrooms, spinach, and a pinch of turmeric for extra color all work without changing the method. Black salt adds an eggy note if you have it.' },
    ],
    collections: ['quick-weeknight-dinners', 'plant-forward-recipes'],
    datePublished: DATE_PUBLISHED,
  },
  1164981: {
    titleOverride: 'Instant Pot Stuffed Spaghetti Squash',
    intro:
      'Stuffed spaghetti squash with mushrooms, kale, and sun-dried tomatoes, cooked start to finish under pressure. The strands turn tender while the filling does the flavoring, and most of the cook time is hands-off. About as weeknight-vegetarian as it gets.',
    tips: [
      'Fluff the squash strands with a fork while they are warm — they separate more easily right after cooking.',
      'Keep the skin intact if you are serving in the shell; it makes a built-in bowl.',
      'The pine nuts are optional but worth toasting — they add the crunch the dish otherwise lacks.',
    ],
    faqs: [
      { q: 'No Instant Pot — can I make this in the oven?', a: 'Yes. Roast the squash halves cut-side down at 400°F for about 40 minutes, and sauté the filling in a skillet while they cook.' },
      { q: 'Is this one squash per person?', a: 'The recipe halves one squash for two servings. If you are hungrier or using a small squash, roasting one half per person works.' },
    ],
    collections: ['quick-weeknight-dinners', 'one-pot-and-crockpot-meals', 'plant-forward-recipes'],
    datePublished: DATE_PUBLISHED,
  },
}

function metaFrom(text: string): string {
  const sentence = text.split(/(?<=[.!?])\s+/).reduce((acc, s) => {
    const next = acc ? `${acc} ${s}` : s
    return next.length <= 160 ? next : acc
  }, '')
  return sentence || text.slice(0, 158)
}

export const curatedRecipes: CuratedRecipe[] = recipeData.map((data) => {
  const e = editorial[data.id]
  const intro = e?.intro ?? ''
  const base: CuratedRecipe = {
    ...data,
    titleOverride: e?.titleOverride ?? data.title,
    intro,
    tips: e?.tips ?? [],
    faqs: e?.faqs ?? [],
    collections: e?.collections ?? [],
    summary: metaFrom(intro || data.title),
    datePublished: e?.datePublished ?? DATE_PUBLISHED,
  }
  if (e?.readyInMinutes != null) base.readyInMinutes = e.readyInMinutes
  if (e?.servings != null) base.servings = e.servings
  return base
})

const byId = new Map(curatedRecipes.map((r) => [r.id, r]))

export function findCuratedRecipe(id: number): CuratedRecipe | undefined {
  return byId.get(id)
}

export function curatedCards(idList: number[]) {
  return idList
    .map((id) => byId.get(id))
    .filter((r): r is CuratedRecipe => Boolean(r))
    .map((r) => ({
      id: r.id,
      title: r.title,
      image: r.image ?? '',
      readyInMinutes: r.readyInMinutes,
      ingredientCount: r.extendedIngredients?.length ?? undefined,
      macros: r.macros,
    }))
}