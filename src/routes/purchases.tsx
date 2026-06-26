import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { PurchasesPage } from '#/pages/purchases'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/purchases')({
  beforeLoad: () => requireAuth(),
  component: withPanel(PurchasesPage),
})
