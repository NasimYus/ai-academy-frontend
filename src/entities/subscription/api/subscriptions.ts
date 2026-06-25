import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// Subscription plans + the user's active subscription (legacy list).
export const subscriptionsQueryOptions = queryOptions({
  queryKey: ['subscriptions'],
  queryFn: async () => {
    const { data } = await api.GET('/api/v1/subscribe', {})
    return data ?? { count: 0, subscribes: [], subscribed: null, day_of_use: null }
  },
})
