import { useState } from 'react'

import { couponMessage } from '#/features/cart/api/coupon'
import type { CouponValidation } from '#/features/cart/api/coupon'
import { useValidateCoupon } from '#/features/cart/model/use-coupon'

export function CouponForm({ onApplied }: { onApplied: (v: CouponValidation) => void }) {
  const [code, setCode] = useState('')
  const validate = useValidateCoupon()

  const apply = () =>
    validate.mutate(code.trim(), {
      onSuccess: (v) => {
        if (v.valid) onApplied(v)
      },
    })

  const invalid = validate.data && !validate.data.valid

  return (
    <div className="mt-3">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border border-brand-200 p-2 text-sm uppercase"
          placeholder="Промокод"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          type="button"
          onClick={apply}
          disabled={validate.isPending || code.trim() === ''}
          className="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {validate.isPending ? 'Проверка…' : 'Применить'}
        </button>
      </div>
      {validate.data?.valid && (
        <p className="mt-1 text-sm text-emerald-600">Промокод применён</p>
      )}
      {invalid && (
        <p className="mt-1 text-sm text-red-600">{couponMessage(validate.data.message)}</p>
      )}
      {validate.isError && <p className="mt-1 text-sm text-red-600">{validate.error.message}</p>}
    </div>
  )
}
