export function hashSeed(value: string): number {
  let hash = 2166136261
  for (const char of value) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function seededRandom(seed: number) {
  let state = seed || 1
  return () => {
    state = Math.imul(1664525, state) + 1013904223
    return ((state >>> 0) % 10000) / 10000
  }
}

export function shuffle<T>(items: T[], seed: string): T[] {
  const copy = [...items]
  const random = seededRandom(hashSeed(seed))
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const value = copy[index]
    copy[index] = copy[swapIndex]
    copy[swapIndex] = value
  }
  return copy
}

export function pickRoundItems<T>(items: T[], count: number, seed: string): T[] {
  return shuffle(items, seed).slice(0, Math.min(count, items.length))
}
