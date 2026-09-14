import { useMemo, useState } from 'react'
import { AudioButton } from '../components/AudioButton'
import { speak } from '../services/voice'
import type { ActivityAnswer } from '../storage/progress'
import type {
  Activity,
  AlphabeticalOrderActivity,
  NounSortActivity,
  NumberDictationActivity,
  NumberSequenceActivity,
  ReadingActivity,
  WeekContent,
  WordPreviewActivity,
  WritingActivity,
} from '../types/content'
import { makeNumberChoices, makeNumberSequence, numberToFrench } from '../utils/games'
import { pickRoundItems, shuffle } from '../utils/random'
import { ActivityShell } from './ActivityShell'

type CommonProps<T extends Activity> = {
  week: WeekContent
  activity: T
  mode: 'guided' | 'test'
  onBack: () => void
  onAnswer: (answer: Omit<ActivityAnswer, 'createdAt'>) => void
  onComplete: () => void
}

export function AlphabeticalActivityView({ week, activity, mode, onBack, onAnswer, onComplete }: CommonProps<AlphabeticalOrderActivity>) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'success' | 'try' | ''>('')
  const [feedbackText, setFeedbackText] = useState('')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const set = activity.sets[roundIndex] ?? activity.sets[0]
  const answer = [...set].sort((a, b) => a.localeCompare(b, 'fr'))
  const choices = useMemo(() => shuffle(set, `${week.id}-${activity.id}-${roundIndex}`), [activity.id, roundIndex, set, week.id])
  const answered = selected.length === answer.length
  const correct = answered && selected.every((word, index) => word === answer[index])
  const complete = mode === 'test' ? answered : correct

  function choose(word: string) {
    const next = [...selected, word]
    setSelected(next)
    if (next.length === answer.length) {
      const isCorrect = next.every((item, index) => item === answer[index])
      const nextCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0)
      setCorrectAnswers(nextCorrectAnswers)
      setFeedback(isCorrect ? 'success' : 'try')
      if (mode === 'test' && roundIndex >= activity.sets.length - 1) {
        setFeedbackText(`Bloc terminé : ${nextCorrectAnswers}/${activity.sets.length}.`)
      } else {
        setFeedbackText(isCorrect ? 'Parfait !' : mode === 'test' ? 'Réponse enregistrée.' : 'On remet dans l’ordre et on recommence')
      }
      onAnswer({
        activityId: activity.id,
        questionId: `${activity.id}-${roundIndex + 1}`,
        isCorrect,
        answer: next.join(', '),
        expectedAnswer: answer.join(', '),
      })
    }
  }

  function next() {
    if (roundIndex >= activity.sets.length - 1) onComplete()
    else {
      setRoundIndex((current) => current + 1)
      setSelected([])
      setFeedback('')
      setFeedbackText('')
    }
  }

  return (
    <ActivityShell week={week} activity={activity} roundLabel={`${roundIndex + 1} / ${activity.sets.length}`} feedback={feedback} feedbackText={feedbackText} isComplete={complete} onBack={onBack} onNext={next}>
      <h1 className="big-question">Tape les mots en ordre alphabétique</h1>
      <div className="answer-strip">{selected.map((word) => <span key={word}>{word}</span>)}</div>
      <div className="choice-grid">
        {choices.map((word) => (
          <button className="choice-button word-choice" disabled={selected.includes(word) || complete} type="button" key={word} onClick={() => choose(word)}>
            {word}
          </button>
        ))}
      </div>
      <button className="ghost-button" type="button" onClick={() => { setSelected([]); setFeedback(''); setFeedbackText('') }}>Recommencer</button>
    </ActivityShell>
  )
}

