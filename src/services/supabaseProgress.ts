import { createClient } from '@supabase/supabase-js'
import type { ActivityAnswer, WeekAttemptSummary } from '../storage/progress'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null

type WeekAttemptRow = {
  id?: string
  week_id: string
  attempt_number: number
  mode: 'guided' | 'test'
  started_at: string
  completed_at: string | null
  correct_answers: number | null
  total_questions: number | null
}

export function hasSupabaseProgress(): boolean {
  return supabase !== null
}

export async function loadRemoteWeekAttempts(weekId: string): Promise<WeekAttemptSummary[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('week_attempts')
    .select('attempt_number, mode, started_at, completed_at, correct_answers, total_questions')
    .eq('week_id', weekId)
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: true })

  if (error || !data) return []

  return (data as WeekAttemptRow[]).map((row, index) => ({
    attemptNumber: index + 1,
    mode: row.mode,
    startedAt: row.started_at,
    completedAt: row.completed_at ?? row.started_at,
    correctAnswers: row.correct_answers ?? 0,
    totalQuestions: row.total_questions ?? 0,
  }))
}

export async function saveRemoteWeekAttempt(
  weekId: string,
  attempt: WeekAttemptSummary,
  answers: ActivityAnswer[],
): Promise<void> {
  if (!supabase) return

  const { data, error } = await supabase
    .from('week_attempts')
    .insert({
      week_id: weekId,
      attempt_number: attempt.attemptNumber,
      mode: attempt.mode,
      started_at: attempt.startedAt,
      completed_at: attempt.completedAt,
      correct_answers: attempt.correctAnswers,
      total_questions: attempt.totalQuestions,
      score_percent:
        attempt.totalQuestions > 0
          ? Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100)
          : null,
    })
    .select('id')
    .single()

  if (error || !data?.id || answers.length === 0) return

  await supabase.from('activity_results').insert(
    answers.map((answer) => ({
      attempt_id: data.id,
      week_id: weekId,
      activity_id: answer.activityId,
      question_id: answer.questionId,
      is_correct: answer.isCorrect,
      answer: answer.answer,
      expected_answer: answer.expectedAnswer,
      created_at: answer.createdAt,
    })),
  )
}
