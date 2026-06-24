import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { CartPage } from '#/pages/cart'

export const Route = createFileRoute('/cart')({
  beforeLoad: () => requireAuth(),
  component: CartPage,
})
