import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

// Branded shell for the auth screens (login / register / password flows):
// a centered card on a soft brand gradient with the logo on top.
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-57px)] items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-50 px-6 py-12">
      {/* decorative brand glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-brand-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-brand-200/40 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-2xl border border-brand-100 bg-white p-8 shadow-lg shadow-brand-900/5">
        <Link to="/" className="mb-6 flex justify-center">
          <img src="/logo.png" alt="AI Academy" className="h-9 w-auto" />
        </Link>
        <h1 className="text-center text-2xl font-bold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-center text-sm text-ink/60">{subtitle}</p>}

        <div className="mt-6">{children}</div>

        {footer && (
          <div className="mt-6 flex flex-col items-center gap-2 text-sm text-ink/60">{footer}</div>
        )}
      </div>
    </div>
  )
}
