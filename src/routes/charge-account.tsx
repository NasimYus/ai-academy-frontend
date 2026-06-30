import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { ChargeAccountPage } from '#/pages/charge-account'

export const Route = createFileRoute('/charge-account')({
  beforeLoad: () => requireAuth(),
  component: ChargeAccountPage,
})
