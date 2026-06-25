import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  ADMIN_CHANNELS_KEY,
  createChannel,
  toggleChannel,
  updateChannel,
} from '#/features/manage-payment-channels/api/admin-channels'
import type {
  ChannelCreate,
  ChannelUpdate,
} from '#/features/manage-payment-channels/api/admin-channels'

function useInvalidate() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: ADMIN_CHANNELS_KEY })
}

export function useCreateChannel() {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: (body: ChannelCreate) => createChannel(body), onSuccess: invalidate })
}

export function useUpdateChannel() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (vars: { id: number; body: ChannelUpdate }) => updateChannel(vars.id, vars.body),
    onSuccess: invalidate,
  })
}

export function useToggleChannel() {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: (id: number) => toggleChannel(id), onSuccess: invalidate })
}
