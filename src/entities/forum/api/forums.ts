import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// Course Q&A threads + aggregate counts (legacy CourseForumController@index).
export const courseForumsQueryOptions = (courseId: number) =>
  queryOptions({
    queryKey: ['course-forums', courseId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/courses/{course_id}/forums', {
        params: { path: { course_id: courseId } },
      })
      if (error) throw new Error('Не удалось загрузить форум')
      return data
    },
    enabled: courseId > 0,
  })

// Answers on a thread (legacy CourseForumAnswerController@index).
export const forumAnswersQueryOptions = (forumId: number) =>
  queryOptions({
    queryKey: ['forum-answers', forumId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/forums/{forum_id}/answers', {
        params: { path: { forum_id: forumId } },
      })
      if (error) throw new Error('Не удалось загрузить ответы')
      return data
    },
  })
