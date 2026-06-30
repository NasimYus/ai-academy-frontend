import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type MyComment = components['schemas']['MyCommentRead']

// The student's own comments (legacy panel courses/my-comments).
export const myCommentsQueryOptions = queryOptions({
  queryKey: ['my-comments'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/my-comments', {})
    if (error) throw new Error('Не удалось загрузить комментарии')
    return data
  },
})
