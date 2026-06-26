import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { RewardsPage } from '#/pages/rewards'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/rewards')({
  beforeLoad: () => requireAuth(),
  component: withPanel(RewardsPage),
})
