import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { SupportPage } from '#/pages/support'

export const Route = createFileRoute('/support/')({
  beforeLoad: () => requireAuth(),
  component: SupportPage,
})
