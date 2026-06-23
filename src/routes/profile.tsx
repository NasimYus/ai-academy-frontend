import { createFileRoute, redirect } from '@tanstack/react-router'

import { useSessionStore } from '#/entities/session'
import { ProfilePage } from '#/pages/profile'

export const Route = createFileRoute('/profile')({
  beforeLoad: () => {
    if (!useSessionStore.getState().token) {
      throw redirect({ to: '/login' })
    }
  },
  component: ProfilePage,
})
