import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type CalendarEvent = components['schemas']['CalendarEvent']
export type EventsCalendar = components['schemas']['EventsCalendar']

export const eventsCalendarQueryOptions = queryOptions({
  queryKey: ['events-calendar'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/events-calendar', {})
    if (error) throw new Error('Не удалось загрузить календарь событий')
    return data
  },
})
