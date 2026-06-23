import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { LearningItemType } from '#/features/lesson-progress/api/learning'
import { toggleLearning } from '#/features/lesson-progress/api/learning'

interface ToggleArgs {
  itemType: LearningItemType
  itemId: number
  learned: boolean
}

// Marks/unmarks a content item learned, then refreshes the course content
// (so the `completed` flags re-render). Keyed by course id + slug.
export function useToggleLearning(courseId: number, slug: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemType, itemId, learned }: ToggleArgs) =>
      toggleLearning(courseId, itemType, itemId, learned),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['course-content', slug] }),
  })
}
