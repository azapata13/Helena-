import type { Activity, WeekContent } from '../types/content'

type ActivityShellProps = {
  week: WeekContent
  activity: Activity
  roundLabel?: string
  children: React.ReactNode
  feedback?: 'success' | 'try' | ''
  feedbackText?: string
  isComplete: boolean
  onBack: () => void
  onNext: () => void
}

export function ActivityShell({
  week,
  activity,
  roundLabel,
  children,
  feedback,
  feedbackText,
  isComplete,
  onBack,
  onNext,
}: ActivityShellProps) {
  return (
    <main className="activity-page">
      <header className="activity-top">
        <button className="ghost-button" type="button" onClick={onBack}>
          ← Accueil
        </button>
        <div>
          <span>{week.title}</span>
          <strong>{activity.title}</strong>
        </div>
        {roundLabel ? <span className="round-pill">{roundLabel}</span> : <span />}
      </header>
      <section className="activity-stage">
        <p className="activity-kind">{subjectLabel(activity.subject)}</p>
        {activity.instruction ? <p className="activity-instruction">{activity.instruction}</p> : null}
        {children}
        <div className={`feedback ${feedback ? `feedback-${feedback}` : ''}`} aria-live="polite">
          {feedbackText}
        </div>
        {isComplete ? (
          <button className="primary-button next-button" type="button" onClick={onNext}>
            Suivant
          </button>
        ) : null}
      </section>
    </main>
  )
}

function subjectLabel(subject: Activity['subject']): string {
  return {
    lecture: 'Lecture',
    mots: 'Mots',
    ecriture: 'Écriture',
    maths: 'Maths',
    grammaire: 'Grammaire',
  }[subject]
}
