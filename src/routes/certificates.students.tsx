import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { CertificateStudentsPage } from '#/pages/instructor-certificates'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/certificates/students')({
  beforeLoad: () => requireAuth(),
  component: withPanel(CertificateStudentsPage),
})
