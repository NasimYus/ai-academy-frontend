import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { FAVORITES_QUERY_KEY, favoritesQueryOptions } from '#/entities/favorite'
import { useSessionStore } from '#/entities/session'
import { toggleFavorite } from '#/features/favorite-toggle/api/toggle'

/** Whether a course is in the signed-in user's favorites (false when anonymous). */
export function useIsFavorite(courseId: number): boolean {
  const token = useSessionStore((s) => s.token)
  const favorites = useQuery({ ...favoritesQueryOptions, enabled: !!token })
  return (favorites.data ?? []).some((f) => f.course.id === courseId)
}

export function useToggleFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId: number) => toggleFavorite(courseId),
    onSuccess: () => qc.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY }),
  })
}
