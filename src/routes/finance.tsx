import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { FinancialReportPage } from '#/pages/financial-report'

export const Route = createFileRoute('/finance')({
  beforeLoad: () => requireAuth(),
  component: FinancialReportPage,
})
