import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// Course announcements (legacy CourseNoticeboardController@index).
export const courseNoticeboardsQueryOptions = (courseId: number) =>
  queryOptions({
    queryKey: ['course-noticeboards', courseId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/courses/{course_id}/noticeboards', {
        params: { path: { course_id: courseId } },
      })
      if (error) throw new Error('Не удалось загрузить объявления')
      return data
    },
    enabled: courseId > 0,
  })
