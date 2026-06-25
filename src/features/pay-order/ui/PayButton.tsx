import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { paymentChannelsQueryOptions } from '#/entities/payment'
import { useRequestPayment } from '#/features/pay-order/model/use-pay'

export function PayButton({ orderId }: { orderId: number }) {
  const navigate = useNavigate()
  const channels = useQuery(paymentChannelsQueryOptions)
  const request = useRequestPayment()
  const [selected, setSelected] = useState<number | null>(null)

  if (!channels.data) return null
  const list = channels.data
  if (list.length === 0) {
    return <p className="text-xs text-ink/40">Способы оплаты не настроены</p>
  }

  // Default to the first gateway that has a working driver.
  const channel = list.find((c) => c.id === selected) ?? list.find((c) => c.supported) ?? list[0]

  const pay = () => {
    request.mutate(
      { orderId, gatewayId: channel.id },
      {
        onSuccess: (res) => {
          if (res.redirect_url.startsWith('http')) {
            window.location.assign(res.redirect_url) // real gateway
          } else {
            void navigate({
              to: '/payment/callback',
              search: { order_id: orderId, gateway: res.gateway },
            })
          }
        },
      },
    )
  }

  return (
    <div className="space-y-2">
      {list.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {list.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c.id)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                channel.id === c.id
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-brand-200 text-ink/60 hover:bg-brand-50'
              }`}
            >
              {c.image && <img src={c.image} alt="" className="h-4 w-4 object-contain" />}
              {c.title}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={pay}
        disabled={request.isPending}
        className="rounded-full bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
      >
        {request.isPending ? 'Переход к оплате…' : 'Оплатить'}
      </button>
      {request.isError && <p className="mt-1 text-sm text-red-600">{request.error.message}</p>}
    </div>
  )
}
