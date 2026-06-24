import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { NotificationsPage } from '#/pages/notifications'

export const Route = createFileRoute('/notifications')({
  beforeLoad: () => requireAuth(),
  component: NotificationsPage,
})
