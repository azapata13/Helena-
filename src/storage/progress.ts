export type ActivityProgress = {
  completed: boolean
  attempts: number
  score: number
  stars: number
  lastPlayedAt?: string
}

export type ActivityAnswer = {
  activityId: string
  questionId: string
  isCorrect: boolean
  answer: string
  expectedAnswer: string
  createdAt: string
}

export type WeekAttemptSummary = {
  attemptNumber: number
  mode: 'guided' | 'test'
  startedAt: string
  completedAt: string
  correctAnswers: number
  totalQuestions: number
}

export type ActiveWeekAttempt = {
  mode: 'test'
  startedAt: string
  completedActivityIds: string[]
  answers: ActivityAnswer[]
}

export type WeekProgressMeta = {
  completionCount: number
  attempts: WeekAttemptSummary[]
  activeAttempt?: ActiveWeekAttempt
}

export type ProgressState = {
  weeks: Record<string, Record<string, ActivityProgress>>
  weekMeta: Record<string, WeekProgressMeta>
}

const KEY = 'elena-progress-v1'
const emptyState: ProgressState = { weeks: {}, weekMeta: {} }
let memoryState: ProgressState = emptyState

export function loadProgress(): ProgressState {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return memoryState
    const parsed = JSON.parse(raw) as ProgressState
    memoryState = { weeks: parsed.weeks ?? {}, weekMeta: parsed.weekMeta ?? {} }
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

export function isScoredActivityType(type: string): boolean {
  return !['reading', 'wordPreview', 'writing'].includes(type)
}

export function markActivityComplete(
  state: ProgressState,
  weekId: string,
  activityId: string,
  stars: number,
): ProgressState {
  const current = state.weeks[weekId]?.[activityId]
  return {
    ...state,
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

export function beginTestAttempt(state: ProgressState, weekId: string): ProgressState {
  const meta = state.weekMeta[weekId]
  if (meta?.activeAttempt) return state

  return {
    ...state,
    weekMeta: {
      ...state.weekMeta,
      [weekId]: {
        completionCount: meta?.completionCount ?? 0,
        attempts: meta?.attempts ?? [],
        activeAttempt: {
          mode: 'test',
          startedAt: new Date().toISOString(),
          completedActivityIds: [],
          answers: [],
        },
      },
    },
  }
}

export function markTestActivityComplete(
  state: ProgressState,
  weekId: string,
  activityId: string,
): ProgressState {
  const withAttempt = beginTestAttempt(state, weekId)
  const meta = withAttempt.weekMeta[weekId]
  const activeAttempt = meta?.activeAttempt
  if (!meta || !activeAttempt || activeAttempt.completedActivityIds.includes(activityId)) return withAttempt

  return {
    ...withAttempt,
    weekMeta: {
      ...withAttempt.weekMeta,
      [weekId]: {
        ...meta,
        activeAttempt: {
          ...activeAttempt,
          completedActivityIds: [...activeAttempt.completedActivityIds, activityId],
        },
      },
    },
  }
}

export function recordActivityAnswer(
  state: ProgressState,
  weekId: string,
  answer: Omit<ActivityAnswer, 'createdAt'>,
): ProgressState {
  const withAttempt = beginTestAttempt(state, weekId)
  const meta = withAttempt.weekMeta[weekId]
  const activeAttempt = meta?.activeAttempt
  if (!meta || !activeAttempt) return withAttempt

  const alreadyRecorded = activeAttempt.answers.some(
    (item) => item.activityId === answer.activityId && item.questionId === answer.questionId,
  )
  if (alreadyRecorded) return withAttempt

  return {
    ...withAttempt,
    weekMeta: {
      ...withAttempt.weekMeta,
      [weekId]: {
        ...meta,
        activeAttempt: {
          ...activeAttempt,
          answers: [...activeAttempt.answers, { ...answer, createdAt: new Date().toISOString() }],
        },
      },
    },
  }
}

export function completeWeekAttempt(
  state: ProgressState,
  weekId: string,
  mode: 'guided' | 'test',
): { state: ProgressState; attempt: WeekAttemptSummary; answers: ActivityAnswer[] } {
  const meta = state.weekMeta[weekId] ?? { completionCount: 0, attempts: [] }
  const activeAttempt = mode === 'test' ? meta.activeAttempt : undefined
  const answers = activeAttempt?.answers ?? []
  const correctAnswers = answers.filter((answer) => answer.isCorrect).length
  const totalQuestions = answers.length
  const attempt: WeekAttemptSummary = {
    attemptNumber: meta.completionCount + 1,
    mode,
    startedAt: activeAttempt?.startedAt ?? new Date().toISOString(),
    completedAt: new Date().toISOString(),
    correctAnswers,
    totalQuestions,
  }

  const nextState: ProgressState = {
    ...state,
    weekMeta: {
      ...state.weekMeta,
      [weekId]: {
        completionCount: meta.completionCount + 1,
        attempts: [...meta.attempts, attempt],
      },
    },
  }

  return { state: nextState, attempt, answers }
}

export function mergeRemoteAttempts(state: ProgressState, weekId: string, attempts: WeekAttemptSummary[]): ProgressState {
  if (attempts.length === 0) return state
  const current = state.weekMeta[weekId] ?? { completionCount: 0, attempts: [] }
  const known = new Set(current.attempts.map((attempt) => `${attempt.mode}-${attempt.completedAt}`))
  const merged = [
    ...current.attempts,
    ...attempts.filter((attempt) => !known.has(`${attempt.mode}-${attempt.completedAt}`)),
  ].sort((a, b) => a.attemptNumber - b.attemptNumber || a.completedAt.localeCompare(b.completedAt))

  return {
    ...state,
    weekMeta: {
      ...state.weekMeta,
      [weekId]: {
        ...current,
        completionCount: Math.max(current.completionCount, merged.length),
        attempts: merged.map((attempt, index) => ({ ...attempt, attemptNumber: index + 1 })),
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
