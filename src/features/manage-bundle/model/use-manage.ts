import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteBundle } from '#/features/manage-bundle/api/manage'

export function useDeleteBundle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (bundleId: number) => deleteBundle(bundleId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructor-bundles'] }),
  })
}
