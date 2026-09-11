import { useMemo, useState } from 'react'
import { AudioButton } from '../components/AudioButton'
import type { WeekContent, WordActivity } from '../types/content'
import { makeLetterChoices, makeWordChoices, makeWordRounds } from '../utils/games'
import { shuffle } from '../utils/random'
import { ActivityShell } from './ActivityShell'

type Props = {
  week: WeekContent
  activity: WordActivity
  onBack: () => void
  onComplete: () => void
}

const praise = ['Bravo !', 'Super !', 'Bien joué !', 'Tu l’as trouvé !']

export function WordActivityView({ week, activity, onBack, onComplete }: Props) {
  const rounds = useMemo(
    () => makeWordRounds(activity.words, activity.rounds ?? activity.words.length, `${week.id}-${activity.id}`),
    [activity, week.id],
  )
  const [roundIndex, setRoundIndex] = useState(0)
  const [builtLetters, setBuiltLetters] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'success' | 'try' | ''>('')
  const [feedbackText, setFeedbackText] = useState('')
  const answer = rounds[roundIndex] ?? rounds[0]
  const isFinalRound = roundIndex >= rounds.length - 1
  const isRoundComplete = feedback === 'success'

  function celebrate() {
    setFeedback('success')
    setFeedbackText(praise[roundIndex % praise.length])
  }

  function tryAgain() {
    setFeedback('try')
    setFeedbackText('Essaie encore')
  }

  function next() {
    if (isFinalRound) {
      onComplete()
      return
    }
    setRoundIndex((current) => current + 1)
    setBuiltLetters([])
    setFeedback('')
    setFeedbackText('')
  }

  if (!answer) return null

  const seed = `${week.id}-${activity.id}-${roundIndex}-${answer}`
  const roundLabel = `${roundIndex + 1} / ${rounds.length}`

  if (activity.type === 'missingLetters') {
    const puzzle = makeLetterChoices(answer, seed)
    return (
      <ActivityShell week={week} activity={activity} onBack={onBack} roundLabel={roundLabel} feedback={feedback} feedbackText={feedbackText} isComplete={isRoundComplete} onNext={next}>
        <AudioButton text={answer} label="Écoute le mot" />
        <div className="word-display" aria-label={`Mot avec une lettre cachée: ${puzzle.display}`}>
          {puzzle.display}
        </div>
        <div className="choice-grid letter-grid">
          {puzzle.choices.map((choice) => (
            <button className="choice-button" type="button" key={choice} disabled={isRoundComplete} onClick={() => (choice === puzzle.answer ? celebrate() : tryAgain())}>
              {choice.toUpperCase()}
            </button>
          ))}
        </div>
      </ActivityShell>
    )
  }

  if (activity.type === 'listenChoose' || activity.type === 'findWord') {
    const choices = makeWordChoices(answer, activity.words, seed)
    return (
      <ActivityShell week={week} activity={activity} onBack={onBack} roundLabel={roundLabel} feedback={feedback} feedbackText={feedbackText} isComplete={isRoundComplete} onNext={next}>
        <AudioButton text={activity.type === 'findWord' ? `Trouve ${answer}` : answer} label={activity.type === 'findWord' ? 'Consigne' : 'Écoute'} />
        <h1 className="big-question">{activity.type === 'findWord' ? `Trouve « ${answer} »` : 'Quel mot entends-tu ?'}</h1>
        <div className="choice-grid">
          {choices.map((choice) => (
            <button className="choice-button word-choice" type="button" key={choice} disabled={isRoundComplete} onClick={() => (choice === answer ? celebrate() : tryAgain())}>
              {choice}
            </button>
          ))}
        </div>
      </ActivityShell>
    )
  }

  const letters = shuffle(answer.split(''), seed)
  const currentAnswer = builtLetters.join('')
  const isCorrect = currentAnswer === answer

  function addLetter(letter: string) {
    if (isRoundComplete) return
    const nextLetters = [...builtLetters, letter]
    setBuiltLetters(nextLetters)
    const nextAnswer = nextLetters.join('')
    if (nextAnswer === answer) celebrate()
    else if (nextLetters.length === answer.length) tryAgain()
  }

  return (
    <ActivityShell week={week} activity={activity} onBack={onBack} roundLabel={roundLabel} feedback={feedback} feedbackText={feedbackText} isComplete={isCorrect || isRoundComplete} onNext={next}>
      <AudioButton text={answer} label={activity.type === 'miniDictee' ? 'Dictée' : 'Écoute'} />
      <h1 className="big-question">{activity.type === 'miniDictee' ? 'Construis le mot entendu' : 'Remets les lettres en ordre'}</h1>
      <div className="answer-slots">
        {answer.split('').map((_, index) => (
          <span key={`${answer}-${index}`} className="letter-slot">
            {builtLetters[index]?.toUpperCase() ?? ''}
          </span>
        ))}
      </div>
      <div className="choice-grid letter-grid">
        {letters.map((letter, index) => {
          const usedCount = builtLetters.filter((item) => item === letter).length
          const seenBefore = letters.slice(0, index + 1).filter((item) => item === letter).length
          const disabled = usedCount >= seenBefore
          return (
            <button className="choice-button" type="button" key={`${letter}-${index}`} disabled={disabled || isRoundComplete} onClick={() => addLetter(letter)}>
              {letter.toUpperCase()}
            </button>
          )
        })}
      </div>
      <div className="tool-row">
        <button className="ghost-button" type="button" onClick={() => { setBuiltLetters([]); setFeedback(''); setFeedbackText('') }}>
          Recommencer
        </button>
        <button className="ghost-button" type="button" onClick={() => setBuiltLetters((current) => current.slice(0, -1))}>
          Effacer
        </button>
      </div>
    </ActivityShell>
  )
}
