export function gradeFromScore(correct: number, total: number): string | null {
  if (total <= 0) return null

  const percent = (correct / total) * 100
  if (percent >= 97) return 'A+'
  if (percent >= 93) return 'A'
  if (percent >= 90) return 'A-'
  if (percent >= 87) return 'B+'
  if (percent >= 83) return 'B'
  if (percent >= 80) return 'B-'
  if (percent >= 77) return 'C+'
  if (percent >= 73) return 'C'
  if (percent >= 70) return 'C-'
  if (percent >= 65) return 'D+'
  if (percent >= 60) return 'D'
  return 'À reprendre'
}

export function formatScore(correct: number, total: number): string {
  const grade = gradeFromScore(correct, total)
  return grade ? `${grade} · ${correct}/${total}` : `${correct}/${total}`
}
