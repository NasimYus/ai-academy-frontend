import { api } from '#/shared/api'

// Best-effort server-side logout (decrements device count; JWT denylist is
// deferred). Errors are ignored — the client session is cleared regardless.
export async function logout(): Promise<void> {
  await api.POST('/api/v1/auth/logout', {})
}
