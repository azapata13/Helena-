import type { WeekContent } from '../types/content'
import { week20260907 } from './weeks/2026-09-07'
import { week20260914 } from './weeks/2026-09-14'
import { week20260921 } from './weeks/2026-09-21'
import { week20260928 } from './weeks/2026-09-28'

export const weeks: WeekContent[] = [week20260907, week20260914, week20260921, week20260928].sort((a, b) =>
  a.startDate.localeCompare(b.startDate),
)

export function getCurrentWeek(today = new Date(), availableWeeks = weeks): WeekContent {
  const markedCurrent = availableWeeks.find((week) => week.status === 'current')
  if (markedCurrent) return markedCurrent

  const date = today.toISOString().slice(0, 10)
  const active = availableWeeks.find((week) => week.startDate <= date && week.endDate >= date)
  if (active) return active

  const pastOrCurrent = availableWeeks.filter((week) => week.startDate <= date)
  return pastOrCurrent.at(-1) ?? availableWeeks.at(-1)!
}