export function NounSortActivityView({ week, activity, mode, onBack, onAnswer, onComplete }: CommonProps<NounSortActivity>) {
  const rounds = useMemo(() => pickRoundItems(activity.items, activity.rounds ?? activity.items.length, `${week.id}-${activity.id}`), [activity, week.id])
  const [roundIndex, setRoundIndex] = useState(0)
  const [feedback, setFeedback] = useState<'success' | 'try' | ''>('')
  const [feedbackText, setFeedbackText] = useState('')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const item = rounds[roundIndex]
  const isComplete = mode === 'test' ? feedback !== '' : feedback === 'success'

  function choose(answer: 'proper' | 'common') {
    const isCorrect = item.answer === answer
    const nextCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0)
    setCorrectAnswers(nextCorrectAnswers)
    setFeedback(isCorrect ? 'success' : 'try')
    if (mode === 'test' && roundIndex >= rounds.length - 1) {
      setFeedbackText(`Bloc terminé : ${nextCorrectAnswers}/${rounds.length}.`)
    } else {
      setFeedbackText(isCorrect ? 'Oui !' : mode === 'test' ? 'Réponse enregistrée.' : 'Regarde l’indice et essaie encore')
    }
    onAnswer({
      activityId: activity.id,
      questionId: `${activity.id}-${roundIndex + 1}`,
      isCorrect,
      answer,
      expectedAnswer: item.answer,
    })
  }

  function next() {
    if (roundIndex >= rounds.length - 1) onComplete()
    else {
      setRoundIndex((current) => current + 1)
      setFeedback('')
      setFeedbackText('')
    }
  }

  return (
    <ActivityShell week={week} activity={activity} roundLabel={`${roundIndex + 1} / ${rounds.length}`} feedback={feedback} feedbackText={feedbackText} isComplete={isComplete} onBack={onBack} onNext={next}>
      <p className="soft-label">Indice : {item.hint}</p>
      <h1 className="spotlight-word">{item.text}</h1>
      <div className="choice-grid two">
        <button className="choice-button" type="button" disabled={isComplete} onClick={() => choose('proper')}>Nom propre</button>
        <button className="choice-button" type="button" disabled={isComplete} onClick={() => choose('common')}>Nom commun</button>
      </div>
    </ActivityShell>
  )
}

export function NumberSequenceActivityView({ week, activity, mode, onBack, onAnswer, onComplete }: CommonProps<NumberSequenceActivity>) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [feedback, setFeedback] = useState<'success' | 'try' | ''>('')
  const [feedbackText, setFeedbackText] = useState('')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const rounds = activity.rounds ?? 5
  const puzzle = makeNumberSequence(activity.min, activity.max, activity.steps, `${week.id}-${activity.id}-${roundIndex}`)

  const isComplete = mode === 'test' ? feedback !== '' : feedback === 'success'

  function choose(choice: number) {
    const isCorrect = choice === puzzle.answer
    const nextCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0)
    setCorrectAnswers(nextCorrectAnswers)
    setFeedback(isCorrect ? 'success' : 'try')
    if (mode === 'test' && roundIndex >= rounds - 1) {
      setFeedbackText(`Bloc terminé : ${nextCorrectAnswers}/${rounds}.`)
    } else {
      setFeedbackText(isCorrect ? 'Exactement !' : mode === 'test' ? 'Réponse enregistrée.' : 'Essaie encore')
    }
    onAnswer({
      activityId: activity.id,
      questionId: `${activity.id}-${roundIndex + 1}`,
      isCorrect,
      answer: String(choice),
      expectedAnswer: String(puzzle.answer),
    })
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
      <h1 className="big-question">Compte par bonds de {puzzle.step}</h1>
      <div className="number-sequence">
        {puzzle.sequence.map((value, index) => <span key={`${value}-${index}`}>{index === puzzle.missingIndex ? '?' : value}</span>)}
      </div>
      <div className="choice-grid">
        {puzzle.choices.map((choice) => (
          <button className="choice-button" key={choice} type="button" disabled={isComplete} onClick={() => choose(choice)}>{choice}</button>
        ))}
      </div>
    </ActivityShell>
  )
}

