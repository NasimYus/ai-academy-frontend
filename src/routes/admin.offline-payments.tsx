import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminOfflinePaymentsPage } from '#/pages/admin-offline-payments'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/admin/offline-payments')({
  beforeLoad: () => requireRole('admin'),
  component: withPanel(AdminOfflinePaymentsPage),
})
