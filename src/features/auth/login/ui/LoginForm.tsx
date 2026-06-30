import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

import { useSessionStore } from '#/entities/session'
import { login } from '#/features/auth/login/api/login'
import { loginSchema } from '#/features/auth/login/model/schema'
import { Button, Field } from '#/shared/ui'

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
      navigate({ to: '/panel' })
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
      <Field
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Field
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {(fieldError || loginMutation.isError) && (
        <p className="text-sm text-red-600">{fieldError ?? loginMutation.error?.message}</p>
      )}

      <Button type="submit" disabled={loginMutation.isPending} className="mt-2 w-full">
        {loginMutation.isPending ? 'Входим…' : 'Войти'}
      </Button>
    </form>
  )
}
