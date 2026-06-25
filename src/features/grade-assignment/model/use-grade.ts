import { useMutation, useQueryClient } from '@tanstack/react-query'

import { gradeSubmission } from '#/features/grade-assignment/api/grade'

export function useGradeSubmission(assignmentId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { historyId: number; grade: number }) =>
      gradeSubmission(vars.historyId, vars.grade),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['instructor-assignments'] })
      void qc.invalidateQueries({
        queryKey: ['instructor-assignment-submissions', assignmentId],
      })
    },
  })
}
