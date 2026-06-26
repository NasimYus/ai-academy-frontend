import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { SupportPage } from '#/pages/support'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/support/')({
  beforeLoad: () => requireAuth(),
  component: withPanel(SupportPage),
})
