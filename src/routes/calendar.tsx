import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { EventsCalendarPage } from '#/pages/events-calendar'

export const Route = createFileRoute('/calendar')({
  beforeLoad: () => requireAuth(),
  component: EventsCalendarPage,
})
