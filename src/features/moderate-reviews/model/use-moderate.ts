import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ADMIN_REVIEWS_KEY, approveReview, rejectReview } from '#/features/moderate-reviews/api/reviews'

function useReviewsInvalidate() {
  const qc = useQueryClient()
  return () => void qc.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEY })
}

export function useApproveReview() {
  const invalidate = useReviewsInvalidate()
  return useMutation({ mutationFn: (id: number) => approveReview(id), onSuccess: invalidate })
}

export function useRejectReview() {
  const invalidate = useReviewsInvalidate()
  return useMutation({ mutationFn: (id: number) => rejectReview(id), onSuccess: invalidate })
}
