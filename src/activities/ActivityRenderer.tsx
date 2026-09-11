import type { Activity, WeekContent } from '../types/content'
import { WordActivityView } from './WordActivities'
import {
  AlphabeticalActivityView,
  NounSortActivityView,
  NumberDictationActivityView,
  NumberSequenceActivityView,
  ReadingActivityView,
  WritingActivityView,
} from './OtherActivities'

type Props = {
  week: WeekContent
  activity: Activity
  onBack: () => void
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
    case 'reading':
      return <ReadingActivityView {...props} activity={activity} />
    case 'writing':
      return <WritingActivityView {...props} activity={activity} />
  }
}
