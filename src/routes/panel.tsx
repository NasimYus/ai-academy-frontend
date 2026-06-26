import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { DashboardPage } from '#/pages/dashboard'

export const Route = createFileRoute('/panel')({
  beforeLoad: () => requireAuth(),
  component: DashboardPage,
})
