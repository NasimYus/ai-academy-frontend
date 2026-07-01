import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  approveOfflinePayment,
  rejectOfflinePayment,
} from '#/features/manage-offline-payments/api/offline-payments'

export function useOfflinePaymentActions() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-offline-payments'] })

  const approve = useMutation({
    mutationFn: (id: number) => approveOfflinePayment(id),
    onSuccess: invalidate,
  })
  const reject = useMutation({
    mutationFn: (id: number) => rejectOfflinePayment(id),
    onSuccess: invalidate,
  })

  return { approve, reject }
}
