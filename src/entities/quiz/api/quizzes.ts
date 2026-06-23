import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// Active quizzes of a course (legacy WebinarContentController@quizzes).
export const courseQuizzesQueryOptions = (courseId: number) =>
  queryOptions({
    queryKey: ['course-quizzes', courseId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/courses/{course_id}/quizzes', {
        params: { path: { course_id: courseId } },
      })
      if (error) throw new Error('Не удалось загрузить тесты')
      return data
    },
    enabled: courseId > 0,
  })

// A single active quiz with its questions (legacy QuizzesController@show).
export const quizQueryOptions = (quizId: number) =>
  queryOptions({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/quizzes/{quiz_id}', {
        params: { path: { quiz_id: quizId } },
      })
      if (error) throw new Error('Не удалось загрузить тест')
      return data
    },
    enabled: quizId > 0,
  })
