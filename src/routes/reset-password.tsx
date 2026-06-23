import { createFileRoute } from '@tanstack/react-router'

import { ResetPasswordPage } from '#/pages/reset-password'

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>): { token: string; email: string } => ({
    token: typeof search.token === 'string' ? search.token : '',
    email: typeof search.email === 'string' ? search.email : '',
  }),
  component: ResetPasswordRoute,
})

function ResetPasswordRoute() {
  const { token, email } = Route.useSearch()
  return <ResetPasswordPage token={token} email={email} />
}
