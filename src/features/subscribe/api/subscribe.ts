import { api } from '#/shared/api'

const SUBSCRIBE_MESSAGE: Record<string, string> = {
  not_free: 'Этот план платный',
  not_subscribable: 'Курс недоступен по подписке',
  no_active_subscribe: 'У вас нет активной подписки',
  free: 'Курс бесплатный',
  already_purchased: 'У вас уже есть доступ к курсу',
}

export function subscribeMessage(detail: unknown): string {
  return (typeof detail === 'string' && SUBSCRIBE_MESSAGE[detail]) || 'Не удалось выполнить операцию'
}

// Activate a free plan (legacy pay; paid checkout deferred).
export async function activatePlan(planId: number): Promise<string> {
  const { data, error } = await api.POST('/api/v1/subscribe/{plan_id}/activate', {
    params: { path: { plan_id: planId } },
  })
  if (error) throw new Error(subscribeMessage(error.detail))
  return data.message
}

// Create a pending order for a paid plan, then settle it via /payments.
export async function payPlan(planId: number) {
  const { data, error } = await api.POST('/api/v1/subscribe/{plan_id}/pay', {
    params: { path: { plan_id: planId } },
  })
  if (error) throw new Error(subscribeMessage(error.detail))
  return data
}

// Use the active subscription to unlock a course (legacy apply).
export async function applySubscription(courseId: number): Promise<string> {
  const { data, error } = await api.POST('/api/v1/subscribe/apply', {
    body: { course_id: courseId },
  })
  if (error) throw new Error(subscribeMessage(error.detail))
  return data.message
}
