import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type BundleDashboard = components['schemas']['BundleDashboard']
export type BundleCreateBody = components['schemas']['BundleCreate']
export type BundleManageList = components['schemas']['BundleManageList']

export const bundlesQueryOptions = queryOptions({
  queryKey: ['instructor-bundles'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/bundles', {})
    if (error) throw new Error('Не удалось загрузить наборы')
    return data
  },
})

// All bundles for the admin list (Пакеты курсов → Список).
export const adminBundlesQueryOptions = queryOptions({
  queryKey: ['admin-bundles'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/admin/bundles', {})
    if (error) throw new Error('Не удалось загрузить пакеты курсов')
    return data
  },
})

export async function createBundle(body: BundleCreateBody) {
  const { data, error } = await api.POST('/api/v1/panel/bundles', { body })
  if (error) throw new Error('Не удалось сохранить пакет курсов')
  return data
}

export async function deleteBundle(bundleId: number) {
  const { error } = await api.DELETE('/api/v1/panel/bundles/{bundle_id}', {
    params: { path: { bundle_id: bundleId } },
  })
  if (error) throw new Error('Не удалось удалить набор')
}
