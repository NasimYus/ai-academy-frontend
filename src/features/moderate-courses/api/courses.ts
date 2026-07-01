import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type AdminCourse = components['schemas']['AdminCourseRead']
export type AdminCourseList = components['schemas']['AdminCourseList']

export const ADMIN_COURSES_KEY = ['admin', 'courses'] as const

export const adminCoursesQueryOptions = queryOptions({
  queryKey: ADMIN_COURSES_KEY,
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/admin/courses', {})
    if (error) throw new Error('Не удалось загрузить курсы')
    return data
  },
})

export async function approveCourse(courseId: number) {
  const { data, error } = await api.POST('/api/v1/admin/courses/{course_id}/approve', {
    params: { path: { course_id: courseId } },
  })
  if (error) throw new Error('Не удалось одобрить курс')
  return data
}

export async function rejectCourse(courseId: number) {
  const { data, error } = await api.POST('/api/v1/admin/courses/{course_id}/reject', {
    params: { path: { course_id: courseId } },
  })
  if (error) throw new Error('Не удалось отклонить курс')
  return data
}

export async function unpublishCourse(courseId: number) {
  const { data, error } = await api.POST('/api/v1/admin/courses/{course_id}/unpublish', {
    params: { path: { course_id: courseId } },
  })
  if (error) throw new Error('Не удалось снять курс с публикации')
  return data
}

export async function deleteCourse(courseId: number) {
  const { error } = await api.DELETE('/api/v1/admin/courses/{course_id}', {
    params: { path: { course_id: courseId } },
  })
  if (error) throw new Error('Не удалось удалить курс')
}
