import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type AdminDashboard = components['schemas']['AdminDashboard']

export const adminDashboardQueryOptions = queryOptions({
  queryKey: ['admin-dashboard'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/admin/dashboard', {})
    if (error) throw new Error('Не удалось загрузить панель управления')
    return data
  },
})
