export type ActivityProgress = {
  completed: boolean
  attempts: number
  score: number
  stars: number
  lastPlayedAt?: string
}

export type ProgressState = {
  weeks: Record<string, Record<string, ActivityProgress>>
}

const KEY = 'elena-progress-v1'
const emptyState: ProgressState = { weeks: {} }
let memoryState: ProgressState = emptyState

export function loadProgress(): ProgressState {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return memoryState
    const parsed = JSON.parse(raw) as ProgressState
    memoryState = { weeks: parsed.weeks ?? {} }
    return memoryState
  } catch {
    return memoryState
  }
}

export function saveProgress(state: ProgressState): void {
  memoryState = state
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Memory state keeps the app usable when browser storage is unavailable.
  }
}

export function markActivityComplete(
  state: ProgressState,
  weekId: string,
  activityId: string,
  stars: number,
): ProgressState {
  const current = state.weeks[weekId]?.[activityId]
  return {
    weeks: {
      ...state.weeks,
      [weekId]: {
        ...state.weeks[weekId],
        [activityId]: {
          completed: true,
          attempts: (current?.attempts ?? 0) + 1,
          score: 1,
          stars: Math.max(current?.stars ?? 0, stars),
          lastPlayedAt: new Date().toISOString(),
        },
      },
    },
  }
}

export function resetProgress(): ProgressState {
  memoryState = emptyState
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    // Ignore storage reset failures.
  }
  return memoryState
}
