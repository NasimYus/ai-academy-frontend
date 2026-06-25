import { useMutation, useQueryClient } from '@tanstack/react-query'

import { activatePackage } from '#/features/activate-package/api/activate'

export function useActivatePackage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (packageId: number) => activatePackage(packageId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['registration-packages'] }),
  })
}
