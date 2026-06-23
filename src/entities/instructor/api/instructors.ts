import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

export const instructorsQueryOptions = (search?: string) =>
  queryOptions({
    queryKey: ['instructors', search ?? ''],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/providers/instructors', {
        params: { query: { search } },
      })
      if (error) throw new Error('Не удалось загрузить преподавателей')
      return data.users
    },
  })

export const publicProfileQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: ['public-profile', userId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/users/{user_id}/profile', {
        params: { path: { user_id: userId } },
      })
      if (error) throw new Error('Не удалось загрузить профиль')
      return data
    },
  })
