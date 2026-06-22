import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

import { resetPassword } from '#/features/auth/reset-password/api/reset-password'
import { resetPasswordSchema } from '#/features/auth/reset-password/model/schema'

const inputCls =
  'rounded-lg border border-brand-200 px-3 py-2 font-normal outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
const labelCls = 'flex flex-col gap-1.5 text-sm font-medium text-ink'

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
      <label className={labelCls}>
        Новый пароль
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
      </label>
      <label className={labelCls}>
        Повторите пароль
        <input
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className={inputCls}
        />
      </label>

      {(fieldError || reset.isError) && (
        <p className="text-sm text-red-600">{fieldError ?? reset.error?.message}</p>
      )}

      <button
        type="submit"
        disabled={reset.isPending}
        className="mt-2 rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
      >
        {reset.isPending ? 'Сохраняем…' : 'Сохранить пароль'}
      </button>
    </form>
  )
}
