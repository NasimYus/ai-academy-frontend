import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ContentItemInput, ItemType } from '#/features/manage-course/api/content'
import {
  createChapter,
  createItem,
  deleteChapter,
  deleteItem,
  renameChapter,
  reorderChapters,
  updateItem,
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

export function useItemMutations(courseId: number) {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['course-content', courseId] })

  const create = useMutation({
    mutationFn: ({ chapterId, type, body }: { chapterId: number; type: ItemType; body: ContentItemInput }) =>
      createItem(chapterId, type, body),
    onSuccess: invalidate,
  })
  const update = useMutation({
    mutationFn: ({ type, id, body }: { type: ItemType; id: number; body: ContentItemInput }) =>
      updateItem(type, id, body),
    onSuccess: invalidate,
  })
  const remove = useMutation({
    mutationFn: ({ type, id }: { type: ItemType; id: number }) => deleteItem(type, id),
    onSuccess: invalidate,
  })

  return { create, update, remove }
}
