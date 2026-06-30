import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  moderateBecomeInstructor,
  submitBecomeInstructor,
} from '#/features/become-instructor/api/become-instructor'
import type { BecomeInstructorInput } from '#/features/become-instructor/api/become-instructor'

export function useSubmitBecomeInstructor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: BecomeInstructorInput) => submitBecomeInstructor(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['become-instructor'] })
    },
  })
}

export function useModerateBecomeInstructor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action }: { id: number; action: 'accept' | 'reject' }) =>
      moderateBecomeInstructor(id, action),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin-become-instructors'] })
    },
  })
}
