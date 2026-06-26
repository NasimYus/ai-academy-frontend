import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { MyMeetingsPage } from '#/pages/my-meetings'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/meetings')({
  beforeLoad: () => requireAuth(),
  component: withPanel(MyMeetingsPage),
})
