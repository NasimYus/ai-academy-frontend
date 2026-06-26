import { Link } from '@tanstack/react-router'

import { LoginForm } from '#/features/auth/login'
import { OAuthButtons } from '#/features/auth/oauth'
import { AuthShell } from '#/widgets/auth-shell'

export function LoginPage() {
  return (
    <AuthShell
      title="С возвращением"
      subtitle="Войдите в свой аккаунт AI Academy"
      footer={
        <>
          <Link to="/forgot-password" className="font-medium text-brand-600 hover:underline">
            Забыли пароль?
          </Link>
          <span>
            Нет аккаунта?{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:underline">
              Зарегистрироваться
            </Link>
          </span>
        </>
      }
    >
      <LoginForm />
      <OAuthButtons />
    </AuthShell>
  )
}
