import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { OrdersPage } from '#/pages/orders'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/orders')({
  beforeLoad: () => requireAuth(),
  component: withPanel(OrdersPage),
})
