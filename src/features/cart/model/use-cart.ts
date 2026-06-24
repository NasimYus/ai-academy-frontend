import { useMutation, useQueryClient } from '@tanstack/react-query'

import { CART_QUERY_KEY } from '#/entities/cart'
import { addToCart, removeFromCart } from '#/features/cart/api/cart-actions'

export function useAddToCart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId: number) => addToCart(courseId),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_QUERY_KEY }),
  })
}

export function useRemoveFromCart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: number) => removeFromCart(itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_QUERY_KEY }),
  })
}
