import { useMemo, useState } from 'react'
import { AudioButton } from '../components/AudioButton'
import type { ActivityAnswer } from '../storage/progress'
import type { Activity, NumberNeighborActivity, NumberParityActivity, VowelSoundActivity, WeekContent } from '../types/content'
import { makeNumberNeighbor, makeNumberParity } from '../utils/games'
import { pickRoundItems } from '../utils/random'
import { ActivityShell } from './ActivityShell'

type CommonProps<T extends Activity> = {
  week: WeekContent
  activity: T
  mode: 'guided' | 'test'
  onBack: () => void
  onAnswer: (answer: Omit<ActivityAnswer, 'createdAt'>) => void
  onComplete: () => void
}

export function VowelSoundActivityView({ week, activity, mode, onBack, onAnswer, onComplete }: CommonProps<VowelSoundActivity>) {
  const items = useMemo(() => {
    const firstGradeItems = pickRoundItems(activity.items, activity.rounds ?? activity.items.length, `${week.id}-${activity.id}`)
    return activity.challengeItem ? [...firstGradeItems, activity.challengeItem] : firstGradeItems
  }, [activity, week.id])
  const [roundIndex, setRoundIndex] = useState(0)
  const [feedback, setFeedback] = useState<'success' | 'try' | ''>('')
  const [feedbackText, setFeedbackText] = useState('')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const item = items[roundIndex]
  const isChallenge = Boolean(activity.challengeItem) && roundIndex === items.length - 1
  const isComplete = mode === 'test' ? feedback !== '' : feedback === 'success'

  function choose(answer: boolean) {
    const isCorrect = answer === item.answer
    const nextCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0)
    setCorrectAnswers(nextCorrectAnswers)
    onAnswer({
      activityId: activity.id,
      questionId: `${activity.id}-${roundIndex + 1}`,
      isCorrect,
      answer: answer ? 'oui' : 'non',
      expectedAnswer: item.answer ? 'oui' : 'non',
    })
    setFeedback(isCorrect ? 'success' : 'try')
    if (mode === 'test' && roundIndex >= items.length - 1) {
      setFeedbackText(`Bloc terminé : ${nextCorrectAnswers}/${items.length}.`)
    } else {
      setFeedbackText(mode === 'test' ? '' : isCorrect ? 'Bravo, tu as bien écouté !' : 'Réécoute le mot doucement')
    }
  }

  function next() {
    if (roundIndex >= items.length - 1) onComplete()
    else {
      setRoundIndex((current) => current + 1)
      setFeedback('')
      setFeedbackText('')
    }
  }

  return (
    <ActivityShell week={week} activity={activity} roundLabel={`${roundIndex + 1} / ${items.length}`} feedback={feedback} feedbackText={feedbackText} isComplete={isComplete} onBack={onBack} onNext={next}>
      {isChallenge ? <p className="challenge-pill">Défi de 2e année</p> : null}
      <AudioButton text={item.word} label="Écoute le mot" />
      <h1 className="big-question">Entends-tu le son « {item.vowel} » dans « {item.word} » ?</h1>
      <div className="choice-grid two">
        <button className="choice-button" type="button" disabled={isComplete} onClick={() => choose(true)}>Oui, je l’entends</button>
        <button className="choice-button" type="button" disabled={isComplete} onClick={() => choose(false)}>Non, je ne l’entends pas</button>
      </div>
    </ActivityShell>
  )
}

