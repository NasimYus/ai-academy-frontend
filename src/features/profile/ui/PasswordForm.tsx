import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { useSessionStore } from '#/entities/session'
import { changePassword } from '#/features/profile/api/profile'

const inputCls =
  'rounded-lg border border-brand-200 px-3 py-2 font-normal outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
const labelCls = 'flex flex-col gap-1.5 text-sm font-medium text-ink'

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
      <label className={labelCls}>
        Текущий пароль
        <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className={inputCls} />
      </label>
      <label className={labelCls}>
        Новый пароль
        <input type="password" value={next} onChange={(e) => setNext(e.target.value)} className={inputCls} />
      </label>

      {(fieldError || change.isError) && (
        <p className="text-sm text-red-600">{fieldError ?? change.error?.message}</p>
      )}
      {done && <p className="text-sm text-green-600">Пароль изменён</p>}

      <button
        type="submit"
        disabled={change.isPending}
        className="mt-2 self-start rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
      >
        {change.isPending ? 'Сохраняем…' : 'Изменить пароль'}
      </button>
    </form>
  )
}
