import { api } from '#/shared/api'

export type LearningItemType = 'file' | 'text_lesson' | 'session'

// Toggle a content item's learned status (legacy WebinarController@learningStatus).
export async function toggleLearning(
  courseId: number,
  itemType: LearningItemType,
  itemId: number,
  learned: boolean,
): Promise<void> {
  const { error } = await api.POST('/api/v1/courses/{course_id}/learning', {
    params: { path: { course_id: courseId } },
    body: { item_type: itemType, item_id: itemId, learned },
  })
  if (error) throw new Error('Не удалось обновить прогресс')
}
