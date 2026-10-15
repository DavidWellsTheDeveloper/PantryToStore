/** Deterministic seeded shuffle using Mulberry32-like algorithm.
 * Seeded from date string (YYYY-MM-DD) for daily rotation on static builds.
 */
export function seededShuffle<T>(arr: T[], seedStr: string): T[] {
  const parts = seedStr.split('-')
  let s = parts.reduce((a, b) => a * parseInt(b || '1'), 1)
  const copy = [...arr]
  let seed = Math.abs(s % 2147483647)
  if (seed < 1) seed = 123456789
  for (let i = copy.length - 1; i > 0; i--) {
    seed = (seed * 16807) % 2147483647
    const j = Math.floor((seed / 2147483647) * (i + 1))
    const tmp = copy[i]!
    copy[i] = copy[j]!
    copy[j] = tmp
  }
  return copy
}

export function getDateSeed(): string {
  return new Date().toISOString().slice(0, 10)
}

export function getDateSeedPlusDay(): string {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}
