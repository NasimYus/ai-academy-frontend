import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type AdminPaymentChannel = components['schemas']['AdminPaymentChannelRead']
export type ChannelCreate = components['schemas']['AdminPaymentChannelCreate']
export type ChannelUpdate = components['schemas']['AdminPaymentChannelUpdate']

export const ADMIN_CHANNELS_KEY = ['admin', 'payment-channels'] as const

export const adminChannelsQueryOptions = queryOptions({
  queryKey: ADMIN_CHANNELS_KEY,
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/admin/payment-channels', {})
    if (error) throw new Error('Не удалось загрузить платёжные шлюзы')
    return data
  },
})

export async function createChannel(body: ChannelCreate) {
  const { data, error } = await api.POST('/api/v1/admin/payment-channels', { body })
  if (error) throw new Error('Не удалось создать шлюз')
  return data
}

export async function updateChannel(id: number, body: ChannelUpdate) {
  const { data, error } = await api.PUT('/api/v1/admin/payment-channels/{channel_id}', {
    params: { path: { channel_id: id } },
    body,
  })
  if (error) throw new Error('Не удалось сохранить шлюз')
  return data
}

export async function toggleChannel(id: number) {
  const { data, error } = await api.POST(
    '/api/v1/admin/payment-channels/{channel_id}/toggle-status',
    { params: { path: { channel_id: id } } },
  )
  if (error) throw new Error('Не удалось переключить статус')
  return data
}
