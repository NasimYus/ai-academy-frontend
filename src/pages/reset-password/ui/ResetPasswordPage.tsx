import { ResetPasswordForm } from '#/features/auth/reset-password'
import { AuthShell } from '#/widgets/auth-shell'

export function ResetPasswordPage({ token, email }: { token: string; email: string }) {
  return (
    <AuthShell title="Новый пароль" subtitle="Придумайте новый пароль для аккаунта">
      <ResetPasswordForm token={token} email={email} />
    </AuthShell>
  )
}
