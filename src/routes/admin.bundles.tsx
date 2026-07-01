import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminBundlesPage } from '#/pages/admin-bundles'

export const Route = createFileRoute('/admin/bundles')({
  beforeLoad: () => requireRole('admin'),
  component: AdminBundlesPage,
})
