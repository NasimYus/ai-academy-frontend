import { useMutation, useQueryClient } from '@tanstack/react-query'

import { submitReview } from '#/features/write-review/api/review'
import type { ReviewInput } from '#/features/write-review/api/review'

export function useSubmitReview(courseId: number, slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: ReviewInput) => submitReview(courseId, input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['course', slug] }),
  })
}
