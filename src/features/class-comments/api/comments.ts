import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type ClassComment = components['schemas']['CommentRead']

// Comments on the instructor's courses, threaded (legacy myClassComments).
export const classCommentsQueryOptions = queryOptions({
  queryKey: ['instructor-comments'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/comments', {})
    if (error) throw new Error('Не удалось загрузить комментарии')
    return data
  },
})

export async function replyToComment(commentId: number, reply: string) {
  const { error } = await api.POST('/api/v1/panel/comments/{comment_id}/reply', {
    params: { path: { comment_id: commentId } },
    body: { reply },
  })
  if (error) throw new Error('Не удалось отправить ответ')
}
