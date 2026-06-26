import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type AdminReview = components['schemas']['AdminReviewRead']

export const ADMIN_REVIEWS_KEY = ['admin', 'reviews'] as const

export const adminReviewsQueryOptions = queryOptions({
  queryKey: ADMIN_REVIEWS_KEY,
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/admin/reviews', {})
    if (error) throw new Error('Не удалось загрузить отзывы')
    return data
  },
})

export async function approveReview(reviewId: number) {
  const { data, error } = await api.POST('/api/v1/admin/reviews/{review_id}/approve', {
    params: { path: { review_id: reviewId } },
  })
  if (error) throw new Error('Не удалось одобрить отзыв')
  return data
}

export async function rejectReview(reviewId: number) {
  const { error } = await api.DELETE('/api/v1/admin/reviews/{review_id}', {
    params: { path: { review_id: reviewId } },
  })
  if (error) throw new Error('Не удалось отклонить отзыв')
}
