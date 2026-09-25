export type Subject = 'lecture' | 'mots' | 'ecriture' | 'maths' | 'grammaire'

export type ActivityType =
  | 'missingLetters'
  | 'listenChoose'
  | 'buildWord'
  | 'findWord'
  | 'miniDictee'
  | 'alphabeticalOrder'
  | 'nounSort'
  | 'numberSequence'
  | 'numberDictation'
  | 'numberNeighbor'
  | 'numberParity'
  | 'vowelSound'
  | 'choiceQuiz'
  | 'reading'
  | 'wordPreview'
  | 'writing'

export type BaseActivity = {
  id: string
  type: ActivityType
  subject: Subject
  title: string
  instruction?: string
  required?: boolean
  stars?: number
}

export type WordActivity = BaseActivity & {
  type: 'missingLetters' | 'listenChoose' | 'buildWord' | 'findWord' | 'miniDictee'
  words: string[]
  rounds?: number
}

export type AlphabeticalOrderActivity = BaseActivity & {
  type: 'alphabeticalOrder'
  sets: string[][]
}

export type NounSortActivity = BaseActivity & {
  type: 'nounSort'
  items: Array<{
    text: string
    answer: 'proper' | 'common'
    hint: 'endroit' | 'personne' | 'animal' | 'objet'
  }>
  rounds?: number
}

export type NumberSequenceActivity = BaseActivity & {
  type: 'numberSequence'
  min: number
  max: number
  steps: number[]
  rounds?: number
  challenge?: {
    min: number
    max: number
    steps: number[]
  }
}

export type NumberDictationActivity = BaseActivity & {
  type: 'numberDictation'
  min: number
  max: number
  numbers?: number[]
  rounds?: number
}

export type NumberNeighborActivity = BaseActivity & {
  type: 'numberNeighbor'
  min: number
  max: number
  rounds?: number
  challenge?: {
    min: number
    max: number
  }
}

export type NumberParityActivity = BaseActivity & {
  type: 'numberParity'
  min: number
  max: number
  rounds?: number
  challenge?: {
    min: number
    max: number
  }
}

export type VowelSoundActivity = BaseActivity & {
  type: 'vowelSound'
  items: Array<{
    word: string
    vowel: 'a' | 'e' | 'i' | 'o' | 'u' | 'y'
    answer: boolean
  }>
  rounds?: number
  challengeItem?: {
    word: string
    vowel: 'a' | 'e' | 'i' | 'o' | 'u' | 'y'
    answer: boolean
  }
}

export type ChoiceQuizActivity = BaseActivity & {
  type: 'choiceQuiz'
  items: Array<{
    question: string
    choices: string[]
    answer: string
    hint: string
  }>
}

export type ReadingActivity = BaseActivity & {
  type: 'reading'
  prompt: string
}

export type WordPreviewActivity = BaseActivity & {
  type: 'wordPreview'
  words: string[]
  prompt?: string
}

export type WritingActivity = BaseActivity & {
  type: 'writing'
  prompt: string
  checklist: string[]
}

export type Activity =
  | WordActivity
  | AlphabeticalOrderActivity
  | NounSortActivity
  | NumberSequenceActivity
  | NumberDictationActivity
  | NumberNeighborActivity
  | NumberParityActivity
  | VowelSoundActivity
  | ChoiceQuizActivity
  | ReadingActivity
  | WordPreviewActivity
  | WritingActivity

export type WeekContent = {
  id: string
  title: string
  startDate: string
  endDate: string
  status?: 'past' | 'current' | 'future'
  summary: {
    reading?: string
    vocabulary?: string
    writing?: string
    math?: string
    grammar?: string
  }
  vocabulary?: string[]
  reminders?: string[]
  activities: Activity[]
}
