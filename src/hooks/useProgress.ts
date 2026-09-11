import { useMemo, useState } from 'react'
import type { Activity, WeekContent } from '../types/content'
import {
  loadProgress,
  markActivityComplete,
  resetProgress,
  saveProgress,
  type ProgressState,
} from '../storage/progress'

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())

  function completeActivity(weekId: string, activity: Activity) {
    setProgress((current) => {
      const next = markActivityComplete(current, weekId, activity.id, activity.stars ?? 2)
      saveProgress(next)
      return next
    })
  }

  function resetAll() {
    setProgress(resetProgress())
  }

  return { progress, completeActivity, resetAll }
}

export function useWeekProgress(week: WeekContent, progress: ProgressState) {
  return useMemo(() => {
    const records = progress.weeks[week.id] ?? {}
    const requiredActivities = week.activities.filter((activity) => activity.required !== false)
    const completed = requiredActivities.filter((activity) => records[activity.id]?.completed)
    const totalStars = Object.values(records).reduce((sum, record) => sum + (record.stars ?? 0), 0)
    const nextActivity =
      requiredActivities.find((activity) => !records[activity.id]?.completed) ?? requiredActivities[0]

    return {
      records,
      completedCount: completed.length,
      requiredCount: requiredActivities.length,
      isComplete: requiredActivities.length > 0 && completed.length === requiredActivities.length,
      totalStars,
      nextActivity,
      percent: requiredActivities.length ? Math.round((completed.length / requiredActivities.length) * 100) : 0,
    }
  }, [progress, week])
}
