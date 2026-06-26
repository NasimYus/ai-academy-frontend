import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

import { forgotPassword } from '#/features/auth/reset-password/api/reset-password'
import { forgotPasswordSchema } from '#/features/auth/reset-password/model/schema'
import { Button, Field } from '#/shared/ui'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)

  const request = useMutation({ mutationFn: forgotPassword })

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFieldError(null)
    const parsed = forgotPasswordSchema.safeParse({ email })
    if (!parsed.success) return setFieldError(parsed.error.issues[0]?.message ?? 'Проверьте e-mail')
    request.mutate(parsed.data.email)
  }

  if (request.isSuccess) {
    return (
      <div className="flex flex-col gap-3 text-sm text-ink/70">
        <p>Если такой e-mail существует, мы отправили ссылку для сброса пароля.</p>
        {request.data.token && (
          <Link
            to="/reset-password"
            search={{ token: request.data.token, email }}
            className="font-medium text-brand-600 hover:underline"
          >
            Ссылка (dev): сбросить пароль
          </Link>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      {(fieldError || request.isError) && (
        <p className="text-sm text-red-600">{fieldError ?? request.error?.message}</p>
      )}

      <Button type="submit" disabled={request.isPending} className="mt-2 w-full">
        {request.isPending ? 'Отправляем…' : 'Сбросить пароль'}
      </Button>
    </form>
  )
}
