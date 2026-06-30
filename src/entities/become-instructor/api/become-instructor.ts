import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type BecomeInstructorRequest = components['schemas']['BecomeInstructorRead']
export type BecomeInstructorAdminRequest = components['schemas']['BecomeInstructorAdminRead']

// The current user's become-instructor request (null if none).
export const myBecomeInstructorQueryOptions = queryOptions({
  queryKey: ['become-instructor'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/become-instructor', {})
    if (error) throw new Error('Не удалось загрузить заявку')
    return data
  },
})

// All requests for admin moderation.
export const adminBecomeInstructorsQueryOptions = queryOptions({
  queryKey: ['admin-become-instructors'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/admin/become-instructors', {})
    if (error) throw new Error('Не удалось загрузить заявки')
    return data
  },
})
