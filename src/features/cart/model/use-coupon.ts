import { useMutation } from '@tanstack/react-query'

import { validateCoupon } from '#/features/cart/api/coupon'

export function useValidateCoupon() {
  return useMutation({ mutationFn: (coupon: string) => validateCoupon(coupon) })
}
