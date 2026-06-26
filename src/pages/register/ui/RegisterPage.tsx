import { Link } from '@tanstack/react-router'

import { OAuthButtons } from '#/features/auth/oauth'
import { RegisterForm } from '#/features/auth/register'
import { AuthShell } from '#/widgets/auth-shell'

export function RegisterPage() {
  return (
    <AuthShell
      title="Создать аккаунт"
      subtitle="Регистрация в AI Academy"
      footer={
        <span>
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Войти
          </Link>
        </span>
      }
    >
      <RegisterForm />
      <OAuthButtons />
    </AuthShell>
  )
}
