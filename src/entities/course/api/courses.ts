import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

export interface CourseFilters {
  cat?: number
  free?: boolean
  type?: 'webinar' | 'course' | 'text_lesson'
  sort?: 'newest' | 'oldest' | 'expensive' | 'cheapest'
}

// Course catalogue with legacy handleFilters params. Lives in the entity layer
// so any page/widget can compose it.
export const coursesQueryOptions = (filters: CourseFilters = {}) =>
  queryOptions({
    queryKey: ['courses', filters],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/courses', {
        params: {
          query: {
            cat: filters.cat,
            free: filters.free,
            type: filters.type,
            sort: filters.sort,
          },
        },
      })
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
