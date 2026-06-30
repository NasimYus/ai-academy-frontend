import { api } from '#/shared/api'
import type { User } from '#/entities/session'

export interface Step1Result {
  status: string // "stored" | "go_step_2" | "go_step_3"
  user_id: number
  code?: string | null // surfaced only in backend debug, for testing without a mailbox
}

export async function registerStep1(input: {
  email: string
  password: string
  password_confirmation: string
  account_type?: string // "user" (student) | "teacher" (instructor)
}): Promise<Step1Result> {
  const { data, error } = await api.POST('/api/v1/auth/register/step/1', { body: input })
  if (error) throw new Error('Не удалось зарегистрироваться. Возможно, e-mail уже занят')
  return data
}

export async function registerStep2(input: { user_id: number; code: string }): Promise<void> {
  const { error } = await api.POST('/api/v1/auth/register/step/2', { body: input })
  if (error) throw new Error('Неверный или просроченный код')
}

export interface Step3Result {
  token: string
  user: User
}

export async function registerStep3(input: {
  user_id: number
  full_name: string
}): Promise<Step3Result> {
  const { data, error } = await api.POST('/api/v1/auth/register/step/3', { body: input })
  if (error) throw new Error('Не удалось завершить регистрацию')

  const me = await api.GET('/api/v1/auth/me', {
    headers: { Authorization: `Bearer ${data.access_token}` },
  })
  if (me.error) throw new Error('Не удалось загрузить профиль')

  return { token: data.access_token, user: me.data }
}
