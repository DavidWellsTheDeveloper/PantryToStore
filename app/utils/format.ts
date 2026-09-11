/** Human-friendly duration, e.g. 35 -> "35 min", 85 -> "1 hr 25 min", 360 -> "6 hr". */
export function formatMinutes(min?: number): string {
  if (min == null || !Number.isFinite(min)) return ''
  const rounded = Math.round(min)
  if (rounded < 60) return `${rounded} min`
  const hours = Math.floor(rounded / 60)
  const minutes = Math.round(rounded % 60)
  return minutes ? `${hours} hr ${minutes} min` : `${hours} hr`
}