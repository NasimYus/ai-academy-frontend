import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { CertificatesPage } from '#/pages/certificates'

export const Route = createFileRoute('/certificates')({
  beforeLoad: () => requireAuth(),
  component: CertificatesPage,
})
