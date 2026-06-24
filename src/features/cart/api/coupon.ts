import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type CouponValidation = components['schemas']['CouponValidation']

// Human messages for legacy coupon reason codes.
const REASON: Record<string, string> = {
  invalid: 'Неверный или несуществующий промокод',
  expired: 'Срок действия промокода истёк',
  cart_empty: 'Корзина пуста',
  not_for_courses: 'Промокод применим только к курсам',
  wrong_course: 'Промокод действует на другой курс',
  wrong_category: 'Промокод действует на другую категорию',
  wrong_items: 'Промокод не применим к товарам в корзине',
  not_for_user: 'Промокод недоступен для вашего аккаунта',
  min_order: 'Сумма заказа меньше минимальной для промокода',
}

export function couponMessage(code: string): string {
  return REASON[code] ?? 'Промокод недействителен'
}

export async function validateCoupon(coupon: string): Promise<CouponValidation> {
  const { data, error } = await api.POST('/api/v1/cart/coupon/validate', {
    body: { coupon },
  })
  if (error) throw new Error('Не удалось проверить промокод')
  return data
}
