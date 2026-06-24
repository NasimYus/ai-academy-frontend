import { useMutation, useQueryClient } from '@tanstack/react-query'

import { setFollow } from '#/features/follow-user/api/follow'

export function useFollow(userId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (follow: boolean) => setFollow(userId, follow),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['public-profile', userId] }),
  })
}
