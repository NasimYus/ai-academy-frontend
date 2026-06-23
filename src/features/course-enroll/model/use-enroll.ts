import { useMutation, useQueryClient } from '@tanstack/react-query'

import { enrollFree } from '#/features/course-enroll/api/enroll'

// Enrolls into a free course, then refreshes the course detail (access flags).
export function useEnrollFree(slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: enrollFree,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['course', slug] }),
  })
}
