import type { CartItem } from '#/entities/cart'
import { api } from '#/shared/api'

// Legacy add-to-cart reject codes → human messages.
const ADD_MESSAGE: Record<string, string> = {
  already_in_cart: 'Курс уже в корзине',
  already_purchased: 'У вас уже есть доступ к курсу',
}

export function addToCartMessage(detail: unknown): string {
  return (typeof detail === 'string' && ADD_MESSAGE[detail]) || 'Не удалось добавить в корзину'
}

export async function addToCart(courseId: number): Promise<CartItem> {
  const { data, error } = await api.POST('/api/v1/cart', {
    body: { item_id: courseId, item_name: 'webinar' },
  })
  if (error) throw new Error(addToCartMessage(error.detail))
  return data
}

export async function removeFromCart(itemId: number): Promise<void> {
  const { error } = await api.DELETE('/api/v1/cart/{item_id}', {
    params: { path: { item_id: itemId } },
  })
  if (error) throw new Error('Не удалось удалить из корзины')
}
