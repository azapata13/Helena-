import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { ActivityRenderer } from './activities/ActivityRenderer'
import { ProgressRing } from './components/ProgressRing'
import { getCurrentWeek, weeks } from './content'
import { molinaWeeks } from './content/molina'
import { useProgress, useSyncWeekProgress, useWeekProgress } from './hooks/useProgress'
import type { ActivityAnswer } from './storage/progress'
import type { Activity, Subject, WeekContent } from './types/content'
import { formatScore } from './utils/grades'

type View = 'home' | 'weeks' | 'stars' | 'activity'

type StudentProfile = {
  id: 'helena' | 'molina'
  name: string
  weeks: WeekContent[]
  readyMessage: string
}

const helenaProfile: StudentProfile = {
  id: 'helena',
  name: 'Helena',
  weeks,
  readyMessage: 'Prête pour une belle semaine ?',
}

const molinaProfile: StudentProfile = {
  id: 'molina',
  name: 'Molina',
  weeks: molinaWeeks,
  readyMessage: 'Prête à apprendre en jouant ?',
}

function profileForPath(pathname: string): StudentProfile {
  return pathname === '/molina' || pathname.startsWith('/molina/') ? molinaProfile : helenaProfile
}

const subjectLabels: Record<Subject, string> = {
  lecture: 'Lecture',
  mots: 'Mots',
  ecriture: 'Écriture',
  maths: 'Maths',
  grammaire: 'Grammaire',
}

function App() {
  const profile = useMemo(() => profileForPath(window.location.pathname), [])
  const defaultWeek = useMemo(() => getCurrentWeek(new Date(), profile.weeks), [profile])
  const [selectedWeekId, setSelectedWeekId] = useState(defaultWeek.id)
  const [view, setView] = useState<View>('home')
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null)
  const [pendingScore, setPendingScore] = useState<{ correct: number; total: number; nextActivity: Activity } | null>(null)
  const { progress, startTestAttempt, recordAnswer, completeActivity, completeWeek, syncWeek, resetAll } = useProgress(profile.id)
  const selectedWeek = profile.weeks.find((week) => week.id === selectedWeekId) ?? defaultWeek
  const weekProgress = useWeekProgress(selectedWeek, progress)
  const currentActivity = selectedWeek.activities.find((activity) => activity.id === activeActivityId)
  useSyncWeekProgress(selectedWeek.id, syncWeek)

  useEffect(() => {
    document.title = `${profile.name} · Mes devoirs`
  }, [profile.name])

  function startActivity(activity: Activity) {
    setPendingScore(null)
    if (weekProgress.mode === 'test') startTestAttempt(selectedWeek.id)
    setActiveActivityId(activity.id)
    setView('activity')
  }

  function continueWeek() {
    startActivity(weekProgress.nextActivity)
  }

  function finishActivity(activity: Activity) {
    completeActivity(selectedWeek.id, activity, weekProgress.mode)
    const currentIndex = selectedWeek.activities.findIndex((item) => item.id === activity.id)
    const completedIds =
      weekProgress.mode === 'test'
        ? new Set([...(weekProgress.activeAttempt?.completedActivityIds ?? []), activity.id])
        : new Set([
            ...Object.entries(weekProgress.records)
              .filter(([, record]) => record.completed)
              .map(([activityId]) => activityId),
            activity.id,
          ])
    const next = selectedWeek.activities
      .slice(currentIndex + 1)
      .find((item) => item.required !== false && !completedIds.has(item.id))
    const answers = weekProgress.activeAttempt?.answers ?? []
    const scoredBefore = weekProgress.scoredActivities.filter((item) => completedIds.has(item.id))
    const scoredFinished = weekProgress.mode === 'test' && scoredBefore.length >= weekProgress.scoredActivities.length
    if (next && scoredFinished && weekProgress.scoredActivities.some((item) => item.id === activity.id)) {
      const correct = answers.filter((answer) => answer.isCorrect).length
      setPendingScore({ correct, total: answers.length, nextActivity: next })
      setActiveActivityId(null)
      setView('home')
    } else if (next) startActivity(next)
    else {
      completeWeek(selectedWeek.id, weekProgress.mode)
      setActiveActivityId(null)
      setView('home')
    }
  }

  function handleAnswer(answer: Omit<ActivityAnswer, 'createdAt'>) {
    if (weekProgress.mode === 'test') recordAnswer(selectedWeek.id, answer)
  }

  if (view === 'activity' && currentActivity) {
    return (
      <ActivityRenderer
        key={`${selectedWeek.id}-${currentActivity.id}`}
        week={selectedWeek}
        activity={currentActivity}
        mode={weekProgress.mode}
        onBack={() => setView('home')}
        onAnswer={handleAnswer}
        onComplete={() => finishActivity(currentActivity)}
      />
    )
  }

  return (
    <div className={`app-shell student-${profile.id}`}>
      <main className="main-surface">
        {view === 'home' ? (
          pendingScore ? (
            <ScoreCompleteView
              correct={pendingScore.correct}
              total={pendingScore.total}
              nextActivity={pendingScore.nextActivity}
              studentName={profile.name}
              onNext={() => startActivity(pendingScore.nextActivity)}
            />
          ) : (
            <HomeView profile={profile} week={selectedWeek} progress={weekProgress} onContinue={continueWeek} onStart={startActivity} />
          )
        ) : null}
        {view === 'weeks' ? (
          <WeeksView
            progress={progress}
            weeks={profile.weeks}
            selectedWeekId={selectedWeekId}
            onSelect={(week) => {
              setSelectedWeekId(week.id)
              setView('home')
            }}
          />
        ) : null}
        {view === 'stars' ? <StarsView weeks={profile.weeks} progress={progress} onReset={resetAll} /> : null}
      </main>
      <nav className="bottom-nav" aria-label="Navigation principale">
        <button className={view === 'home' ? 'active' : ''} type="button" onClick={() => setView('home')}>
          Accueil
        </button>
        <button className={view === 'weeks' ? 'active' : ''} type="button" onClick={() => setView('weeks')}>
          Mes semaines
        </button>
        <button className={view === 'stars' ? 'active' : ''} type="button" onClick={() => setView('stars')}>
          Mes étoiles
        </button>
      </nav>
    </div>
  )
}

