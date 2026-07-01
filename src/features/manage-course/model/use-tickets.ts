import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TicketInput } from '#/features/manage-course/api/tickets'
import { addTicket, deleteTicket } from '#/features/manage-course/api/tickets'

export function useTicketMutations(courseId: number) {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['course-tickets', courseId] })

  const add = useMutation({
    mutationFn: (body: TicketInput) => addTicket(courseId, body),
    onSuccess: invalidate,
  })
  const remove = useMutation({
    mutationFn: (id: number) => deleteTicket(id),
    onSuccess: invalidate,
  })

  return { add, remove }
}
