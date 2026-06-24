import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { FavoritesPage } from '#/pages/favorites'

export const Route = createFileRoute('/favorites')({
  beforeLoad: () => requireAuth(),
  component: FavoritesPage,
})
