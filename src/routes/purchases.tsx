import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { PurchasesPage } from '#/pages/purchases'

export const Route = createFileRoute('/purchases')({
  beforeLoad: () => requireAuth(),
  component: PurchasesPage,
})
