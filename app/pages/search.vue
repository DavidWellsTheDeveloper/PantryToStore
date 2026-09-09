<template>
  <div class="container search">
    <!-- Hero -->
    <section class="hero">
      <p class="eyebrow">Cook with what you have — or what you crave</p>
      <h1>What's for dinner tonight?</h1>
      <p class="hero__lede">Search by your pantry or by a dish you have in mind.</p>
    </section>

    <!-- Search box -->
    <section class="search-panel">
      <div class="tabs" role="tablist" aria-label="Search mode">
        <button
          type="button"
          role="tab"
          :aria-selected="mode === 'pantry'"
          class="tabs__item"
          :class="{ 'tabs__item--active': mode === 'pantry' }"
          @click="setMode('pantry')"
        >
          From my pantry
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="mode === 'dish'"
          class="tabs__item"
          :class="{ 'tabs__item--active': mode === 'dish' }"
          @click="setMode('dish')"
        >
          Search dishes
        </button>
      </div>

      <div class="box">
        <!-- Pantry: chip input -->
        <div v-if="mode === 'pantry'" class="pantry">
          <span
            v-for="ing in ingredients"
            :key="ing"
            class="chip pantry__chip"
          >
            {{ ing }}
            <button
              type="button"
              class="chip__remove"
              :aria-label="`Remove ${ing}`"
              @click="ingredients = ingredients.filter((x) => x !== ing)"
            >
              ×
            </button>
          </span>
          <input
            v-model="draft"
            type="text"
            class="box__input"
            :placeholder="ingredients.length ? 'Add another…' : 'tomato, basil, garlic…'"
            @keydown="onPantryKey"
          />
        </div>

        <!-- Dish: free text -->
        <div v-else class="dish">
          <span class="dish__icon" aria-hidden="true">⌕</span>
          <input
            v-model="query"
            type="text"
            class="box__input"
            placeholder="chicken tikka, lemon pasta, banana bread…"
            @keydown.enter.prevent="runSearch"
          />
        </div>

        <div class="box__actions">
          <button type="button" class="btn btn--outline btn--sm" @click="filtersOpen = !filtersOpen">
            Filters
            <span v-if="activeFilters.length" class="badge">{{ activeFilters.length }}</span>
          </button>
          <button
            type="button"
            class="btn btn--primary btn--sm"
            :disabled="pending || !canSearch"
            @click="runSearch"
          >
            {{ pending ? 'Searching…' : 'Find recipes' }}
          </button>
        </div>
      </div>

      <!-- Active filter chips -->
      <div v-if="activeFilters.length" class="active-row">
        <button
          v-for="f in activeFilters"
          :key="f.key"
          type="button"
          class="chip active-row__chip"
          :aria-label="`Remove filter: ${f.label}`"
          @click="f.clear()"
        >
          {{ f.label }} <span aria-hidden="true">×</span>
        </button>
        <button type="button" class="link-plain" @click="clearAllFilters">Clear all</button>
      </div>

      <p class="hint">
        {{ mode === 'pantry' ? 'Press Enter or comma to add an ingredient.' : 'Search by dish name. Add filters for diet, time and more.' }}
      </p>
    </section>

    <!-- Filter panel -->
    <section v-if="filtersOpen" class="filters card">
      <div class="field">
        <label class="field__label" for="f-diet">Diet</label>
        <select id="f-diet" v-model="diet" class="select">
          <option value="">Any</option>
          <option v-for="d in DIETS" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>

      <div class="field">
        <span class="field__label">Avoid (allergens)</span>
        <div class="chipgrid">
          <label v-for="i in INTOLERANCES" :key="i" class="check">
            <input
              type="checkbox"
              :checked="intolerances.includes(i)"
              @change="toggle('intolerances', i)"
            />
            <span>{{ i }}</span>
          </label>
        </div>
      </div>

      <div class="field">
        <label class="field__label" for="f-type">Meal type</label>
        <select id="f-type" v-model="type" class="select">
          <option value="">Any</option>
          <option v-for="t in TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <div class="field">
        <span class="field__label">Cuisines</span>
        <div class="chipgrid chipgrid--scroll">
          <label v-for="c in CUISINES" :key="c" class="check">
            <input type="checkbox" :checked="cuisines.includes(c)" @change="toggle('cuisines', c)" />
            <span>{{ c }}</span>
          </label>
        </div>
      </div>

      <div class="field">
        <span class="field__label">Max cook time</span>
        <div class="range">
          <input
            type="range"
            min="0"
            max="120"
            step="5"
            v-model.number="maxTime"
            list="time-ticks"
          />
          <span>{{ maxTime > 0 ? `${maxTime} min` : 'Any' }}</span>
        </div>
      </div>

      <div class="field">
        <span class="field__label">Max ingredients</span>
        <div class="range">
          <input type="range" min="0" max="20" step="1" v-model.number="maxIng" />
          <span>{{ maxIng > 0 ? `≤ ${maxIng}` : 'Any' }}</span>
        </div>
      </div>

      <div class="filters__footer">
        <button type="button" class="btn btn--outline btn--sm" @click="clearAllFilters">Clear all</button>
        <button type="button" class="btn btn--primary btn--sm" @click="applyFilters">Apply</button>
      </div>
    </section>

    <!-- Results -->
    <section class="results">
      <template v-if="pending">
        <div class="recipe-grid" aria-busy="true">
          <div v-for="n in 6" :key="n" class="skeleton skeleton--card"></div>
        </div>
      </template>

      <template v-else-if="error">
        <p class="results__empty">Couldn't reach the recipe service. Try again.</p>
      </template>

      <template v-else-if="results.length">
        <h2 class="results__title">Recipes for you</h2>
        <div class="recipe-grid">
          <RecipeCard v-for="r in results" :key="r.id" :recipe="r" />
        </div>
      </template>

      <template v-else-if="searched">
        <p class="results__empty">
          {{
            mode === 'pantry'
              ? 'No matches. Try a more common ingredient or loosen your filters.'
              : 'No recipes match. Try a different name or remove a filter.'
          }}
        </p>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { FoundRecipe } from '../utils/spoonacular.types'
