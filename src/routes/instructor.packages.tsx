import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { RegistrationPackagesPage } from '#/pages/registration-packages'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/instructor/packages')({
  beforeLoad: () => requireAuth(),
  component: withPanel(RegistrationPackagesPage),
})
