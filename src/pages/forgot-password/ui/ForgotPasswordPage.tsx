import { Link } from '@tanstack/react-router'

import { ForgotPasswordForm } from '#/features/auth/reset-password'
import { AuthShell } from '#/widgets/auth-shell'

export function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Сброс пароля"
      subtitle="Укажите e-mail — пришлём ссылку для сброса"
      footer={
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Вернуться ко входу
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  )
}
