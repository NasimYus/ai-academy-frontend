import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { CertificatesListPage } from '#/pages/instructor-certificates'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/certificates/list')({
  beforeLoad: () => requireAuth(),
  component: withPanel(CertificatesListPage),
})
