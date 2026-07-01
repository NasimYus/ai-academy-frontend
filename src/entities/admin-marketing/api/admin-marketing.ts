import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type AdminMarketing = components['schemas']['AdminMarketing']

export const adminMarketingQueryOptions = queryOptions({
  queryKey: ['admin-marketing'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/admin/marketing', {})
    if (error) throw new Error('Не удалось загрузить маркетинговую панель')
    return data
  },
})
