import { api } from '#/shared/api'

export async function toggleFavorite(courseId: number): Promise<'favored' | 'unfavored'> {
  const { data, error } = await api.POST('/api/v1/favorites/toggle/{course_id}', {
    params: { path: { course_id: courseId } },
  })
  if (error) throw new Error('Не удалось обновить избранное')
  return data.status === 'favored' ? 'favored' : 'unfavored'
}
