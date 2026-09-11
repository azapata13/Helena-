type ProgressRingProps = {
  percent: number
  label: string
}

export function ProgressRing({ percent, label }: ProgressRingProps) {
  return (
    <div className="progress-orb" style={{ '--progress': `${percent}%` } as React.CSSProperties}>
      <strong>{percent}%</strong>
      <span>{label}</span>
    </div>
  )
}
