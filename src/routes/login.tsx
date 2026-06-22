import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

import { api } from '#/lib/api'
import { loginSchema } from '#/lib/schemas'
import { useAuthStore } from '#/stores/auth'

export const Route = createFileRoute('/login')({ component: LoginPage })

function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [email, setEmail] = useState('admin@aiacademy.tj')
  const [password, setPassword] = useState('admin12345')
  const [fieldError, setFieldError] = useState<string | null>(null)

  const login = useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const { data, error } = await api.POST('/api/v1/auth/login', { body: input })
      if (error || !data) throw new Error('Неверный e-mail или пароль')

      const me = await api.GET('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${data.access_token}` },
      })
      if (me.error || !me.data) throw new Error('Не удалось загрузить профиль')

      return { token: data.access_token, user: me.data }
    },
    onSuccess: ({ token, user }) => {
      setAuth(token, user)
      navigate({ to: '/courses' })
    },
  })

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFieldError(null)
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? 'Проверьте поля')
      return
    }
    login.mutate(parsed.data)
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-gradient-to-b from-brand-50 to-white px-6 py-12">
      <div className="w-full max-w-sm rounded-card border border-brand-100 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-ink">С возвращением</h1>
        <p className="mb-6 text-sm text-ink/60">Войдите в свой аккаунт AI Academy</p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-brand-200 px-3 py-2 font-normal outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-brand-200 px-3 py-2 font-normal outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </label>

          {(fieldError || login.isError) && (
            <p className="text-sm text-red-600">
              {fieldError ?? (login.error as Error)?.message}
            </p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="mt-2 rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {login.isPending ? 'Входим…' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
