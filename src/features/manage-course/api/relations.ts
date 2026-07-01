import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type PrerequisiteRead = components['schemas']['PrerequisiteRead']
export type RelatedRead = components['schemas']['RelatedRead']

export const prerequisitesQueryOptions = (courseId: number) =>
  queryOptions({
    queryKey: ['course-prerequisites', courseId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/panel/webinar/{course_id}/prerequisites', {
        params: { path: { course_id: courseId } },
      })
      if (error) throw new Error('Не удалось загрузить требования')
      return data
    },
    enabled: courseId > 0,
  })

export const relatedQueryOptions = (courseId: number) =>
  queryOptions({
    queryKey: ['course-related', courseId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/panel/webinar/{course_id}/related', {
        params: { path: { course_id: courseId } },
      })
      if (error) throw new Error('Не удалось загрузить связанные курсы')
      return data
    },
    enabled: courseId > 0,
  })

export async function addPrerequisite(courseId: number, prerequisiteId: number, required: boolean) {
  const { data, error } = await api.POST('/api/v1/panel/webinar/{course_id}/prerequisites', {
    params: { path: { course_id: courseId } },
    body: { prerequisite_id: prerequisiteId, required },
  })
  if (error) throw new Error('Не удалось добавить требование')
  return data
}

export async function deletePrerequisite(rowId: number) {
  const { error } = await api.DELETE('/api/v1/panel/prerequisites/{row_id}', {
    params: { path: { row_id: rowId } },
  })
  if (error) throw new Error('Не удалось удалить требование')
}

export async function addRelated(courseId: number, relatedId: number) {
  const { data, error } = await api.POST('/api/v1/panel/webinar/{course_id}/related', {
    params: { path: { course_id: courseId } },
    body: { related_id: relatedId },
  })
  if (error) throw new Error('Не удалось добавить связанный курс')
  return data
}

export async function deleteRelated(rowId: number) {
  const { error } = await api.DELETE('/api/v1/panel/related/{row_id}', {
    params: { path: { row_id: rowId } },
  })
  if (error) throw new Error('Не удалось удалить связанный курс')
}
