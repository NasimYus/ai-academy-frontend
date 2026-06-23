import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

import { useSessionStore } from '#/entities/session'
import { login } from '#/features/auth/login/api/login'
import { loginSchema } from '#/features/auth/login/model/schema'

export function LoginForm() {
  const navigate = useNavigate()
  const setAuth = useSessionStore((s) => s.setAuth)

  const [email, setEmail] = useState('admin@aiacademy.tj')
  const [password, setPassword] = useState('admin12345')
  const [fieldError, setFieldError] = useState<string | null>(null)

  const loginMutation = useMutation({
    mutationFn: login,
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
    loginMutation.mutate(parsed.data)
  }

  return (
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

      {(fieldError || loginMutation.isError) && (
        <p className="text-sm text-red-600">
          {fieldError ?? loginMutation.error?.message}
        </p>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="mt-2 rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
      >
        {loginMutation.isPending ? 'Входим…' : 'Войти'}
      </button>
    </form>
  )
}
