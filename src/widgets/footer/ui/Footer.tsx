import { Link } from '@tanstack/react-router'

import { NewsletterForm } from '#/features/newsletter-subscribe'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-100 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8 sm:flex-row sm:justify-between">
        <NewsletterForm />
        <nav className="flex flex-col gap-2 text-sm text-ink/60">
          <Link to="/courses" className="hover:text-brand-600">
            Курсы
          </Link>
          <Link to="/blog" className="hover:text-brand-600">
            Блог
          </Link>
          <Link to="/certificate-validation" className="hover:text-brand-600">
            Проверка сертификата
          </Link>
        </nav>
      </div>
    </footer>
  )
}
