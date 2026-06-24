import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

export const ORDERS_QUERY_KEY = ['orders'] as const

// The user's orders, newest first.
export const ordersQueryOptions = queryOptions({
  queryKey: ORDERS_QUERY_KEY,
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/orders', {})
    if (error) throw new Error('Не удалось загрузить заказы')
    return data
  },
})

export const orderQueryOptions = (orderId: number) =>
  queryOptions({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/panel/orders/{order_id}', {
        params: { path: { order_id: orderId } },
      })
      if (error) throw new Error('Не удалось загрузить заказ')
      return data
    },
  })
