import { api } from '#/shared/api'

export async function setFollow(userId: number, follow: boolean): Promise<void> {
  const { error } = await api.POST('/api/v1/users/{user_id}/follow', {
    params: { path: { user_id: userId } },
    body: { status: follow },
  })
  if (error) throw new Error('Не удалось изменить подписку')
}
