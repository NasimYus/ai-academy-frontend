import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { SubmitInput } from '#/features/submit-assignment/api/submit'
import { submitAssignmentMessage } from '#/features/submit-assignment/api/submit'

// Submit a message/work, then refresh the thread (legacy creates the history
// row on the first message, so the messages query re-fetches the new state).
export function useSubmitMessage(assignmentId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: SubmitInput) => submitAssignmentMessage(assignmentId, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['assignment-messages', assignmentId] })
      void qc.invalidateQueries({ queryKey: ['my-assignment', assignmentId] })
    },
  })
}
