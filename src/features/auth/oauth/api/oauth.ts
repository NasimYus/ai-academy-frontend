import { api } from '#/shared/api'
import type { User } from '#/entities/session'

export type OAuthProvider = 'google' | 'facebook'

// Profile obtained client-side from the provider SDK and trusted by the backend.
export interface OAuthProfile {
  email: string
  name: string
  id: string
}

function postCallback(provider: OAuthProvider, profile: OAuthProfile) {
  if (provider === 'google') {
    return api.POST('/api/v1/auth/google/callback', { body: profile })
  }
  return api.POST('/api/v1/auth/facebook/callback', { body: profile })
}

export async function authenticateWithProvider(
  provider: OAuthProvider,
  profile: OAuthProfile,
): Promise<{ token: string; user: User }> {
  let res = await postCallback(provider, profile)
  if (res.error) throw new Error('Ошибка входа через провайдера')

  // A brand-new account is created without a token (legacy behaviour); a second
  // call now finds the existing account and returns one.
  if (!res.data.token) {
    res = await postCallback(provider, profile)
    if (res.error) throw new Error('Ошибка входа через провайдера')
  }

  const token = res.data.token
  if (!token) throw new Error('Не удалось получить токен')

  const me = await api.GET('/api/v1/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (me.error) throw new Error('Не удалось загрузить профиль')

  return { token, user: me.data }
}
