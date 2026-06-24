import { useMutation, useQueryClient } from '@tanstack/react-query'

import { SUPPORT_QUERY_KEY } from '#/entities/support'

import {
  closeTicket,
  createTicket,
  replyToTicket,
} from '#/features/support/api/support'
import type { CreateTicketInput } from '#/features/support/api/support'

export function useCreateTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTicketInput) => createTicket(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUPPORT_QUERY_KEY }),
  })
}

export function useReplyTicket(supportId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { message: string; attachment?: File | null }) =>
      replyToTicket(supportId, vars.message, vars.attachment),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUPPORT_QUERY_KEY }),
  })
}

export function useCloseTicket(supportId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => closeTicket(supportId),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUPPORT_QUERY_KEY }),
  })
}
