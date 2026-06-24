import type { Order } from '#/entities/order'
import type { PaymentRequestResult } from '#/entities/payment'
import { api } from '#/shared/api'

export async function requestPayment(
  orderId: number,
  gatewayId: number,
): Promise<PaymentRequestResult> {
  const { data, error } = await api.POST('/api/v1/payments/request', {
    body: { order_id: orderId, gateway_id: gatewayId },
  })
  if (error) throw new Error('Не удалось начать оплату')
  return data
}

export async function verifyPayment(
  gateway: string,
  orderId: number,
  status: 'success' | 'failed',
): Promise<Order> {
  const { data, error } = await api.POST('/api/v1/payments/verify/{gateway}', {
    params: { path: { gateway } },
    body: { order_id: orderId, status },
  })
  if (error) throw new Error('Не удалось подтвердить оплату')
  return data
}
