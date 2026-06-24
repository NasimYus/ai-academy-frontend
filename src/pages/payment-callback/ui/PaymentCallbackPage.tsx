import { Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { useVerifyPayment } from '#/features/pay-order'

// Gateway return URL. For the Sandbox driver we immediately confirm success;
// a real gateway would pass a signed token we'd forward to /payments/verify.
export function PaymentCallbackPage({ orderId, gateway }: { orderId: number; gateway: string }) {
  const verify = useVerifyPayment()
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    verify.mutate({ gateway, orderId, status: 'success' })
  }, [gateway, orderId, verify])

  const paid = verify.data?.status === 'paid'

  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      {verify.isPending && <p className="text-ink/60">Подтверждаем оплату…</p>}
      {verify.isError && (
        <p className="text-red-600">{verify.error.message}</p>
      )}
      {verify.isSuccess && (
        <>
          <div className="mb-3 text-4xl">{paid ? '✅' : '⚠️'}</div>
          <h1 className="text-xl font-bold text-ink">
            {paid ? 'Оплата прошла' : 'Оплата не завершена'}
          </h1>
          <p className="mt-1 text-ink/60">Заказ #{orderId}</p>
          <div className="mt-6 flex justify-center gap-3">
            {paid && (
              <Link
                to="/my-courses"
                className="rounded-full bg-brand-500 px-5 py-2 font-semibold text-white hover:bg-brand-600"
              >
                Мои курсы
              </Link>
            )}
            <Link
              to="/orders"
              className="rounded-full border border-brand-200 px-5 py-2 font-semibold text-brand-700 hover:bg-brand-50"
            >
              К заказам
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
