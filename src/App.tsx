import { useMemo, useState } from 'react'
import './App.css'
import { ActivityRenderer } from './activities/ActivityRenderer'
import { ProgressRing } from './components/ProgressRing'
import { getCurrentWeek, weeks } from './content'
import { useProgress, useSyncWeekProgress, useWeekProgress } from './hooks/useProgress'
import type { ActivityAnswer } from './storage/progress'
import type { Activity, Subject, WeekContent } from './types/content'

type View = 'home' | 'weeks' | 'stars' | 'activity'

const subjectLabels: Record<Subject, string> = {
  lecture: 'Lecture',
  mots: 'Mots',
  ecriture: 'Écriture',
  maths: 'Maths',
  grammaire: 'Grammaire',
}

function App() {
  const defaultWeek = useMemo(() => getCurrentWeek(), [])
  const [selectedWeekId, setSelectedWeekId] = useState(defaultWeek.id)
  const [view, setView] = useState<View>('home')
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null)
  const { progress, startTestAttempt, recordAnswer, completeActivity, completeWeek, syncWeek, resetAll } = useProgress()
  const selectedWeek = weeks.find((week) => week.id === selectedWeekId) ?? defaultWeek
  const weekProgress = useWeekProgress(selectedWeek, progress)
  const currentActivity = selectedWeek.activities.find((activity) => activity.id === activeActivityId)
  useSyncWeekProgress(selectedWeek.id, syncWeek)

  function startActivity(activity: Activity) {
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
    if (next) startActivity(next)
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
    <div className="app-shell">
      <main className="main-surface">
        {view === 'home' ? (
          <HomeView week={selectedWeek} progress={weekProgress} onContinue={continueWeek} onStart={startActivity} />
        ) : null}
        {view === 'weeks' ? (
          <WeeksView
            progress={progress}
            selectedWeekId={selectedWeekId}
            onSelect={(week) => {
              setSelectedWeekId(week.id)
              setView('home')
            }}
          />
        ) : null}
        {view === 'stars' ? <StarsView weeks={weeks} progress={progress} onReset={resetAll} /> : null}
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

function HomeView({
  week,
  progress,
  onContinue,
  onStart,
}: {
  week: WeekContent
  progress: ReturnType<typeof useWeekProgress>
  onContinue: () => void
  onStart: (activity: Activity) => void
}) {
  return (
    <section className="home-grid">
      <div className="hero-panel">
        <div className="hello-row">
          <div>
            <p className="eyebrow">Bonjour Helena</p>
            <h1>{week.title}</h1>
          </div>
          <ProgressRing percent={progress.percent} label={`${progress.completedCount}/${progress.requiredCount}`} />
        </div>
        {progress.isComplete ? (
          <div className="celebration" role="status">
            <div className="sparkles" aria-hidden="true">★ ★ ★</div>
            <h2>Bravo Helena !</h2>
            <p>Tu as terminé ta semaine.</p>
          </div>
        ) : (
          <p className="week-note">
            {progress.mode === 'test'
              ? scoreLabel(progress)
              : week.summary.vocabulary ?? 'Prête pour une belle semaine ?'}
          </p>
        )}
        <button className="primary-button hero-action" type="button" onClick={onContinue}>
          {progress.mode === 'test' ? 'Refaire en mode test' : progress.completedCount > 0 ? 'Continuer' : 'Commencer'}
        </button>
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
  progress,
  selectedWeekId,
  onSelect,
}: {
  progress: ReturnType<typeof useProgress>['progress']
  selectedWeekId: string
  onSelect: (week: WeekContent) => void
}) {
  return (
    <section className="simple-page">
      <h1>Mes semaines</h1>
      <div className="week-list">
        {[...weeks].reverse().map((week) => {
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
  if (activeAnswers > 0) return 'Continue le test. Le score apparaîtra à la fin.'
  if (lastAttempt && lastAttempt.totalQuestions > 0) {
    return `Dernier score : ${lastAttempt.correctAnswers}/${lastAttempt.totalQuestions}. Tu peux refaire la semaine.`
  }
  return 'Complété 1 fois cette semaine. Maintenant, tu peux refaire les exercices en mode test.'
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
