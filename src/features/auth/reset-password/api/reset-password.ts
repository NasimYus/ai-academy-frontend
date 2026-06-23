import { api } from '#/shared/api'

export interface ForgotResult {
  status: string
  token?: string | null // surfaced only in backend debug, for testing without a mailbox
}

export async function forgotPassword(email: string): Promise<ForgotResult> {
  const { data, error } = await api.POST('/api/v1/auth/forget-password', { body: { email } })
  if (error) throw new Error('Не удалось отправить письмо. Проверьте e-mail')
  return data
}

export async function resetPassword(input: {
  token: string
  email: string
  password: string
  password_confirmation: string
}): Promise<string> {
  const { token, ...body } = input
  const { data, error } = await api.POST('/api/v1/auth/reset-password/{token}', {
    params: { path: { token } },
    body,
  })
  if (error) throw new Error('Не удалось сбросить пароль')
  return data.status // "reset" | "no_request"
}
