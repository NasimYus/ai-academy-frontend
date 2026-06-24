import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { RewardsPage } from '#/pages/rewards'

export const Route = createFileRoute('/rewards')({
  beforeLoad: () => requireAuth(),
  component: RewardsPage,
})
