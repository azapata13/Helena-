import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Activity, WeekContent } from '../types/content'
import { loadRemoteWeekAttempts, saveRemoteWeekAttempt } from '../services/supabaseProgress'
import {
  beginTestAttempt,
  completeWeekAttempt,
  isScoredActivityType,
  loadProgress,
  markActivityComplete,
  markTestActivityComplete,
  mergeRemoteAttempts,
  recordActivityAnswer,
  resetProgress,
  saveProgress,
  type ActivityAnswer,
  type ProgressState,
} from '../storage/progress'

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())

  function updateProgress(makeNext: (current: ProgressState) => ProgressState) {
    setProgress((current) => {
      const next = makeNext(current)
      saveProgress(next)
      return next
    })
  }

  function startTestAttempt(weekId: string) {
    updateProgress((current) => beginTestAttempt(current, weekId))
  }

  function recordAnswer(weekId: string, answer: Omit<ActivityAnswer, 'createdAt'>) {
    updateProgress((current) => recordActivityAnswer(current, weekId, answer))
  }

  function completeActivity(weekId: string, activity: Activity, mode: 'guided' | 'test') {
    updateProgress((current) =>
      mode === 'test'
        ? markTestActivityComplete(current, weekId, activity.id)
        : markActivityComplete(current, weekId, activity.id, activity.stars ?? 2),
    )
  }

  function completeWeek(weekId: string, mode: 'guided' | 'test') {
    setProgress((current) => {
      const result = completeWeekAttempt(current, weekId, mode)
      saveProgress(result.state)
      void saveRemoteWeekAttempt(weekId, result.attempt, result.answers)
      return result.state
    })
  }

  const syncWeek = useCallback((weekId: string) => {
    void loadRemoteWeekAttempts(weekId).then((attempts) => {
      if (attempts.length === 0) return
      setProgress((current) => {
        const next = mergeRemoteAttempts(current, weekId, attempts)
        saveProgress(next)
        return next
      })
    })
  }, [])

  function resetAll() {
    setProgress(resetProgress())
  }

  return { progress, startTestAttempt, recordAnswer, completeActivity, completeWeek, syncWeek, resetAll }
}

export function useWeekProgress(week: WeekContent, progress: ProgressState) {
  return useMemo(() => {
    const meta = progress.weekMeta[week.id] ?? { completionCount: 0, attempts: [] }
    const mode: 'guided' | 'test' = meta.completionCount > 0 ? 'test' : 'guided'
    const activeAttempt = meta.activeAttempt
    const records = progress.weeks[week.id] ?? {}
    const requiredActivities = week.activities.filter((activity) => activity.required !== false)
    const completed =
      mode === 'test'
        ? requiredActivities.filter((activity) => activeAttempt?.completedActivityIds.includes(activity.id))
        : requiredActivities.filter((activity) => records[activity.id]?.completed)
    const totalStars = Object.values(records).reduce((sum, record) => sum + (record.stars ?? 0), 0)
    const nextActivity =
      mode === 'test'
        ? requiredActivities.find((activity) => !activeAttempt?.completedActivityIds.includes(activity.id)) ?? requiredActivities[0]
        : requiredActivities.find((activity) => !records[activity.id]?.completed) ?? requiredActivities[0]
    const lastAttempt = meta.attempts.at(-1)
    const scoredActivities = week.activities.filter((activity) => isScoredActivityType(activity.type))

    return {
      mode,
      meta,
      records,
      activeAttempt,
      scoredActivities,
      lastAttempt,
      completedCount: completed.length,
      requiredCount: requiredActivities.length,
      isComplete: requiredActivities.length > 0 && completed.length === requiredActivities.length,
      totalStars,
      nextActivity,
      percent: requiredActivities.length ? Math.round((completed.length / requiredActivities.length) * 100) : 0,
    }
  }, [progress, week])
}

export function useSyncWeekProgress(weekId: string, syncWeek: (weekId: string) => void) {
  useEffect(() => {
    syncWeek(weekId)
  }, [syncWeek, weekId])
}
