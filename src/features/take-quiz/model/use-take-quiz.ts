import { useMutation } from '@tanstack/react-query'

import type { AnswerSheetItem } from '#/features/take-quiz/api/take-quiz'
import { startQuiz, storeResult } from '#/features/take-quiz/api/take-quiz'

export function useStartQuiz() {
  return useMutation({ mutationFn: (quizId: number) => startQuiz(quizId) })
}

interface StoreArgs {
  quizId: number
  quizResultId: number
  answerSheet: AnswerSheetItem[]
}

export function useStoreResult() {
  return useMutation({
    mutationFn: ({ quizId, quizResultId, answerSheet }: StoreArgs) =>
      storeResult(quizId, quizResultId, answerSheet),
  })
}
