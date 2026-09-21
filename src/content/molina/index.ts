import type { WeekContent } from '../../types/content'
import { molinaWeek20260914 } from './weeks/2026-09-14'
import { molinaWeek20260921 } from './weeks/2026-09-21'

export const molinaWeeks: WeekContent[] = [molinaWeek20260914, molinaWeek20260921].sort((a, b) =>
  a.startDate.localeCompare(b.startDate),
)
