import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

export const CART_QUERY_KEY = ['cart'] as const

// The user's cart with computed amounts (legacy CartController@index).
export const cartQueryOptions = queryOptions({
  queryKey: CART_QUERY_KEY,
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/cart', {})
    if (error) throw new Error('Не удалось загрузить корзину')
    return data
  },
})
