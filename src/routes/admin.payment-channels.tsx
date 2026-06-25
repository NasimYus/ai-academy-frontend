import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminPaymentsPage } from '#/pages/admin-payments'

export const Route = createFileRoute('/admin/payment-channels')({
  beforeLoad: () => requireRole('admin'),
  component: AdminPaymentsPage,
})
