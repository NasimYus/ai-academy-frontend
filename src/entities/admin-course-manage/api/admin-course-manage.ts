import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type AdminCourseManageList = components['schemas']['AdminCourseManageList']
export type AdminCourseManageRow = components['schemas']['AdminCourseManageRow']
export type LiveSessionList = components['schemas']['LiveSessionList']
export type CourseType = components['schemas']['CourseType']
export type CourseStatus = components['schemas']['CourseStatus']

export interface ManageFilters {
  type: CourseType
  search?: string
  from?: string
  to?: string
  category_id?: number
  status?: CourseStatus
  sort?: string
  page?: number
}

export const adminCoursesManageQueryOptions = (filters: ManageFilters) =>
  queryOptions({
    queryKey: ['admin-courses-manage', filters],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/admin/courses/manage', {
        params: {
          query: {
            type: filters.type,
            search: filters.search || undefined,
            from: filters.from || undefined,
            to: filters.to || undefined,
            category_id: filters.category_id ?? undefined,
            status: filters.status ?? undefined,
            sort: filters.sort || undefined,
            page: filters.page ?? 1,
          },
        },
      })
      if (error) throw new Error('Не удалось загрузить список курсов')
      return data
    },
  })

export const adminLiveSessionsQueryOptions = (page = 1) =>
  queryOptions({
    queryKey: ['admin-live-sessions', page],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/admin/courses/live-sessions', {
        params: { query: { page } },
      })
      if (error) throw new Error('Не удалось загрузить историю живых сессий')
      return data
    },
  })
