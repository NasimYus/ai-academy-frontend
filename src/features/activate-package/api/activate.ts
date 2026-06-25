import { api } from '#/shared/api'

const ACTIVATE_MESSAGE: Record<string, string> = {
  not_free: 'Этот пакет платный',
  wrong_role: 'Пакет не для вашей роли',
}

export function activateMessage(detail: unknown): string {
  return (typeof detail === 'string' && ACTIVATE_MESSAGE[detail]) || 'Не удалось активировать пакет'
}

export async function activatePackage(packageId: number): Promise<string> {
  const { data, error } = await api.POST('/api/v1/registration-packages/{package_id}/activate', {
    params: { path: { package_id: packageId } },
  })
  if (error) throw new Error(activateMessage(error.detail))
  return data.message
}
