import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { BundleCreateBody } from '#/features/manage-bundle/api/manage'
import { createBundle, deleteBundle } from '#/features/manage-bundle/api/manage'

export function useDeleteBundle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (bundleId: number) => deleteBundle(bundleId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['instructor-bundles'] })
      void qc.invalidateQueries({ queryKey: ['admin-bundles'] })
    },
  })
}

export function useCreateBundle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: BundleCreateBody) => createBundle(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['instructor-bundles'] })
      void qc.invalidateQueries({ queryKey: ['admin-bundles'] })
    },
  })
}
