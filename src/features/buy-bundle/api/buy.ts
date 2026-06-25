import { api } from '#/shared/api'

const BUY_MESSAGE: Record<string, string> = {
  not_free: 'Набор платный',
  already_purchased: 'У вас уже есть доступ к набору',
  no_points: 'Этот набор нельзя купить за баллы',
  no_enough_points: 'Недостаточно баллов',
}

export function buyMessage(detail: unknown): string {
  return (typeof detail === 'string' && BUY_MESSAGE[detail]) || 'Не удалось оформить набор'
}

// Enroll in a free bundle (legacy BundleController@free).
export async function buyFreeBundle(bundleId: number): Promise<string> {
  const { data, error } = await api.POST('/api/v1/bundles/{bundle_id}/free', {
    params: { path: { bundle_id: bundleId } },
  })
  if (error) throw new Error(buyMessage(error.detail))
  return data.message
}

// Redeem points for a bundle (legacy BundleController@buyWithPoint).
export async function buyBundleWithPoints(bundleId: number): Promise<string> {
  const { data, error } = await api.POST('/api/v1/bundles/{bundle_id}/buyWithPoint', {
    params: { path: { bundle_id: bundleId } },
  })
  if (error) throw new Error(buyMessage(error.detail))
  return data.message
}
