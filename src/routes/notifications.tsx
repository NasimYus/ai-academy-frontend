import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { NotificationsPage } from '#/pages/notifications'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/notifications')({
  beforeLoad: () => requireAuth(),
  component: withPanel(NotificationsPage),
})