export function NumberDictationActivityView({ week, activity, mode, onBack, onAnswer, onComplete }: CommonProps<NumberDictationActivity>) {
  const numbers = useMemo(
    () => activity.numbers ?? Array.from({ length: activity.max - activity.min + 1 }, (_, index) => activity.min + index),
    [activity.max, activity.min, activity.numbers],
  )
  const rounds = useMemo(() => pickRoundItems(numbers, activity.rounds ?? 5, `${week.id}-${activity.id}`), [activity, numbers, week.id])
  const [roundIndex, setRoundIndex] = useState(0)
  const [feedback, setFeedback] = useState<'success' | 'try' | ''>('')
  const [feedbackText, setFeedbackText] = useState('')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const answer = rounds[roundIndex]
  const choices = makeNumberChoices(answer, activity.min, activity.max, `${week.id}-${activity.id}-${roundIndex}`)
  const isComplete = mode === 'test' ? feedback !== '' : feedback === 'success'

  function choose(choice: number) {
    const isCorrect = choice === answer
    const nextCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0)
    setCorrectAnswers(nextCorrectAnswers)
    setFeedback(isCorrect ? 'success' : 'try')
    if (mode === 'test' && roundIndex >= rounds.length - 1) {
      setFeedbackText(`Bloc terminé : ${nextCorrectAnswers}/${rounds.length}.`)
    } else {
      setFeedbackText(isCorrect ? 'Bien entendu !' : mode === 'test' ? 'Réponse enregistrée.' : 'Réécoute doucement')
    }
    onAnswer({
      activityId: activity.id,
      questionId: `${activity.id}-${roundIndex + 1}`,
      isCorrect,
      answer: String(choice),
      expectedAnswer: String(answer),
    })
  }

  function next() {
    if (roundIndex >= rounds.length - 1) onComplete()
    else {
      setRoundIndex((current) => current + 1)
      setFeedback('')
      setFeedbackText('')
    }
  }

  return (
    <ActivityShell week={week} activity={activity} roundLabel={`${roundIndex + 1} / ${rounds.length}`} feedback={feedback} feedbackText={feedbackText} isComplete={isComplete} onBack={onBack} onNext={next}>
      <AudioButton text={numberToFrench(answer)} label="Écoute le nombre" />
      <h1 className="big-question">Quel nombre entends-tu ?</h1>
      <div className="choice-grid">
        {choices.map((choice) => (
          <button className="choice-button" type="button" key={choice} disabled={isComplete} onClick={() => choose(choice)}>{choice}</button>
        ))}
      </div>
    </ActivityShell>
  )
}

export function ReadingActivityView({ week, activity, onBack, onComplete }: CommonProps<ReadingActivity>) {
  return (
    <ActivityShell week={week} activity={activity} isComplete={false} onBack={onBack} onNext={onComplete}>
      <div className="quiet-illustration" aria-hidden="true">📖</div>
      <h1 className="big-question">{activity.prompt}</h1>
      <button className="primary-button next-button" type="button" onClick={onComplete}>J’ai terminé</button>
    </ActivityShell>
  )
}

export function WordPreviewActivityView({ week, activity, onBack, onComplete }: CommonProps<WordPreviewActivity>) {
  const words = activity.words.length > 0 ? activity.words : week.vocabulary ?? []

  return (
    <ActivityShell week={week} activity={activity} isComplete={false} onBack={onBack} onNext={onComplete}>
      <p className="word-preview-prompt">{activity.prompt ?? 'Lis les mots à voix haute doucement.'}</p>
      <div className="word-preview-grid" aria-label="Mots de vocabulaire à lire">
        {words.map((word) => (
          <button type="button" key={word} onClick={() => speak(word)} aria-label={`Écouter ${word}`}>
            <span>{word}</span>
            <small aria-hidden="true">🔊</small>
          </button>
        ))}
      </div>
      <button className="primary-button next-button" type="button" onClick={onComplete}>J’ai lu les mots</button>
    </ActivityShell>
  )
}

export function WritingActivityView({ week, activity, onBack, onComplete }: CommonProps<WritingActivity>) {
  return (
    <ActivityShell week={week} activity={activity} isComplete={false} onBack={onBack} onNext={onComplete}>
      <div className="quiet-illustration" aria-hidden="true">✏️</div>
      <h1 className="big-question">{activity.prompt}</h1>
      <ul className="checklist">
        {activity.checklist.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <button className="primary-button next-button" type="button" onClick={onComplete}>J’ai terminé</button>
    </ActivityShell>
  )
}
