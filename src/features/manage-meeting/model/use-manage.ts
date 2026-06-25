import { useMutation, useQueryClient } from '@tanstack/react-query'

import { MEETING_QUERY_KEY } from '#/entities/meeting'

import {
  addSlot,
  deleteSlot,
  finishReservation,
  updateMeeting,
} from '#/features/manage-meeting/api/manage'
import type { DayLabel, MeetingConfigInput } from '#/features/manage-meeting/api/manage'

function useInvalidate() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: MEETING_QUERY_KEY })
}

export function useUpdateMeeting() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (body: MeetingConfigInput) => updateMeeting(body),
    onSuccess: invalidate,
  })
}

export function useAddSlot() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (vars: { dayLabel: DayLabel; time: string }) => addSlot(vars.dayLabel, vars.time),
    onSuccess: invalidate,
  })
}

export function useDeleteSlot() {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: (timeId: number) => deleteSlot(timeId), onSuccess: invalidate })
}

export function useFinishReservation() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (reserveId: number) => finishReservation(reserveId),
    onSuccess: invalidate,
  })
}
