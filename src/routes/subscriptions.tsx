import { createFileRoute } from '@tanstack/react-router'

import { SubscriptionsPage } from '#/pages/subscriptions'

export const Route = createFileRoute('/subscriptions')({
  component: SubscriptionsPage,
})
