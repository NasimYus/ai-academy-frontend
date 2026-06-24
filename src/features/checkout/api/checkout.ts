import type { Order } from '#/entities/order'
import { api } from '#/shared/api'

// Create a pending order from the cart, optionally applying a validated coupon.
export async function checkout(discountId?: number | null): Promise<Order> {
  const { data, error } = await api.POST('/api/v1/cart/checkout', {
    body: { discount_id: discountId ?? null },
  })
  if (error) throw new Error('Не удалось оформить заказ')
  return data
}
