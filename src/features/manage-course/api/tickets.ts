import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type TicketRead = components['schemas']['TicketRead']
export type TicketInput = components['schemas']['TicketInput']

export const ticketsQueryOptions = (courseId: number) =>
  queryOptions({
    queryKey: ['course-tickets', courseId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/panel/webinar/{course_id}/tickets', {
        params: { path: { course_id: courseId } },
      })
      if (error) throw new Error('Не удалось загрузить тарифы')
      return data
    },
    enabled: courseId > 0,
  })

export async function addTicket(courseId: number, body: TicketInput) {
  const { data, error } = await api.POST('/api/v1/panel/webinar/{course_id}/tickets', {
    params: { path: { course_id: courseId } },
    body,
  })
  if (error) throw new Error('Не удалось создать тариф')
  return data
}

export async function deleteTicket(ticketId: number) {
  const { error } = await api.DELETE('/api/v1/panel/tickets/{ticket_id}', {
    params: { path: { ticket_id: ticketId } },
  })
  if (error) throw new Error('Не удалось удалить тариф')
}
