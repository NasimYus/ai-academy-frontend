import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// Active assignments of a course (discovery on the learn page).
export const courseAssignmentsQueryOptions = (courseId: number) =>
  queryOptions({
    queryKey: ['course-assignments', courseId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/courses/{course_id}/assignments', {
        params: { path: { course_id: courseId } },
      })
      if (error) throw new Error('Не удалось загрузить задания')
      return data
    },
    enabled: courseId > 0,
  })

// A single assignment definition (legacy WebinarAssignmentController@show).
export const assignmentQueryOptions = (assignmentId: number) =>
  queryOptions({
    queryKey: ['assignment', assignmentId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/assignments/{assignment_id}', {
        params: { path: { assignment_id: assignmentId } },
      })
      if (error) throw new Error('Не удалось загрузить задание')
      return data
    },
    enabled: assignmentId > 0,
  })

// The auth user's submission thread for an assignment (get-or-create on the server).
export const assignmentMessagesQueryOptions = (assignmentId: number) =>
  queryOptions({
    queryKey: ['assignment-messages', assignmentId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/assignments/{assignment_id}/messages', {
        params: { path: { assignment_id: assignmentId } },
      })
      if (error) throw new Error('Не удалось загрузить сообщения')
      return data
    },
    enabled: assignmentId > 0,
  })
