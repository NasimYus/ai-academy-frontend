import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { ProfilePage } from '#/pages/profile'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/profile')({
  beforeLoad: () => requireAuth(),
  component: withPanel(ProfilePage),
})
