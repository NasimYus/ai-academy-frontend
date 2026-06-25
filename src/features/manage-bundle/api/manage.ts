import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type BundleDashboard = components['schemas']['BundleDashboard']

export const bundlesQueryOptions = queryOptions({
  queryKey: ['instructor-bundles'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/bundles', {})
    if (error) throw new Error('Не удалось загрузить наборы')
    return data
  },
})

export async function deleteBundle(bundleId: number) {
  const { error } = await api.DELETE('/api/v1/panel/bundles/{bundle_id}', {
    params: { path: { bundle_id: bundleId } },
  })
  if (error) throw new Error('Не удалось удалить набор')
}
