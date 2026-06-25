import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { QuizCreateBody } from '#/features/manage-quiz/api/manage'
import { createQuiz, deleteQuiz, updateQuiz } from '#/features/manage-quiz/api/manage'

const KEY = ['instructor-quizzes']

export function useCreateQuiz() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: QuizCreateBody) => createQuiz(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useUpdateQuiz(quizId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: QuizCreateBody) => updateQuiz(quizId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteQuiz() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (quizId: number) => deleteQuiz(quizId),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
