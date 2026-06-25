import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// An instructor's sales (revenue) — paid items where they are the seller.
export const sellerSalesQueryOptions = queryOptions({
  queryKey: ['seller-sales'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/sales', {})
    if (error) throw new Error('Не удалось загрузить продажи')
    return data
  },
})
