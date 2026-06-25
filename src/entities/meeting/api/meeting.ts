import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

export const MEETING_QUERY_KEY = ['meeting'] as const

// The instructor's own consultation config + slots.
export const meetingConfigQueryOptions = queryOptions({
  queryKey: [...MEETING_QUERY_KEY, 'config'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/meeting', {})
    if (error) throw new Error('Не удалось загрузить настройки консультаций')
    return data
  },
})

// An instructor's public, bookable availability (null if none/disabled).
export const instructorMeetingQueryOptions = (instructorId: number) =>
  queryOptions({
    queryKey: [...MEETING_QUERY_KEY, 'instructor', instructorId],
    queryFn: async () => {
      const { data } = await api.GET('/api/v1/users/{instructor_id}/meeting', {
        params: { path: { instructor_id: instructorId } },
      })
      return data ?? null
    },
  })

// My reservations + requests on my meetings.
export const meetingsIndexQueryOptions = queryOptions({
  queryKey: [...MEETING_QUERY_KEY, 'index'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/meetings', {})
    if (error) throw new Error('Не удалось загрузить встречи')
    return data
  },
})
