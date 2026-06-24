import { useMutation, useQueryClient } from '@tanstack/react-query'

import { CART_QUERY_KEY } from '#/entities/cart'
import { ORDERS_QUERY_KEY } from '#/entities/order'
import { checkout } from '#/features/checkout/api/checkout'

export function useCheckout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (discountId?: number | null) => checkout(discountId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: CART_QUERY_KEY })
      void qc.invalidateQueries({ queryKey: ORDERS_QUERY_KEY })
    },
  })
}