import { spoonacularFetch } from '../composables/useSpoonacular'

type Mode = 'pantry' | 'dish'

const DIETS = ['Gluten Free', 'Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Whole30', 'Ketogenic']
const INTOLERANCES = ['Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat']
const TYPES = ['main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'snack', 'drink']
const CUISINES = [
  'African', 'American', 'Asian', 'British', 'Cajun', 'Caribbean', 'Chinese',
  'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 'Irish',
  'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean',
  'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese',
]

const toList = (v: unknown): string[] =>
  typeof v === 'string' ? v.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : []
const toNum = (v: unknown): number => {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}

const route = useRoute()
const router = useRouter()

const mode = ref<Mode>(route.query.mode === 'dish' ? 'dish' : 'pantry')
const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const ingredients = ref<string[]>(toList(route.query.ing))
const draft = ref('')
const diet = ref(typeof route.query.diet === 'string' ? route.query.diet : '')
const intolerances = ref<string[]>(toList(route.query.intol))
const type = ref(typeof route.query.type === 'string' ? route.query.type : '')
const cuisines = ref<string[]>(toList(route.query.cuisines))
const maxTime = ref(toNum(route.query.time))
const maxIng = ref(toNum(route.query.maxIng))
const filtersOpen = ref(false)

const results = ref<FoundRecipe[]>([])
const pending = ref(false)
const error = ref(false)
const searched = ref(false)
let internal = false

function toggle(list: 'intolerances' | 'cuisines', value: string) {
  const ref = list === 'intolerances' ? intolerances : cuisines
  ref.value = ref.value.includes(value)
    ? ref.value.filter((x) => x !== value)
    : [...ref.value, value]
}

const activeFilters = computed(() => {
  const list: { key: string; label: string; clear: () => void }[] = []
  if (diet.value) list.push({ key: 'diet', label: diet.value, clear: () => (diet.value = '') })
  for (const i of intolerances.value) list.push({ key: `intol-${i}`, label: `No ${i}`, clear: () => (intolerances.value = intolerances.value.filter((x) => x !== i)) })
  if (type.value) list.push({ key: 'type', label: type.value, clear: () => (type.value = '') })
  for (const c of cuisines.value) list.push({ key: `cui-${c}`, label: c, clear: () => (cuisines.value = cuisines.value.filter((x) => x !== c)) })
  if (maxTime.value > 0) list.push({ key: 'time', label: `≤ ${maxTime.value} min`, clear: () => (maxTime.value = 0) })
  if (maxIng.value > 0) list.push({ key: 'maxIng', label: `≤ ${maxIng.value} ingredients`, clear: () => (maxIng.value = 0) })
  return list
})

const canSearch = computed(() =>
  mode.value === 'pantry'
    ? ingredients.value.length > 0 || draft.value.trim().length > 0
    : query.value.trim().length > 0 || activeFilters.value.length > 0,
)

function setMode(next: Mode) {
  if (mode.value === next) return
  mode.value = next
  if (next === 'pantry' && ingredients.value.length === 0 && query.value) {
    ingredients.value = [query.value.trim().toLowerCase()]
    draft.value = ''
  }
  if (next === 'dish' && !query.value && ingredients.value.length) {
    query.value = ingredients.value.join(', ')
  }
}

function onPantryKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    if (draft.value.trim()) {
      const v = draft.value.trim().toLowerCase()
      if (!ingredients.value.includes(v)) ingredients.value.push(v)
      draft.value = ''
    } else {
      runSearch()
    }
  } else if (e.key === 'Backspace' && !draft.value && ingredients.value.length) {
    ingredients.value = ingredients.value.slice(0, -1)
  }
}

