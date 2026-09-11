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
    {
      id: 'lecture-mots',
      type: 'wordPreview',
      subject: 'mots',
      title: 'Je lis mes mots',
      prompt: 'Lis chaque mot une fois avant de commencer les jeux.',
      words: [],
      stars: 1,
    },
  ],
}
