import { api } from '#/shared/api'

// Legacy 422 detail codes → human messages.
const SUBSCRIBE_MESSAGE: Record<string, string> = {
  already_subscribed: 'Этот email уже подписан',
}

export function subscribeMessage(detail: unknown): string {
  return (typeof detail === 'string' && SUBSCRIBE_MESSAGE[detail]) || 'Не удалось подписаться'
}

// Subscribe an email to the newsletter (legacy UserController@makeNewsletter).
export async function subscribeNewsletter(email: string): Promise<string> {
  const { data, error } = await api.POST('/api/v1/newsletter', { body: { email } })
  if (error) throw new Error(subscribeMessage(error.detail))
  return data.message
}
