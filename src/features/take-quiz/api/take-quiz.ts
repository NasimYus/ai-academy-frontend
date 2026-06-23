import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type AnswerSheetItem = components['schemas']['AnswerSheetItem']

// Legacy 403 `detail` codes from the start gate → human messages.
const GATE_MESSAGE: Record<string, string> = {
  not_purchased: 'Запишитесь на курс, чтобы пройти тест',
  passed: 'Вы уже прошли этот тест',
  max_attempt: 'Исчерпаны попытки прохождения',
}

export function gateMessage(detail: unknown): string {
  return (typeof detail === 'string' && GATE_MESSAGE[detail]) || 'Не удалось начать тест'
}

// Begin an attempt: server gates access/attempts then returns the quiz with
// questions + a fresh quiz_result_id (legacy QuizzesController start).
export async function startQuiz(quizId: number) {
  const { data, error } = await api.GET('/api/v1/quizzes/{quiz_id}/start', {
    params: { path: { quiz_id: quizId } },
  })
  if (error) throw new Error(gateMessage(error.detail))
  return data
}

// Grade and persist an attempt (legacy quizzesStoreResult).
export async function storeResult(
  quizId: number,
  quizResultId: number,
  answerSheet: AnswerSheetItem[],
) {
  const { data, error } = await api.POST('/api/v1/quizzes/{quiz_id}/store-result', {
    params: { path: { quiz_id: quizId } },
    body: { quiz_result_id: quizResultId, answer_sheet: answerSheet },
  })
  if (error) throw new Error('Не удалось сохранить результат')
  return data
}
