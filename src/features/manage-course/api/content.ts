import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type ChapterManage = components['schemas']['ChapterManage']

export const contentQueryOptions = (courseId: number) =>
  queryOptions({
    queryKey: ['course-content', courseId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/panel/webinar/{course_id}/content', {
        params: { path: { course_id: courseId } },
      })
      if (error) throw new Error('Не удалось загрузить контент')
      return data
    },
    enabled: courseId > 0,
  })

export async function createChapter(courseId: number, title: string) {
  const { data, error } = await api.POST('/api/v1/panel/webinar/{course_id}/chapters', {
    params: { path: { course_id: courseId } },
    body: { title },
  })
  if (error) throw new Error('Не удалось создать раздел')
  return data
}

export async function renameChapter(chapterId: number, title: string) {
  const { data, error } = await api.PUT('/api/v1/panel/chapters/{chapter_id}', {
    params: { path: { chapter_id: chapterId } },
    body: { title },
  })
  if (error) throw new Error('Не удалось переименовать раздел')
  return data
}

export async function deleteChapter(chapterId: number) {
  const { error } = await api.DELETE('/api/v1/panel/chapters/{chapter_id}', {
    params: { path: { chapter_id: chapterId } },
  })
  if (error) throw new Error('Не удалось удалить раздел')
}

export async function reorderChapters(courseId: number, orderedIds: number[]) {
  const { error } = await api.PUT('/api/v1/panel/webinar/{course_id}/chapters/order', {
    params: { path: { course_id: courseId } },
    body: { ordered_ids: orderedIds },
  })
  if (error) throw new Error('Не удалось изменить порядок')
}
