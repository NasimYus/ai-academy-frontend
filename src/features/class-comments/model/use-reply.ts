import { useMutation, useQueryClient } from '@tanstack/react-query'

import { replyToComment } from '#/features/class-comments/api/comments'

export function useReplyComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { commentId: number; reply: string }) =>
      replyToComment(vars.commentId, vars.reply),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructor-comments'] }),
  })
}
