import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { RegistrationPackagesPage } from '#/pages/registration-packages'

export const Route = createFileRoute('/instructor/packages')({
  beforeLoad: () => requireAuth(),
  component: RegistrationPackagesPage,
})
