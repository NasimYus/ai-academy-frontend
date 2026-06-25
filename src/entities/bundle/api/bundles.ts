import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// Active bundles for the public catalogue.
export const bundlesQueryOptions = queryOptions({
  queryKey: ['bundles'],
  queryFn: async () => {
    const { data } = await api.GET('/api/v1/bundles', {})
    return data ?? []
  },
})

// A single bundle with its courses.
export const bundleQueryOptions = (bundleId: number) =>
  queryOptions({
    queryKey: ['bundle', bundleId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/bundles/{bundle_id}', {
        params: { path: { bundle_id: bundleId } },
      })
      if (error) throw new Error('Не удалось загрузить набор')
      return data
    },
    enabled: bundleId > 0,
  })
