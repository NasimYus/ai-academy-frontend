import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { FavoritesPage } from '#/pages/favorites'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/favorites')({
  beforeLoad: () => requireAuth(),
  component: withPanel(FavoritesPage),
})
