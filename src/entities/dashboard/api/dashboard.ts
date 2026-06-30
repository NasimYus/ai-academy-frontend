import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type DashboardSummary = components['schemas']['DashboardSummary']
export type InstructorDashboard = components['schemas']['InstructorDashboard']

export const dashboardQueryOptions = queryOptions({
  queryKey: ['dashboard'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/dashboard', {})
    if (error) throw new Error('Не удалось загрузить дашборд')
    return data
  },
})

// Instructor panel home — counters + course-management cards.
export const instructorDashboardQueryOptions = queryOptions({
  queryKey: ['instructor-dashboard'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/instructor-dashboard', {})
    if (error) throw new Error('Не удалось загрузить дашборд преподавателя')
    return data
  },
})
