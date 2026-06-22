import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// Reusable query for the course catalogue. Lives in the entity layer so any
// page/widget can compose it without duplicating the fetch logic.
export const coursesQueryOptions = queryOptions({
  queryKey: ['courses'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/courses', {})
    if (error || !data) throw new Error('Не удалось загрузить курсы')
    return data
  },
})
