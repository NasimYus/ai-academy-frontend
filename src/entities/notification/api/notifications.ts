import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const

// The user's notifications (legacy NotificationsController@list). Returns the
// full list ({ count, notifications }); the unread badge counts client-side.
export const notificationsQueryOptions = queryOptions({
  queryKey: NOTIFICATIONS_QUERY_KEY,
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/notifications', {})
    if (error) throw new Error('Не удалось загрузить уведомления')
    return data
  },
})
