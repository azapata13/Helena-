import type { WeekContent } from '../types/content'
import { week20260907 } from './weeks/2026-09-07'
import { week20260914 } from './weeks/2026-09-14'

export const weeks: WeekContent[] = [week20260907, week20260914].sort((a, b) =>
  a.startDate.localeCompare(b.startDate),
)

export function getCurrentWeek(today = new Date()): WeekContent {
  const markedCurrent = weeks.find((week) => week.status === 'current')
  if (markedCurrent) return markedCurrent

  const date = today.toISOString().slice(0, 10)
  const active = weeks.find((week) => week.startDate <= date && week.endDate >= date)
  if (active) return active

  const pastOrCurrent = weeks.filter((week) => week.startDate <= date)
  return pastOrCurrent.at(-1) ?? weeks.at(-1)!
}
