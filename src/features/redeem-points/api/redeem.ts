import { api } from '#/shared/api'

const REDEEM_MESSAGE: Record<string, string> = {
  no_points: 'Этот курс нельзя купить за баллы',
  free: 'Курс бесплатный',
  already_purchased: 'У вас уже есть доступ к курсу',
  no_enough_points: 'Недостаточно баллов',
  rewards_disabled: 'Программа баллов отключена',
}

export function redeemMessage(detail: unknown): string {
  return (typeof detail === 'string' && REDEEM_MESSAGE[detail]) || 'Не удалось выполнить операцию'
}

// Redeem points for a course (legacy buyWithPoint).
export async function redeemCourse(courseId: number): Promise<string> {
  const { data, error } = await api.POST('/api/v1/rewards/webinar/{course_id}/apply', {
    params: { path: { course_id: courseId } },
  })
  if (error) throw new Error(redeemMessage(error.detail))
  return data.message
}

// Exchange points to wallet (legacy exchange).
export async function exchangePoints(): Promise<string> {
  const { data, error } = await api.POST('/api/v1/rewards/exchange', {})
  if (error) throw new Error(redeemMessage(error.detail))
  return data.message
}
