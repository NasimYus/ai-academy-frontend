import type { AnswerSheetItem } from '#/features/take-quiz/api/take-quiz'

// Answer id (multiple choice) or free text (descriptive).
export type AnswerValue = number | string

// Flatten the per-question answer map into the legacy answer_sheet payload.
export function buildAnswerSheet(answers: Record<number, AnswerValue>): AnswerSheetItem[] {
  return Object.entries(answers).map(([questionId, answer]) => ({
    question_id: Number(questionId),
    answer,
  }))
}
