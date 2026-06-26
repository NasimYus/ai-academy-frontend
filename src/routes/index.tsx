import { createFileRoute, redirect } from '@tanstack/react-router'

import { useSessionStore } from '#/entities/session'
import { LandingPage } from '#/pages/landing'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Authenticated users go straight to their cabinet; guests see the landing.
    if (useSessionStore.getState().token) {
      throw redirect({ to: '/panel' })
    }
  },
  component: LandingPage,
})
