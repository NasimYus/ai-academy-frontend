import { useNavigate } from '@tanstack/react-router'

import { useSessionStore } from '#/entities/session'
import { authenticateWithProvider } from '#/features/auth/oauth/api/oauth'
import type { OAuthProfile, OAuthProvider } from '#/features/auth/oauth/api/oauth'

// Completes an OAuth sign-in once the provider profile has been obtained
// client-side, then stores the session and redirects.
export function useOAuthLogin() {
  const navigate = useNavigate()
  const setAuth = useSessionStore((s) => s.setAuth)

  return async (provider: OAuthProvider, profile: OAuthProfile) => {
    const { token, user } = await authenticateWithProvider(provider, profile)
    setAuth(token, user)
    navigate({ to: '/panel' })
  }
}
