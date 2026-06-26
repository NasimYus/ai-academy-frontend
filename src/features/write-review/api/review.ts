import { api } from '#/shared/api'

const REVIEW_MESSAGE: Record<string, string> = {
  not_bought: 'Отзыв можно оставить только после покупки курса',
  duplicate_review: 'Вы уже оставили отзыв на этот курс',
}

export interface ReviewInput {
  content_quality: number
  instructor_skills: number
  purchase_worth: number
  support_quality: number
  description?: string
}

export async function submitReview(courseId: number, input: ReviewInput) {
  const { data, error } = await api.POST('/api/v1/courses/{course_id}/reviews', {
    params: { path: { course_id: courseId } },
    body: { ...input, description: input.description ?? null },
  })
  if (error) {
    const detail = error.detail
    throw new Error(
      (typeof detail === 'string' && REVIEW_MESSAGE[detail]) || 'Не удалось отправить отзыв',
    )
  }
  return data
}
