import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type QuizCreateBody = components['schemas']['QuizCreate']
export type QuizManage = components['schemas']['QuizManageRead']
export type QuizResultsOverview = components['schemas']['QuizResultsOverview']

// Instructor quiz dashboard: own quizzes + attempt results + stats.
export const quizResultsQueryOptions = queryOptions({
  queryKey: ['instructor-quizzes'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/quizzes/list', {})
    if (error) throw new Error('Не удалось загрузить тесты')
    return data
  },
})

export async function createQuiz(body: QuizCreateBody) {
  const { data, error } = await api.POST('/api/v1/panel/quizzes', { body })
  if (error) throw new Error('Не удалось создать тест')
  return data
}

export async function updateQuiz(quizId: number, body: QuizCreateBody) {
  const { data, error } = await api.PUT('/api/v1/panel/quizzes/{quiz_id}', {
    params: { path: { quiz_id: quizId } },
    body,
  })
  if (error) throw new Error('Не удалось обновить тест')
  return data
}

export async function deleteQuiz(quizId: number) {
  const { error } = await api.DELETE('/api/v1/panel/quizzes/{quiz_id}', {
    params: { path: { quiz_id: quizId } },
  })
  if (error) throw new Error('Не удалось удалить тест')
}
