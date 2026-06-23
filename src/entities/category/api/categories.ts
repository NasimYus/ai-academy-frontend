import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// These public endpoints declare no error responses, so a network failure
// rejects (caught by React Query) rather than populating `error`.
export const categoriesQueryOptions = queryOptions({
  queryKey: ['categories'],
  queryFn: async () => {
    const { data } = await api.GET('/api/v1/categories', {})
    return data?.categories ?? []
  },
})

export const trendCategoriesQueryOptions = queryOptions({
  queryKey: ['trend-categories'],
  queryFn: async () => {
    const { data } = await api.GET('/api/v1/trend-categories', {})
    return data?.categories ?? []
  },
})
