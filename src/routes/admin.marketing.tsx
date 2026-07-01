import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminMarketingPage } from '#/pages/admin-marketing'

export const Route = createFileRoute('/admin/marketing')({
  beforeLoad: () => requireRole('admin'),
  component: AdminMarketingPage,
})
