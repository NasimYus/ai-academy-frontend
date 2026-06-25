import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type AssignmentDashboard = components['schemas']['AssignmentDashboard']
export type SubmissionView = components['schemas']['SubmissionView']

// Instructor assignment dashboard: own assignments + review counts.
export const assignmentDashboardQueryOptions = queryOptions({
  queryKey: ['instructor-assignments'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/assignments', {})
    if (error) throw new Error('Не удалось загрузить задания')
    return data
  },
})

// Student submission threads for one assignment.
export const submissionsQueryOptions = (assignmentId: number) =>
  queryOptions({
    queryKey: ['instructor-assignment-submissions', assignmentId],
    queryFn: async () => {
      const { data, error } = await api.GET(
        '/api/v1/panel/assignments/{assignment_id}/submissions',
        { params: { path: { assignment_id: assignmentId } } },
      )
      if (error) throw new Error('Не удалось загрузить работы')
      return data
    },
    enabled: assignmentId > 0,
  })

export async function gradeSubmission(historyId: number, grade: number) {
  const { data, error } = await api.POST('/api/v1/panel/assignments/histories/{history_id}/rate', {
    params: { path: { history_id: historyId } },
    body: { grade },
  })
  if (error) throw new Error('Не удалось выставить оценку')
  return data
}
