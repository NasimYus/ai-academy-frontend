import { useMutation, useQueryClient } from '@tanstack/react-query'

import { chargeAccount } from '#/features/charge-account/api/charge-account'
import type { ChargeInput } from '#/features/charge-account/api/charge-account'

export function useChargeAccount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: ChargeInput) => chargeAccount(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['offline-payments'] })
    },
  })
}
