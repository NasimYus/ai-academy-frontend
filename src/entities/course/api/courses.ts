import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// Reusable query for the course catalogue. Lives in the entity layer so any
// page/widget can compose it without duplicating the fetch logic.
export const coursesQueryOptions = queryOptions({
  queryKey: ['courses'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/courses', {})
    if (error) throw new Error('Не удалось загрузить курсы')
    return data
  },
})

// Single course detail by slug (legacy WebinarController@show).
export const courseQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['course', slug],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/courses/{slug}', {
        params: { path: { slug } },
      })
      if (error) throw new Error('Не удалось загрузить курс')
      return data
    },
  })
