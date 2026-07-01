import { useMutation, useQueryClient } from '@tanstack/react-query'

import type {
  CourseCreateBody,
  CourseMediaKind,
  CourseUpdateBody,
} from '#/features/manage-course/api/manage'
import {
  createCourse,
  deleteCourse,
  submitCourse,
  updateCourse,
  uploadCourseMedia,
} from '#/features/manage-course/api/manage'

export function useCreateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CourseCreateBody) => createCourse(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructor-classes'] }),
  })
}

export function useUpdateCourse(courseId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CourseUpdateBody) => updateCourse(courseId, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['instructor-classes'] })
      void qc.invalidateQueries({ queryKey: ['instructor-course', courseId] })
    },
  })
}

export function useDeleteCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId: number) => deleteCourse(courseId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructor-classes'] }),
  })
}

export function useSubmitCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, message, rules }: { courseId: number; message: string | null; rules: boolean }) =>
      submitCourse(courseId, message, rules),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructor-classes'] }),
  })
}

export function useUploadCourseMedia() {
  return useMutation({
    mutationFn: ({ file, kind }: { file: File; kind: CourseMediaKind }) =>
      uploadCourseMedia(file, kind),
  })
}
