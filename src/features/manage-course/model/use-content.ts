import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createChapter,
  deleteChapter,
  renameChapter,
  reorderChapters,
} from '#/features/manage-course/api/content'

export function useChapterMutations(courseId: number) {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['course-content', courseId] })

  const create = useMutation({
    mutationFn: (title: string) => createChapter(courseId, title),
    onSuccess: invalidate,
  })
  const rename = useMutation({
    mutationFn: ({ id, title }: { id: number; title: string }) => renameChapter(id, title),
    onSuccess: invalidate,
  })
  const remove = useMutation({
    mutationFn: (id: number) => deleteChapter(id),
    onSuccess: invalidate,
  })
  const reorder = useMutation({
    mutationFn: (orderedIds: number[]) => reorderChapters(courseId, orderedIds),
    onSuccess: invalidate,
  })

  return { create, rename, remove, reorder }
}
