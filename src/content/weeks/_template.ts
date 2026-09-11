import type { WeekContent } from '../../types/content'

export const weekTemplate: WeekContent = {
  id: 'YYYY-MM-DD',
  title: 'Semaine du ...',
  startDate: 'YYYY-MM-DD',
  endDate: 'YYYY-MM-DD',
  status: 'future',
  summary: {},
  vocabulary: [],
  activities: [
    {
      id: 'lecture',
      type: 'reading',
      subject: 'lecture',
      title: 'Lecture',
      prompt: 'Lis ton livre.',
      stars: 2,
    },
  ],
}
