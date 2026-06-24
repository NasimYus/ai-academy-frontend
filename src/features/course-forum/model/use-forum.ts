import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createAnswer,
  createThread,
  toggleAnswerPin,
  toggleResolve,
  toggleThreadPin,
} from '#/features/course-forum/api/forum-actions'
import type { NewThreadInput } from '#/features/course-forum/api/forum-actions'

export function useCreateThread(courseId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: NewThreadInput) => createThread(courseId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['course-forums', courseId] }),
  })
}

export function useToggleThreadPin(courseId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (forumId: number) => toggleThreadPin(forumId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['course-forums', courseId] }),
  })
}

export function useCreateAnswer(courseId: number, forumId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (description: string) => createAnswer(forumId, description),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['forum-answers', forumId] })
      void qc.invalidateQueries({ queryKey: ['course-forums', courseId] })
    },
  })
}

export function useToggleAnswerPin(forumId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (answerId: number) => toggleAnswerPin(answerId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['forum-answers', forumId] }),
  })
}

export function useResolveAnswer(courseId: number, forumId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (answerId: number) => toggleResolve(answerId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['forum-answers', forumId] })
      void qc.invalidateQueries({ queryKey: ['course-forums', courseId] })
    },
  })
}
