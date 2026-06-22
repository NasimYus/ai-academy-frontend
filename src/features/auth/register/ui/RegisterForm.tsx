import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

import { useSessionStore } from '#/entities/session'
import {
  registerStep1,
  registerStep2,
  registerStep3,
} from '#/features/auth/register/api/register'
import {
  registerStep1Schema,
  registerStep2Schema,
  registerStep3Schema,
} from '#/features/auth/register/model/schema'

const inputCls =
  'rounded-lg border border-brand-200 px-3 py-2 font-normal outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
const labelCls = 'flex flex-col gap-1.5 text-sm font-medium text-ink'
const submitCls =
  'mt-2 rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50'

export function RegisterForm() {
  const navigate = useNavigate()
  const setAuth = useSessionStore((s) => s.setAuth)

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [userId, setUserId] = useState<number | null>(null)
  const [devCode, setDevCode] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [code, setCode] = useState('')
  const [fullName, setFullName] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)

  const step1 = useMutation({
    mutationFn: registerStep1,
    onSuccess: (res) => {
      setUserId(res.user_id)
      setDevCode(res.code ?? null)
      setStep(res.status === 'go_step_3' ? 3 : 2)
    },
  })

  const step2 = useMutation({
    mutationFn: registerStep2,
    onSuccess: () => setStep(3),
  })

  const step3 = useMutation({
    mutationFn: registerStep3,
    onSuccess: ({ token, user }) => {
      setAuth(token, user)
      navigate({ to: '/courses' })
    },
  })

  const pending = step1.isPending || step2.isPending || step3.isPending
  const mutationError = step1.error ?? step2.error ?? step3.error

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFieldError(null)

    if (step === 1) {
      const parsed = registerStep1Schema.safeParse({
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      if (!parsed.success) return setFieldError(parsed.error.issues[0]?.message ?? 'Проверьте поля')
      return step1.mutate(parsed.data)
    }

    if (step === 2) {
      const parsed = registerStep2Schema.safeParse({ code })
      if (!parsed.success) return setFieldError(parsed.error.issues[0]?.message ?? 'Проверьте код')
      if (userId == null) return setFieldError('Сессия регистрации потеряна, начните заново')
      return step2.mutate({ user_id: userId, code: parsed.data.code })
    }

    const parsed = registerStep3Schema.safeParse({ full_name: fullName })
    if (!parsed.success) return setFieldError(parsed.error.issues[0]?.message ?? 'Проверьте поля')
    if (userId == null) return setFieldError('Сессия регистрации потеряна, начните заново')
    step3.mutate({ user_id: userId, full_name: parsed.data.full_name })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {step === 1 && (
        <>
          <label className={labelCls}>
            E-mail
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </label>
          <label className={labelCls}>
            Пароль
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
        </>
      )}

      {step === 2 && (
        <label className={labelCls}>
          Код подтверждения
          <input value={code} onChange={(e) => setCode(e.target.value)} className={inputCls} inputMode="numeric" />
          {devCode && <span className="text-xs text-ink/50">Код (dev): {devCode}</span>}
        </label>
      )}

      {step === 3 && (
        <label className={labelCls}>
          Имя и фамилия
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
        </label>
      )}

      {(fieldError || mutationError) && (
        <p className="text-sm text-red-600">{fieldError ?? mutationError?.message}</p>
      )}

      <button type="submit" disabled={pending} className={submitCls}>
        {pending ? 'Подождите…' : step === 3 ? 'Завершить' : 'Далее'}
      </button>
    </form>
  )
}
