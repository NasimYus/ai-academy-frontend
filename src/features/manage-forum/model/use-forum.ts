import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ForumTopicCreate } from '#/features/manage-forum/api/forum-actions'
import { createTopic, replyToTopic } from '#/features/manage-forum/api/forum-actions'

export function useCreateTopic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: ForumTopicCreate) => createTopic(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['forum-topics'] })
      void qc.invalidateQueries({ queryKey: ['forum-my-topics'] })
    },
  })
}

export function useReplyToTopic(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ topicId, description }: { topicId: number; description: string }) =>
      replyToTopic(topicId, description),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['forum-topic', slug] })
      void qc.invalidateQueries({ queryKey: ['forum-my-posts'] })
    },
  })
}
