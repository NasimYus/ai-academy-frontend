import { Link } from '@tanstack/react-router'

import { NewsletterForm } from '#/features/newsletter-subscribe'

const COLUMNS = [
  {
    title: 'Обучение',
    links: [
      { to: '/courses', label: 'Курсы' },
      { to: '/instructors', label: 'Преподаватели' },
      { to: '/bundles', label: 'Наборы' },
      { to: '/subscriptions', label: 'Подписки' },
    ],
  },
  {
    title: 'Магазин',
    links: [
      { to: '/store', label: 'Товары' },
      { to: '/blog', label: 'Блог' },
    ],
  },
  {
    title: 'Помощь',
    links: [
      { to: '/support', label: 'Поддержка' },
      { to: '/certificate-validation', label: 'Проверка сертификата' },
    ],
  },
] as const

export function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <img src="/logo.png" alt="AI Academy" className="h-8 w-auto" />
            <p className="mt-3 max-w-xs text-sm text-ink/55">
              Онлайн-платформа курсов, вебинаров и консультаций. Учитесь и преподавайте.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-bold text-ink">{col.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-ink/60">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="transition hover:text-brand-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-brand-50">
        <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-ink/45">
          © {new Date().getFullYear()} AI Academy. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
