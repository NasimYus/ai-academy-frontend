import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// Points overview: balance + history + leaderboard (legacy index; 404 when the
// rewards programme is disabled).
export const rewardsOverviewQueryOptions = queryOptions({
  queryKey: ['rewards-overview'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/rewards', {})
    if (error) throw new Error('Программа баллов недоступна')
    return data
  },
  retry: false,
})

// Courses buyable with points (ungated).
export const rewardCoursesQueryOptions = queryOptions({
  queryKey: ['reward-courses'],
  queryFn: async () => {
    const { data } = await api.GET('/api/v1/rewards/reward-courses', {})
    return data ?? []
  },
})
