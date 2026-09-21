import type { Activity, WeekContent } from '../types/content'
import type { ActivityAnswer } from '../storage/progress'
import { WordActivityView } from './WordActivities'
import {
  AlphabeticalActivityView,
  NounSortActivityView,
  NumberDictationActivityView,
  NumberSequenceActivityView,
  ReadingActivityView,
  WordPreviewActivityView,
  WritingActivityView,
} from './OtherActivities'
import { NumberNeighborActivityView, VowelSoundActivityView } from './LearningActivities'

type Props = {
  week: WeekContent
  activity: Activity
  mode: 'guided' | 'test'
  onBack: () => void
  onAnswer: (answer: Omit<ActivityAnswer, 'createdAt'>) => void
  onComplete: () => void
}

export function ActivityRenderer(props: Props) {
  const { activity } = props
  switch (activity.type) {
    case 'missingLetters':
    case 'listenChoose':
    case 'buildWord':
    case 'findWord':
    case 'miniDictee':
      return <WordActivityView {...props} activity={activity} />
    case 'alphabeticalOrder':
      return <AlphabeticalActivityView {...props} activity={activity} />
    case 'nounSort':
      return <NounSortActivityView {...props} activity={activity} />
    case 'numberSequence':
      return <NumberSequenceActivityView {...props} activity={activity} />
    case 'numberDictation':
      return <NumberDictationActivityView {...props} activity={activity} />
    case 'numberNeighbor':
      return <NumberNeighborActivityView {...props} activity={activity} />
    case 'vowelSound':
      return <VowelSoundActivityView {...props} activity={activity} />
    case 'reading':
      return <ReadingActivityView {...props} activity={activity} />
    case 'wordPreview':
      return <WordPreviewActivityView {...props} activity={activity} />
    case 'writing':
      return <WritingActivityView {...props} activity={activity} />
  }
}
