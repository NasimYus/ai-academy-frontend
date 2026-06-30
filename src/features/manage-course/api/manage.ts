import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type CourseCreateBody = components['schemas']['CourseCreate']
export type CourseUpdateBody = components['schemas']['CourseUpdate']

const MANAGE_MESSAGE: Record<string, string> = {
  category_not_found: 'Категория не найдена',
  start_date_required: 'Для вебинара укажите дату старта',
}

export function manageMessage(detail: unknown): string {
  return (typeof detail === 'string' && MANAGE_MESSAGE[detail]) || 'Не удалось сохранить курс'
}

// The instructor's own courses (legacy classes list; ungated error → data guard).
export const classesQueryOptions = queryOptions({
  queryKey: ['instructor-classes'],
  queryFn: async () => {
    const { data } = await api.GET('/api/v1/panel/classes', {})
    return data ?? []
  },
})

export const editCourseQueryOptions = (courseId: number) =>
  queryOptions({
    queryKey: ['instructor-course', courseId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/panel/webinar/{course_id}/edit', {
        params: { path: { course_id: courseId } },
      })
      if (error) throw new Error('Не удалось загрузить курс')
      return data
    },
    enabled: courseId > 0,
  })

export const courseStatisticsQueryOptions = (courseId: number) =>
  queryOptions({
    queryKey: ['course-statistics', courseId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/panel/webinar/{course_id}/statistic', {
        params: { path: { course_id: courseId } },
      })
      if (error) throw new Error('Не удалось загрузить статистику')
      return data
    },
    enabled: courseId > 0,
  })

export async function createCourse(body: CourseCreateBody) {
  const { data, error } = await api.POST('/api/v1/panel/webinar', { body })
  if (error) throw new Error(manageMessage(error.detail))
  return data
}

export async function updateCourse(courseId: number, body: CourseUpdateBody) {
  const { data, error } = await api.PUT('/api/v1/panel/webinar/{course_id}', {
    params: { path: { course_id: courseId } },
    body,
  })
  if (error) throw new Error(manageMessage(error.detail))
  return data
}

export async function deleteCourse(courseId: number) {
  const { error } = await api.DELETE('/api/v1/panel/webinar/{course_id}', {
    params: { path: { course_id: courseId } },
  })
  if (error) throw new Error('Не удалось удалить курс')
}

export type CourseMediaKind = 'thumbnail' | 'image_cover' | 'icon' | 'demo_video'

// Upload a course asset, returns its stored path to put into the create/update body.
export async function uploadCourseMedia(file: File, kind: CourseMediaKind): Promise<string> {
  const { data, error } = await api.POST('/api/v1/panel/webinar/media', {
    body: {} as never,
    bodySerializer: () => {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('kind', kind)
      return fd
    },
  })
  if (error) throw new Error('Не удалось загрузить файл')
  return data.path
}
