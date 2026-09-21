import type { WeekContent } from '../../types/content'
import { molinaWeek20260914 } from './weeks/2026-09-14'

export const molinaWeeks: WeekContent[] = [molinaWeek20260914].sort((a, b) =>
  a.startDate.localeCompare(b.startDate),
)
