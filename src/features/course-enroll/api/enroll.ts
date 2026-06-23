import { api } from '#/shared/api'

// Free enrollment (legacy WebinarsController@free). Paid checkout arrives in Phase 4.
export async function enrollFree(courseId: number): Promise<void> {
  const { error } = await api.POST('/api/v1/panel/courses/{course_id}/free', {
    params: { path: { course_id: courseId } },
  })
  if (error) throw new Error('Не удалось записаться на курс')
}
