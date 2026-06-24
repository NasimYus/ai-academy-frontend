import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { OrdersPage } from '#/pages/orders'

export const Route = createFileRoute('/orders')({
  beforeLoad: () => requireAuth(),
  component: OrdersPage,
})
