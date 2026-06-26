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
import { Button, Field } from '#/shared/ui'

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
      {/* Step indicator */}
      <div className="mb-1 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <span
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              s === step ? 'w-8 bg-brand-500' : s < step ? 'w-8 bg-brand-300' : 'w-4 bg-brand-100'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <>
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
          <Field
            label="Повторите пароль"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </>
      )}

      {step === 2 && (
        <div>
          <Field
            label="Код подтверждения"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
          />
          {devCode && <span className="mt-1 block text-xs text-ink/50">Код (dev): {devCode}</span>}
        </div>
      )}

      {step === 3 && (
        <Field
          label="Имя и фамилия"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      )}

      {(fieldError || mutationError) && (
        <p className="text-sm text-red-600">{fieldError ?? mutationError?.message}</p>
      )}

      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? 'Подождите…' : step === 3 ? 'Завершить' : 'Далее'}
      </Button>
    </form>
  )
}
