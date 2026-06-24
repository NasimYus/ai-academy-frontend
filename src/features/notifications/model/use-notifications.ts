import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { NOTIFICATIONS_QUERY_KEY, notificationsQueryOptions } from '#/entities/notification'
import { useSessionStore } from '#/entities/session'

import { markNotificationSeen } from '#/features/notifications/api/seen'

/** The signed-in user's notifications (disabled when anonymous). */
export function useNotifications() {
  const token = useSessionStore((s) => s.token)
  return useQuery({ ...notificationsQueryOptions, enabled: !!token })
}

/** Count of unread notifications (0 when loading/anonymous). */
export function useUnreadCount(): number {
  const { data } = useNotifications()
  return (data?.notifications ?? []).filter((n) => n.status === 'unread').length
}

export function useMarkSeen() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (notificationId: number) => markNotificationSeen(notificationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY }),
  })
}
