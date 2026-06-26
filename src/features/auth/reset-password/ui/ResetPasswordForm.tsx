import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

import { resetPassword } from '#/features/auth/reset-password/api/reset-password'
import { resetPasswordSchema } from '#/features/auth/reset-password/model/schema'
import { Button, Field } from '#/shared/ui'

export function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)

  const reset = useMutation({
    mutationFn: resetPassword,
    onSuccess: (statusResult) => {
      if (statusResult === 'reset') navigate({ to: '/login' })
      else setFieldError('Ссылка недействительна или устарела')
    },
  })

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFieldError(null)
    if (!token || !email) return setFieldError('Ссылка для сброса неполная')
    const parsed = resetPasswordSchema.safeParse({ password, password_confirmation: passwordConfirmation })
    if (!parsed.success) return setFieldError(parsed.error.issues[0]?.message ?? 'Проверьте поля')
    reset.mutate({ token, email, ...parsed.data })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field
        label="Новый пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Field
        label="Повторите пароль"
        type="password"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
      />

      {(fieldError || reset.isError) && (
        <p className="text-sm text-red-600">{fieldError ?? reset.error?.message}</p>
      )}

      <Button type="submit" disabled={reset.isPending} className="mt-2 w-full">
        {reset.isPending ? 'Сохраняем…' : 'Сохранить пароль'}
      </Button>
    </form>
  )
}
