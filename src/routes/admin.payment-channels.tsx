import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminPaymentsPage } from '#/pages/admin-payments'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/admin/payment-channels')({
  beforeLoad: () => requireRole('admin'),
  component: withPanel(AdminPaymentsPage),
})
