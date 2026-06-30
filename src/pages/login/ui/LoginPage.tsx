import { useState } from 'react'
import { Link } from '@tanstack/react-router'

import { LoginForm } from '#/features/auth/login'
import { OAuthButtons } from '#/features/auth/oauth'

export function LoginPage() {
  const [method, setMethod] = useState<'email' | 'phone'>('email')

  return (
    <div className="bg-brand-50/40 px-4 py-10">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm lg:grid-cols-2">
        {/* Form side */}
        <div className="p-8 sm:p-12">
          <p className="text-sm font-semibold text-ink">Welcome Back! 👋</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">Войдите в аккаунт</h1>

          {/* Method tabs */}
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-brand-50 p-1">
            {(['email', 'phone'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`rounded-lg py-2 text-sm font-medium transition ${
                  method === m ? 'bg-brand-600 text-white shadow-sm' : 'text-ink/60 hover:text-ink'
                }`}
              >
                {m === 'email' ? 'Email' : 'Телефон'}
              </button>
            ))}
          </div>

          {method === 'phone' ? (
            <p className="mt-6 rounded-xl border border-dashed border-brand-200 bg-brand-50/50 px-4 py-6 text-center text-sm text-ink/55">
              Вход по телефону скоро будет доступен. Пока используйте e-mail.
            </p>
          ) : (
            <div className="mt-6">
              <LoginForm />
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-brand-600 hover:underline"
                >
                  Забыли пароль?
                </Link>
              </div>
              <OAuthButtons />
            </div>
          )}

          <p className="mt-6 text-center text-sm text-ink/60">
            Нет аккаунта?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:underline">
              Регистрация
            </Link>
          </p>
        </div>

        {/* Illustration side */}
        <div className="relative hidden flex-col items-center justify-center gap-4 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 p-12 text-center lg:flex">
          <div className="text-[120px] leading-none">🎯</div>
          <h2 className="font-display text-2xl font-bold text-ink">Развивайте карьеру</h2>
          <p className="max-w-xs text-ink/60">Стройте резюме с проверенной экспертизой</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="size-2 rounded-full bg-brand-200" />
            <span className="size-2 rounded-full bg-brand-200" />
            <span className="h-2 w-6 rounded-full bg-brand-600" />
          </div>
        </div>
      </div>
    </div>
  )
}
