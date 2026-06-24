import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// Active payment gateways the user can pay with.
export const paymentChannelsQueryOptions = queryOptions({
  queryKey: ['payment-channels'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/payments/channels', {})
    if (error) throw new Error('Не удалось загрузить способы оплаты')
    return data
  },
})
