import { useMemo, useState } from 'react'
import type { ActivityAnswer } from '../storage/progress'
import type { ChoiceQuizActivity, WeekContent } from '../types/content'
import { shuffle } from '../utils/random'
import { ActivityShell } from './ActivityShell'

type Props = {
  week: WeekContent
  activity: ChoiceQuizActivity
  mode: 'guided' | 'test'
  onBack: () => void
  onAnswer: (answer: Omit<ActivityAnswer, 'createdAt'>) => void
  onComplete: () => void
}

export function ChoiceQuizActivityView({ week, activity, mode, onBack, onAnswer, onComplete }: Props) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [feedback, setFeedback] = useState<'success' | 'try' | ''>('')
  const [feedbackText, setFeedbackText] = useState('')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const item = activity.items[roundIndex]
  const choices = useMemo(
    () => shuffle(item.choices, `${week.id}-${activity.id}-${roundIndex}`),
    [activity.id, item.choices, roundIndex, week.id],
  )
  const isComplete = mode === 'test' ? feedback !== '' : feedback === 'success'

  function choose(choice: string) {
    const isCorrect = choice === item.answer
    const nextCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0)
    setCorrectAnswers(nextCorrectAnswers)
    onAnswer({
      activityId: activity.id,
      questionId: `${activity.id}-${roundIndex + 1}`,
      isCorrect,
      answer: choice,
      expectedAnswer: item.answer,
    })
    setFeedback(isCorrect ? 'success' : 'try')
    if (mode === 'test' && roundIndex >= activity.items.length - 1) {
      setFeedbackText(`Bloc terminé : ${nextCorrectAnswers}/${activity.items.length}.`)
    } else {
      setFeedbackText(mode === 'test' ? '' : isCorrect ? 'Bravo !' : item.hint)
    }
  }

  function next() {
    if (roundIndex >= activity.items.length - 1) onComplete()
    else {
      setRoundIndex((current) => current + 1)
      setFeedback('')
      setFeedbackText('')
    }
  }

  return (
    <ActivityShell
      week={week}
      activity={activity}
      roundLabel={`${roundIndex + 1} / ${activity.items.length}`}
      feedback={feedback}
      feedbackText={feedbackText}
      isComplete={isComplete}
      onBack={onBack}
      onNext={next}
    >
      <h1 className="big-question">{item.question}</h1>
      <div className="choice-grid">
        {choices.map((choice) => (
          <button className="choice-button" type="button" key={choice} disabled={isComplete} onClick={() => choose(choice)}>
            {choice}
          </button>
        ))}
      </div>
    </ActivityShell>
  )
}