function clearAllFilters() {
  diet.value = ''
  intolerances.value = []
  type.value = ''
  cuisines.value = []
  maxTime.value = 0
  maxIng.value = 0
}

function applyFilters() {
  filtersOpen.value = false
  runSearch()
}

function payload() {
  const list = mode.value === 'pantry' && draft.value.trim()
    ? [...ingredients.value, draft.value.trim().toLowerCase()]
    : ingredients.value
  const p: Record<string, string> = { mode: mode.value }
  const q = mode.value === 'dish' ? query.value.trim() : ''
  if (q) p.q = q
  if (mode.value === 'pantry' && list.length) p.ing = list.join(',')
  if (diet.value) p.diet = diet.value
  if (intolerances.value.length) p.intol = intolerances.value.join(',')
  if (type.value) p.type = type.value
  if (cuisines.value.length) p.cuisines = cuisines.value.join(',')
  if (maxTime.value > 0) p.time = String(maxTime.value)
  if (maxIng.value > 0) p.maxIng = String(maxIng.value)
  return p
}

async function churn() {
  const now = payload()
  const qs = new URLSearchParams(now)
  pending.value = true
  error.value = false
  try {
    results.value = await spoonacularFetch<FoundRecipe[]>(`/api/spoonacular/search?${qs.toString()}`)
    searched.value = true
  } catch {
    error.value = true
    searched.value = true
  } finally {
    pending.value = false
  }
}

async function runSearch() {
  if (mode.value === 'pantry') {
    if (draft.value.trim()) {
      const v = draft.value.trim().toLowerCase()
      if (!ingredients.value.includes(v)) ingredients.value.push(v)
      draft.value = ''
    }
  }
  const p = payload()
  internal = true
  await router.replace({ query: p })
  internal = false
  await churn()
}

watch(
  () => route.query,
  async (q) => {
    if (internal) return
    const fromUrl = {
      mode: q.mode === 'dish' ? ('dish' as Mode) : ('pantry' as Mode),
      q: typeof q.q === 'string' ? q.q : '',
      ing: toList(q.ing),
      diet: typeof q.diet === 'string' ? q.diet : '',
      intol: toList(q.intol),
      type: typeof q.type === 'string' ? q.type : '',
      cuisines: toList(q.cuisines),
      time: toNum(q.time),
      maxIng: toNum(q.maxIng),
    }
    mode.value = fromUrl.mode
    query.value = fromUrl.q
    ingredients.value = fromUrl.ing
    diet.value = fromUrl.diet
    intolerances.value = fromUrl.intol
    type.value = fromUrl.type
    cuisines.value = fromUrl.cuisines
    maxTime.value = fromUrl.time
    maxIng.value = fromUrl.maxIng
    if (
      fromUrl.mode === 'pantry'
        ? fromUrl.ing.length > 0
        : fromUrl.q.trim() || Math.max(fromUrl.time, fromUrl.maxIng) > 0 || fromUrl.diet || fromUrl.intol.length || fromUrl.type || fromUrl.cuisines.length
    ) {
      await churn()
    }
  },
)

