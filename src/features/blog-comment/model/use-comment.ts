import { useMutation, useQueryClient } from '@tanstack/react-query'

import { BLOG_QUERY_KEY } from '#/entities/blog'

import { postBlogComment } from '#/features/blog-comment/api/comment'

export function usePostBlogComment(blogId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { comment: string; replyId?: number }) =>
      postBlogComment(blogId, vars.comment, vars.replyId),
    onSuccess: () => qc.invalidateQueries({ queryKey: BLOG_QUERY_KEY }),
  })
}
