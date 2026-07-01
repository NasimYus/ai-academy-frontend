import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminBundleFormPage } from '#/pages/admin-bundle-form'

export const Route = createFileRoute('/admin/bundle/new')({
  beforeLoad: () => requireRole('admin'),
  component: AdminBundleFormPage,
})
