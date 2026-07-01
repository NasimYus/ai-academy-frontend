import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminLiveSessionsPage } from '#/pages/admin-live-sessions'

export const Route = createFileRoute('/admin/live-sessions')({
  beforeLoad: () => requireRole('admin'),
  component: AdminLiveSessionsPage,
})
