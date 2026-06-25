import { useMutation, useQueryClient } from '@tanstack/react-query'

import { activatePlan, applySubscription } from '#/features/subscribe/api/subscribe'

export function useActivatePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (planId: number) => activatePlan(planId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscriptions'] }),
  })
}

export function useApplySubscription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId: number) => applySubscription(courseId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['subscriptions'] })
      void qc.invalidateQueries({ queryKey: ['my-courses'] })
    },
  })
}
