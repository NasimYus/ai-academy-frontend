import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

export const SUPPORT_QUERY_KEY = ['support'] as const

// All of the user's support, grouped (legacy SupportsController@index).
export const supportIndexQueryOptions = queryOptions({
  queryKey: [...SUPPORT_QUERY_KEY, 'index'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/support', {})
    if (error) throw new Error('Не удалось загрузить обращения')
    return data
  },
})

// A single ticket with its conversation thread.
export const supportDetailQueryOptions = (supportId: number) =>
  queryOptions({
    queryKey: [...SUPPORT_QUERY_KEY, 'detail', supportId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/support/{support_id}', {
        params: { path: { support_id: supportId } },
      })
      if (error) throw new Error('Не удалось загрузить обращение')
      return data
    },
  })

// Platform support departments (for opening a platform ticket).
export const supportDepartmentsQueryOptions = queryOptions({
  queryKey: [...SUPPORT_QUERY_KEY, 'departments'],
  queryFn: async () => {
    const { data } = await api.GET('/api/v1/support/departments', {})
    return data ?? []
  },
})
