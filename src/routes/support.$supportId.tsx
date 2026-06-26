import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { SupportTicketPage } from '#/pages/support-ticket'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/support/$supportId')({
  beforeLoad: () => requireAuth(),
  component: withPanel(SupportTicketRoute),
})

function SupportTicketRoute() {
  const { supportId } = Route.useParams()
  return <SupportTicketPage supportId={Number(supportId)} />
}
