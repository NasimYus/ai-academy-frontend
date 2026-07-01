import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// Instructor quiz overview (reused here to list a course's quizzes on step 7).
// Kept local to avoid a forbidden cross-slice import from `manage-quiz`.
export const manageQuizzesQueryOptions = queryOptions({
  queryKey: ['manage-quizzes-overview'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/quizzes/list', {})
    if (error) throw new Error('Не удалось загрузить тесты')
    return data
  },
})
