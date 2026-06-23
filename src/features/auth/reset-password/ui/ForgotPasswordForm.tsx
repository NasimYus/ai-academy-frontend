import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

import { forgotPassword } from '#/features/auth/reset-password/api/reset-password'
import { forgotPasswordSchema } from '#/features/auth/reset-password/model/schema'

const inputCls =
  'rounded-lg border border-brand-200 px-3 py-2 font-normal outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200'

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
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        E-mail
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
      </label>

      {(fieldError || request.isError) && (
        <p className="text-sm text-red-600">{fieldError ?? request.error?.message}</p>
      )}

      <button
        type="submit"
        disabled={request.isPending}
        className="mt-2 rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
      >
        {request.isPending ? 'Отправляем…' : 'Сбросить пароль'}
      </button>
    </form>
  )
}