onMounted(() => {
  if (ingredients.value.length || query.value.trim() || activeFilters.value.length) churn()
})

const searchActive = computed(
  () =>
    mode.value === 'pantry'
      ? ingredients.value.length > 0
      : query.value.trim() || activeFilters.value.length > 0,
)

useSeoMeta({
  title: computed(() => (searchActive.value ? 'Search results' : 'Search')),
  description:
    'Search recipes by what is in your pantry or by dish name. Filter by diet, allergens, cook time, and ingredient count.',
  robots: computed(() => (searchActive.value ? 'noindex, nofollow' : 'index, follow')),
})
</script>

<style scoped>
.hero {
  max-width: 38rem;
  margin-inline: auto;
  text-align: center;
  padding: 1rem 0 2rem;
}

.hero h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin: 0.5rem 0 0;
}

.hero__lede {
  color: var(--muted-foreground);
  margin: 0.75rem 0 0;
}

.search-panel {
  max-width: 42rem;
  margin-inline: auto;
}

.box {
  margin-top: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.25rem;
  background: var(--secondary);
  border-radius: var(--radius);
  padding: 0.25rem;
}

.tabs__item {
  flex: 1;
  border: 0;
  background: transparent;
  border-radius: calc(var(--radius) - 0.15rem);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--muted-foreground);
}

.tabs__item--active {
  background: var(--card);
  color: var(--foreground);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
}

.pantry,
.dish {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 2.5rem;
  padding: 0 0.25rem;
}

.pantry__chip {
  background: var(--secondary);
}

.chip__remove {
  border: 0;
  background: transparent;
  line-height: 1;
  color: var(--muted-foreground);
  font-size: 1rem;
  padding: 0 0.125rem;
}

.chip__remove:hover {
  color: var(--foreground);
}

.dish__icon {
  color: var(--muted-foreground);
  font-size: 1.25rem;
  line-height: 1;
}

.box__input {
  flex: 1;
  min-width: 8rem;
  border: 0;
  background: transparent;
  font: inherit;
  color: var(--foreground);
  padding: 0.25rem 0;
}

.box__input:focus {
  outline: 0;
}

.box__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.1rem;
  height: 1.1rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: var(--primary);
  color: var(--primary-contrast);
  font-size: 0.6875rem;
  line-height: 1;
}

.active-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.75rem;
}

.active-row__chip {
  color: var(--foreground);
}

.active-row__chip:hover {
  background: var(--secondary);
  text-decoration: none;
}

.link-plain {
  border: 0;
  background: transparent;
  color: var(--muted-foreground);
  font-size: 0.8125rem;
  padding: 0.25rem;
}

.link-plain:hover {
  color: var(--foreground);
}

.hint {
  margin: 0.75rem 0 0;
  text-align: center;
  font-size: 0.75rem;
  color: var(--muted-foreground);
}

/* Filters */
.filters {
  max-width: 42rem;
  margin: 1rem auto 0;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field__label {
  font-size: 0.8125rem;
  font-weight: 500;
}

.select {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--background);
  color: var(--foreground);
  font: inherit;
  font-size: 0.875rem;
  padding: 0.5rem 0.625rem;
}

.chipgrid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.chipgrid--scroll {
  max-height: 11rem;
  overflow-y: auto;
}

.check {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.25rem 0.625rem;
  cursor: pointer;
  color: var(--muted-foreground);
}

.check:has(input:checked) {
  background: var(--secondary);
  color: var(--foreground);
  border-color: var(--sand);
}

.check input {
  accent-color: var(--primary);
}

.range {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.range input[type='range'] {
  flex: 1;
  accent-color: var(--primary);
}

.range span {
  min-width: 4.2rem;
  text-align: right;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  font-variant-numeric: tabular-nums;
}

.filters__footer {
  display: flex;
  gap: 0.625rem;
  justify-content: flex-end;
}

/* Results */
.results {
  margin-top: 2.5rem;
}

.results__title {
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
}

.results__empty {
  text-align: center;
  color: var(--muted-foreground);
  padding: 2rem 0;
}

.skeleton--card {
  height: 340px;
}
</style>