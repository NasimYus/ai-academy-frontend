import { createFileRoute, redirect } from '@tanstack/react-router'

import { useSessionStore } from '#/entities/session'
import { LandingPage } from '#/pages/landing'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Signed-in users land in their cabinet; guests see the public landing.
    if (useSessionStore.getState().token) {
      throw redirect({ to: '/panel' })
    }
  },
  component: LandingPage,
})
