import { api } from '#/shared/api'

// Buy a product: creates a pending ProductOrder + order, settle via /payments.
export async function payProduct(productId: number, quantity = 1, message?: string) {
  const { data, error } = await api.POST('/api/v1/products/{product_id}/pay', {
    params: { path: { product_id: productId } },
    body: { quantity, message_to_seller: message ?? null },
  })
  if (error) {
    const detail = error.detail
    throw new Error(detail === 'not_free' ? 'Товар бесплатный' : 'Не удалось оформить покупку')
  }
  return data
}
