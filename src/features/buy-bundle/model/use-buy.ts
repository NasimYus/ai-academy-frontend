import { useMutation, useQueryClient } from '@tanstack/react-query'

import { buyBundleWithPoints, buyFreeBundle } from '#/features/buy-bundle/api/buy'

function useBundleInvalidation(bundleId: number) {
  const qc = useQueryClient()
  return () => {
    void qc.invalidateQueries({ queryKey: ['bundle', bundleId] })
    void qc.invalidateQueries({ queryKey: ['my-courses'] })
  }
}

export function useBuyFreeBundle(bundleId: number) {
  const invalidate = useBundleInvalidation(bundleId)
  return useMutation({ mutationFn: () => buyFreeBundle(bundleId), onSuccess: invalidate })
}

export function useBuyBundleWithPoints(bundleId: number) {
  const invalidate = useBundleInvalidation(bundleId)
  return useMutation({ mutationFn: () => buyBundleWithPoints(bundleId), onSuccess: invalidate })
}
