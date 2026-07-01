import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type AdminOfflinePayment = components['schemas']['AdminOfflinePaymentRead']
export type OfflinePaymentStatus = 'waiting' | 'approved' | 'reject'

export const adminOfflinePaymentsQueryOptions = (status?: OfflinePaymentStatus) =>
  queryOptions({
    queryKey: ['admin-offline-payments', status ?? 'all'],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/admin/offline-payments', {
        params: { query: status ? { status } : {} },
      })
      if (error) throw new Error('Не удалось загрузить платежи')
      return data
    },
  })

export async function approveOfflinePayment(id: number) {
  const { error } = await api.POST('/api/v1/admin/offline-payments/{payment_id}/approve', {
    params: { path: { payment_id: id } },
  })
  if (error) throw new Error('Не удалось подтвердить платёж')
}

export async function rejectOfflinePayment(id: number) {
  const { error } = await api.POST('/api/v1/admin/offline-payments/{payment_id}/reject', {
    params: { path: { payment_id: id } },
  })
  if (error) throw new Error('Не удалось отклонить платёж')
}
