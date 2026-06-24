import { api } from '#/shared/api'

export async function markNotificationSeen(notificationId: number): Promise<void> {
  const { error } = await api.POST('/api/v1/notifications/{notification_id}/seen', {
    params: { path: { notification_id: notificationId } },
  })
  if (error) throw new Error('Не удалось отметить уведомление прочитанным')
}
