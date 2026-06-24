import { useMutation, useQueryClient } from '@tanstack/react-query'

import { exchangePoints, redeemCourse } from '#/features/redeem-points/api/redeem'

function useRewardsInvalidation() {
  const qc = useQueryClient()
  return () => {
    void qc.invalidateQueries({ queryKey: ['rewards-overview'] })
    void qc.invalidateQueries({ queryKey: ['reward-courses'] })
    void qc.invalidateQueries({ queryKey: ['my-courses'] })
  }
}

export function useRedeemCourse() {
  const invalidate = useRewardsInvalidation()
  return useMutation({
    mutationFn: (courseId: number) => redeemCourse(courseId),
    onSuccess: invalidate,
  })
}

export function useExchangePoints() {
  const invalidate = useRewardsInvalidation()
  return useMutation({ mutationFn: () => exchangePoints(), onSuccess: invalidate })
}
