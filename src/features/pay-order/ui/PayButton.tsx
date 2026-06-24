import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { paymentChannelsQueryOptions } from '#/entities/payment'
import { useRequestPayment } from '#/features/pay-order/model/use-pay'

export function PayButton({ orderId }: { orderId: number }) {
  const navigate = useNavigate()
  const channels = useQuery(paymentChannelsQueryOptions)
  const request = useRequestPayment()

  const channel = channels.data?.[0]

  const pay = () => {
    if (!channel) return
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

  if (channels.data && channels.data.length === 0) {
    return <p className="text-xs text-ink/40">Способы оплаты не настроены</p>
  }

  return (
    <>
      <button
        type="button"
        onClick={pay}
        disabled={request.isPending || !channel}
        className="rounded-full bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
      >
        {request.isPending ? 'Переход к оплате…' : 'Оплатить'}
      </button>
      {request.isError && <p className="mt-1 text-sm text-red-600">{request.error.message}</p>}
    </>
  )
}