function ScoreCompleteView({
  correct,
  total,
  nextActivity,
  studentName,
  onNext,
}: {
  correct: number
  total: number
  nextActivity: Activity
  studentName: string
  onNext: () => void
}) {
  const [grade, score] = formatScore(correct, total).split(' · ')

  return (
    <section className="score-complete-page" role="status">
      <div className="score-complete-card">
        <p className="eyebrow">Test terminé</p>
        <h1>Bravo {studentName} !</h1>
        <p className="score-complete-note">Tu as terminé tous les exercices notés.</p>
        <div className="grade-medal" aria-label={`Note globale ${formatScore(correct, total)}`}>
          {grade}
        </div>
        <strong className="score-total">Note globale : {score ?? `${correct}/${total}`}</strong>
        <p className="score-next">Prochaine étape : {nextActivity.title.toLowerCase()}.</p>
        <button className="primary-button score-next-button" type="button" onClick={onNext}>
          Suivant
        </button>
      </div>
    </section>
  )
}

function HomeView({
  profile,
  week,
  progress,
  onContinue,
  onStart,
}: {
  profile: StudentProfile
  week: WeekContent
  progress: ReturnType<typeof useWeekProgress>
  onContinue: () => void
  onStart: (activity: Activity) => void
}) {
  return (
    <section className="home-grid">
      <div className="hero-panel">
        <div className="hello-row">
          <div className="hero-heading">
            <p className="eyebrow">Bonjour {profile.name}</p>
            <button className="primary-button hero-action" type="button" onClick={onContinue}>
              {progress.mode === 'test' ? 'Refaire' : progress.completedCount > 0 ? 'Continuer' : 'Commencer'}
            </button>
            <h1>{week.title}</h1>
          </div>
          <ProgressRing percent={progress.percent} label={`${progress.completedCount}/${progress.requiredCount}`} />
        </div>
        {progress.isComplete ? (
          <div className="celebration" role="status">
            <div className="sparkles" aria-hidden="true">★ ★ ★</div>
            <h2>Bravo {profile.name} !</h2>
            <p>Tu as terminé ta semaine.</p>
          </div>
        ) : (
          <p className="week-note">
            {progress.mode === 'test'
              ? scoreLabel(progress)
              : week.summary.vocabulary ?? profile.readyMessage}
          </p>
        )}
        {week.reminders?.length ? (
          <aside className="family-reminders">
            <strong>À retenir pour la famille</strong>
            <ul>{week.reminders.map((reminder) => <li key={reminder}>{reminder}</li>)}</ul>
          </aside>
        ) : null}
      </div>
      <div className="activity-list" aria-label="Activités de la semaine">
        {week.activities.map((activity) => {
          const done = progress.records[activity.id]?.completed
          return (
            <button className={`activity-tile ${done ? 'done' : ''}`} type="button" key={activity.id} onClick={() => onStart(activity)}>
              <span className="activity-icon" aria-hidden="true">{iconFor(activity.subject)}</span>
              <span>
                <strong>{activity.title}</strong>
                <small>{subjectLabels[activity.subject]}</small>
              </span>
              <b aria-label={done ? 'Terminé' : 'À faire'}>{done ? '✓' : '›'}</b>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function WeeksView({
  weeks: allWeeks,
  progress,
  selectedWeekId,
  onSelect,
}: {
  weeks: WeekContent[]
  progress: ReturnType<typeof useProgress>['progress']
  selectedWeekId: string
  onSelect: (week: WeekContent) => void
}) {
  return (
    <section className="simple-page">
      <h1>Mes semaines</h1>
      <div className="week-list">
        {[...allWeeks].reverse().map((week) => {
          const records = progress.weeks[week.id] ?? {}
          const completions = progress.weekMeta[week.id]?.completionCount ?? 0
          const completed = week.activities.filter((activity) => records[activity.id]?.completed).length
          return (
            <button className={`week-card ${week.id === selectedWeekId ? 'selected' : ''}`} type="button" key={week.id} onClick={() => onSelect(week)}>
              <span>
                <strong>{week.title}</strong>
                <small>{completed} / {week.activities.length} activités · {completions} complétion{completions > 1 ? 's' : ''}</small>
              </span>
              <b>{week.id === selectedWeekId ? 'Cette semaine' : 'Ouvrir'}</b>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function StarsView({
  weeks: allWeeks,
  progress,
  onReset,
}: {
  weeks: WeekContent[]
  progress: ReturnType<typeof useProgress>['progress']
  onReset: () => void
}) {
  const stars = Object.values(progress.weeks).flatMap((week) => Object.values(week)).reduce((sum, record) => sum + record.stars, 0)
  const completedWeeks = allWeeks.filter((week) => week.activities.every((activity) => progress.weeks[week.id]?.[activity.id]?.completed))
  const completedAttempts = Object.values(progress.weekMeta).reduce((sum, week) => sum + week.completionCount, 0)
  return (
    <section className="simple-page stars-page">
      <h1>Mes étoiles</h1>
      <div className="star-total" aria-label={`${stars} étoiles gagnées`}>
        <span aria-hidden="true">★</span>
        <strong>{stars}</strong>
      </div>
      <p>{completedWeeks.length > 0 ? `${completedWeeks.length} semaine terminée · ${completedAttempts} passage${completedAttempts > 1 ? 's' : ''}. Bravo !` : 'Termine une activité pour gagner tes premières étoiles.'}</p>
      <button className="parent-reset" type="button" onClick={onReset}>Réinitialiser les progrès</button>
    </section>
  )
}

function scoreLabel(progress: ReturnType<typeof useWeekProgress>): string {
  const activeAnswers = progress.activeAttempt?.answers.length ?? 0
  const lastAttempt = progress.lastAttempt
  if (activeAnswers > 0) return 'Continue. Tu verras une note à la fin de chaque bloc.'
  if (lastAttempt && lastAttempt.totalQuestions > 0) {
    return `Dernière note globale : ${formatScore(lastAttempt.correctAnswers, lastAttempt.totalQuestions)}. Les notes apparaissent aussi par bloc.`
  }
  return 'Complété 1 fois cette semaine. Maintenant, tu peux refaire les exercices.'
}

function iconFor(subject: Subject): string {
  return {
    lecture: '📖',
    mots: 'Aa',
    ecriture: '✎',
    maths: '123',
    grammaire: 'Nom',
  }[subject]
}

export default App
