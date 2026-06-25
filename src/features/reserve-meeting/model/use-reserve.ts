import { useMutation, useQueryClient } from '@tanstack/react-query'

import { MEETING_QUERY_KEY } from '#/entities/meeting'

import { reserveMeeting } from '#/features/reserve-meeting/api/reserve'

export function useReserveMeeting() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { meetingTimeId: number; description?: string }) =>
      reserveMeeting(vars.meetingTimeId, vars.description),
    onSuccess: () => qc.invalidateQueries({ queryKey: MEETING_QUERY_KEY }),
  })
}
