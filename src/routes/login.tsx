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
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center p-6">
      <h1 className="mb-6 text-2xl font-semibold">Вход в AI Academy</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Пароль
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2"
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
          className="rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {login.isPending ? 'Входим…' : 'Войти'}
        </button>
      </form>
    </div>
  )
}
