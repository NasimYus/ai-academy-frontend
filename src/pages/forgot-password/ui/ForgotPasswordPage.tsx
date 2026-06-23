import { Link } from '@tanstack/react-router'

import { ForgotPasswordForm } from '#/features/auth/reset-password'

export function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-gradient-to-b from-brand-50 to-white px-6 py-12">
      <div className="w-full max-w-sm rounded-card border border-brand-100 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-ink">Сброс пароля</h1>
        <p className="mb-6 text-sm text-ink/60">Укажите e-mail — пришлём ссылку для сброса</p>

        <ForgotPasswordForm />

        <p className="mt-6 text-center text-sm text-ink/60">
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Вернуться ко входу
          </Link>
        </p>
      </div>
    </div>
  )
}
