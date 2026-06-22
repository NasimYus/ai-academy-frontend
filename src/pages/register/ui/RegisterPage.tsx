import { Link } from '@tanstack/react-router'

import { RegisterForm } from '#/features/auth/register'

export function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-gradient-to-b from-brand-50 to-white px-6 py-12">
      <div className="w-full max-w-sm rounded-card border border-brand-100 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-ink">Создать аккаунт</h1>
        <p className="mb-6 text-sm text-ink/60">Регистрация в AI Academy</p>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-ink/60">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
