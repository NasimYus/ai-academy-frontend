import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { MyMeetingsPage } from '#/pages/my-meetings'

export const Route = createFileRoute('/meetings')({
  beforeLoad: () => requireAuth(),
  component: MyMeetingsPage,
})
