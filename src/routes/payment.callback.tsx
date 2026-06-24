import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { PaymentCallbackPage } from '#/pages/payment-callback'

export const Route = createFileRoute('/payment/callback')({
  beforeLoad: () => requireAuth(),
  validateSearch: (search: Record<string, unknown>): { order_id: number; gateway: string } => ({
    order_id: Number(search.order_id) || 0,
    gateway: typeof search.gateway === 'string' ? search.gateway : '',
  }),
  component: PaymentCallbackRoute,
})

function PaymentCallbackRoute() {
  const { order_id, gateway } = Route.useSearch()
  return <PaymentCallbackPage orderId={order_id} gateway={gateway} />
}
