import { useMutation, useQueryClient } from '@tanstack/react-query'

import { payProduct } from '#/features/buy-product/api/buy'

export function usePayProduct(productId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { quantity: number; message?: string }) =>
      payProduct(productId, vars.quantity, vars.message),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}
