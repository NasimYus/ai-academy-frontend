import { api } from '#/shared/api'
import type { User } from '#/entities/session'
import type { LoginInput } from '#/features/auth/login/model/schema'

export interface LoginResult {
  token: string
  user: User
}

// Exchanges credentials for a JWT, then loads the profile in one flow.
export async function login(input: LoginInput): Promise<LoginResult> {
  // The login identifier is `username` (e-mail or mobile) in the API.
  const { data, error } = await api.POST('/api/v1/auth/login', {
    body: { username: input.email, password: input.password },
  })
  if (error) throw new Error('Неверный e-mail или пароль')

  const me = await api.GET('/api/v1/auth/me', {
    headers: { Authorization: `Bearer ${data.access_token}` },
  })
  if (me.error) throw new Error('Не удалось загрузить профиль')

  return { token: data.access_token, user: me.data }
}
