import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  ADMIN_COURSES_KEY,
  approveCourse,
  rejectCourse,
  unpublishCourse,
} from '#/features/moderate-courses/api/courses'

function useModerateMutation(fn: (id: number) => Promise<unknown>) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId: number) => fn(courseId),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ADMIN_COURSES_KEY }),
  })
}

export const useApproveCourse = () => useModerateMutation(approveCourse)
export const useRejectCourse = () => useModerateMutation(rejectCourse)
export const useUnpublishCourse = () => useModerateMutation(unpublishCourse)
