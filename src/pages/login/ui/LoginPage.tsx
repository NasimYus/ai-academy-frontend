import { LoginForm } from '#/features/auth/login'

export function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-gradient-to-b from-brand-50 to-white px-6 py-12">
      <div className="w-full max-w-sm rounded-card border border-brand-100 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-ink">С возвращением</h1>
        <p className="mb-6 text-sm text-ink/60">Войдите в свой аккаунт AI Academy</p>

        <LoginForm />
      </div>
    </div>
  )
}
