import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'

import { useSessionStore } from '#/entities/session'
import { login } from '#/features/auth/login'
import { Button } from '#/shared/ui'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const setAuth = useSessionStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(false)

  const mutation = useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const result = await login(input)
      if (result.user.role_name !== 'admin') {
        throw new Error('Доступ только для администраторов')
      }
      return result
    },
    onSuccess: ({ token, user }) => {
      setAuth(token, user)
      void navigate({ to: '/admin/courses' })
    },
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    mutation.mutate({ email: email.trim(), password })
  }

  const inputCls =
    'w-full rounded-xl bg-brand-50/70 px-4 py-3.5 text-ink outline-none transition placeholder:text-ink/35 focus:bg-white focus:ring-2 focus:ring-brand-300'

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-xl shadow-brand-900/10 backdrop-blur sm:p-10">
          <div className="flex justify-center">
            <img src="/logo.png" alt="AI Academy" className="h-12 w-auto" />
          </div>
          <h1 className="mt-6 text-center font-display text-3xl font-bold text-ink">
            Welcome Back to AI Academy!
          </h1>
          <p className="mt-2 text-center text-sm text-ink/50">
            Войдите в аккаунт, чтобы управлять платформой
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/70">Email</span>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ai.academy@zypl.ai"
                className={inputCls}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/70">Password</span>
              <span className="relative block">
                <input
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  aria-label={show ? 'Скрыть пароль' : 'Показать пароль'}
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 transition hover:text-ink/70"
                >
                  {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 rounded border-brand-200 text-brand-600 focus:ring-brand-300"
              />
              Remember me
            </label>

            {mutation.isError && (
              <p className="text-sm text-red-600">{mutation.error.message}</p>
            )}

            <Button type="submit" disabled={mutation.isPending} className="w-full py-3.5 text-base">
              {mutation.isPending ? 'Входим…' : 'Login'}
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 bg-white/70 px-6 py-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="h-7 w-auto" />
          <div className="leading-tight">
            <p className="text-sm font-bold text-ink">AI Academy</p>
            <p className="text-xs text-ink/45">All rights reserved!</p>
          </div>
        </div>
        <nav className="flex items-center gap-5 text-sm text-ink/60">
          <Link to="/" className="transition hover:text-brand-600">
            Home
          </Link>
          <Link to="/courses" className="transition hover:text-brand-600">
            Courses
          </Link>
          <Link to="/support" className="transition hover:text-brand-600">
            Contact Us
          </Link>
        </nav>
      </footer>
    </div>
  )
}
