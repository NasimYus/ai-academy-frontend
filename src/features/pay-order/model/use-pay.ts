import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ORDERS_QUERY_KEY } from '#/entities/order'
import { requestPayment, verifyPayment } from '#/features/pay-order/api/pay'

export function useRequestPayment() {
  return useMutation({
    mutationFn: ({ orderId, gatewayId }: { orderId: number; gatewayId: number }) =>
      requestPayment(orderId, gatewayId),
  })
}

export function useVerifyPayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      gateway,
      orderId,
      status,
    }: {
      gateway: string
      orderId: number
      status: 'success' | 'failed'
    }) => verifyPayment(gateway, orderId, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDERS_QUERY_KEY }),
  })
}
