import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

export const FAVORITES_QUERY_KEY = ['favorites'] as const

// The user's favorited courses (legacy FavoritesController@list).
export const favoritesQueryOptions = queryOptions({
  queryKey: FAVORITES_QUERY_KEY,
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/favorites', {})
    if (error) throw new Error('Не удалось загрузить избранное')
    return data
  },
})
