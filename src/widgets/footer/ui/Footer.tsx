import { Link } from '@tanstack/react-router'
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'

import { NewsletterForm } from '#/features/newsletter-subscribe'

const QUICK = [
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
  { to: '/instructors', label: 'Become Instructor' },
  { to: '/blog', label: 'Forums' },
  { to: '/blog', label: 'News' },
] as const

const CATEGORIES = [
  { to: '/courses', label: 'Main Courses' },
  { to: '/store', label: 'Additional Courses' },
  { to: '/bundles', label: 'Corporate Courses' },
  { to: '/courses', label: 'Hackathons' },
] as const

export function Footer() {
  return (
    <footer className="bg-brand-900 pt-14">
      {/* Newsletter band */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl border border-white/10 bg-white p-8 shadow-lg shadow-brand-900/20 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <h3 className="font-display text-xl font-bold text-ink">
              Будьте впереди с AI Academy
            </h3>
            <p className="mt-1 max-w-md text-sm text-ink/55">
              Новости курсов, AI-инсайты и эксклюзивные возможности — прямо на почту.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:shrink-0">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Footer body */}
      <div className="mx-auto mt-12 max-w-6xl px-6 pb-10 text-brand-100/80">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white">
              💪 AI Academy — Learn. Build. Grow.
            </span>
            <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-white">
              Ваш путь в AI
              <br />
              начинается здесь.
            </h2>
            <Link
              to="/register"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 font-medium text-white transition hover:bg-brand-400"
            >
              Записаться на курсы
            </Link>
          </div>

          <FooterColumn title="Quick Links" links={QUICK} />
          <FooterColumn title="Popular Categories" links={CATEGORIES} />

          <div>
            <p className="text-sm font-bold text-white">Contact US</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-300" strokeWidth={1.8} />
                21 Sh. Shotemur Street, Dushanbe
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-brand-300" strokeWidth={1.8} />
                +992 99 555 00 32
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-brand-300" strokeWidth={1.8} />
                ai.academy@zypl.ai
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-xs text-brand-100/50">
          <span>© {new Date().getFullYear()} AI Academy. Все права защищены.</span>
          <div className="flex gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/15 p-2 text-brand-100/70 transition hover:bg-white/5"
              aria-label="Instagram"
            >
              <Instagram className="size-4" strokeWidth={1.8} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/15 p-2 text-brand-100/70 transition hover:bg-white/5"
              aria-label="Facebook"
            >
              <Facebook className="size-4" strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: readonly { to: string; label: string }[]
}) {
  return (
    <div>
      <p className="text-sm font-bold text-white">{title}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="transition hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