export function NumberNeighborActivityView({ week, activity, mode, onBack, onAnswer, onComplete }: CommonProps<NumberNeighborActivity>) {
  const firstGradeRounds = activity.rounds ?? 6
  const rounds = firstGradeRounds + (activity.challenge ? 1 : 0)
  const [roundIndex, setRoundIndex] = useState(0)
  const [feedback, setFeedback] = useState<'success' | 'try' | ''>('')
  const [feedbackText, setFeedbackText] = useState('')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const isChallenge = Boolean(activity.challenge) && roundIndex === rounds - 1
  const range = isChallenge && activity.challenge ? activity.challenge : activity
  const { direction, target, answer, choices } = makeNumberNeighbor(range.min, range.max, roundIndex, `${week.id}-${activity.id}`)
  const isComplete = mode === 'test' ? feedback !== '' : feedback === 'success'

  function choose(choice: number) {
    const isCorrect = choice === answer
    const nextCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0)
    setCorrectAnswers(nextCorrectAnswers)
    onAnswer({
      activityId: activity.id,
      questionId: `${activity.id}-${roundIndex + 1}`,
      isCorrect,
      answer: String(choice),
      expectedAnswer: String(answer),
    })
    setFeedback(isCorrect ? 'success' : 'try')
    if (mode === 'test' && roundIndex >= rounds - 1) {
      setFeedbackText(`Bloc terminé : ${nextCorrectAnswers}/${rounds}.`)
    } else {
      setFeedbackText(mode === 'test' ? '' : isCorrect ? 'Oui, c’est le bon voisin !' : `Compte doucement jusqu’à ${target}`)
    }
  }

  function next() {
    if (roundIndex >= rounds - 1) onComplete()
    else {
      setRoundIndex((current) => current + 1)
      setFeedback('')
      setFeedbackText('')
    }
  }

  return (
    <ActivityShell week={week} activity={activity} roundLabel={`${roundIndex + 1} / ${rounds}`} feedback={feedback} feedbackText={feedbackText} isComplete={isComplete} onBack={onBack} onNext={next}>
      {isChallenge ? <p className="challenge-pill">Défi de 2e année</p> : null}
      <p className="number-focus" aria-label={`Nombre ${target}`}>{target}</p>
      <h1 className="big-question">Quel nombre vient {direction} {target} ?</h1>
      <div className="choice-grid">
        {choices.map((choice) => (
          <button className="choice-button" key={choice} type="button" disabled={isComplete} onClick={() => choose(choice)}>{choice}</button>
        ))}
      </div>
    </ActivityShell>
  )
}

export function NumberParityActivityView({ week, activity, mode, onBack, onAnswer, onComplete }: CommonProps<NumberParityActivity>) {
  const firstGradeRounds = activity.rounds ?? 6
  const rounds = firstGradeRounds + (activity.challenge ? 1 : 0)
  const [roundIndex, setRoundIndex] = useState(0)
  const [feedback, setFeedback] = useState<'success' | 'try' | ''>('')
  const [feedbackText, setFeedbackText] = useState('')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const isChallenge = Boolean(activity.challenge) && roundIndex === rounds - 1
  const range = isChallenge && activity.challenge ? activity.challenge : activity
  const { value, answer } = makeNumberParity(range.min, range.max, roundIndex, `${week.id}-${activity.id}`)
  const isComplete = mode === 'test' ? feedback !== '' : feedback === 'success'

  function choose(choice: 'pair' | 'impair') {
    const isCorrect = choice === answer
    const nextCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0)
    setCorrectAnswers(nextCorrectAnswers)
    onAnswer({
      activityId: activity.id,
      questionId: `${activity.id}-${roundIndex + 1}`,
      isCorrect,
      answer: choice,
      expectedAnswer: answer,
    })
    setFeedback(isCorrect ? 'success' : 'try')
    if (mode === 'test' && roundIndex >= rounds - 1) {
      setFeedbackText(`Bloc terminé : ${nextCorrectAnswers}/${rounds}.`)
    } else {
      setFeedbackText(mode === 'test' ? '' : isCorrect ? 'Bravo, tu as trouvé !' : 'Fais des groupes de deux et essaie encore')
    }
  }

  function next() {
    if (roundIndex >= rounds - 1) onComplete()
    else {
      setRoundIndex((current) => current + 1)
      setFeedback('')
      setFeedbackText('')
    }
  }

  return (
    <ActivityShell week={week} activity={activity} roundLabel={`${roundIndex + 1} / ${rounds}`} feedback={feedback} feedbackText={feedbackText} isComplete={isComplete} onBack={onBack} onNext={next}>
      {isChallenge ? <p className="challenge-pill">Défi de 2e année</p> : null}
      <p className="number-focus" aria-label={`Nombre ${value}`}>{value}</p>
      <h1 className="big-question">Ce nombre est-il pair ou impair ?</h1>
      <div className="choice-grid two">
        <button className="choice-button" type="button" disabled={isComplete} onClick={() => choose('pair')}>Pair</button>
        <button className="choice-button" type="button" disabled={isComplete} onClick={() => choose('impair')}>Impair</button>
      </div>
    </ActivityShell>
  )
}
