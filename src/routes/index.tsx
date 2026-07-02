import { createFileRoute } from '@tanstack/react-router'

import { LandingPage } from '#/pages/landing'

// The landing is the main screen for everyone — the header logo links here.
// Signed-in users still land in /panel after login (LoginForm navigates there
// explicitly); visiting "/" shows the public landing instead of redirecting.
export const Route = createFileRoute('/')({
  component: LandingPage,
})
