import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { CertificatesPage } from '#/pages/certificates'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/certificates')({
  beforeLoad: () => requireAuth(),
  component: withPanel(CertificatesPage),
})
