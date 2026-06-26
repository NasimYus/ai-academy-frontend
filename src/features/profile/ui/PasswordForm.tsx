import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { useSessionStore } from '#/entities/session'
import { changePassword } from '#/features/profile/api/profile'
import { Button, Field } from '#/shared/ui'

export function PasswordForm() {
  const user = useSessionStore((s) => s.user)
  const setAuth = useSessionStore((s) => s.setAuth)

  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const change = useMutation({
    mutationFn: changePassword,
    onSuccess: (token) => {
      // The backend issues a fresh token after a password change.
      if (user) setAuth(token, user)
      setCurrent('')
      setNext('')
      setDone(true)
    },
  })

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFieldError(null)
    setDone(false)
    if (next.length < 6) return setFieldError('Минимум 6 символов')
    change.mutate({ current_password: current, new_password: next })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field
        label="Текущий пароль"
        type="password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />
      <Field
        label="Новый пароль"
        type="password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
      />

      {(fieldError || change.isError) && (
        <p className="text-sm text-red-600">{fieldError ?? change.error?.message}</p>
      )}
      {done && <p className="text-sm text-green-600">Пароль изменён</p>}

      <Button type="submit" disabled={change.isPending} className="mt-2 self-start">
        {change.isPending ? 'Сохраняем…' : 'Изменить пароль'}
      </Button>
    </form>
  )
}
