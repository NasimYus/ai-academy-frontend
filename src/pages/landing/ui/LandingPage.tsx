import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Award, CalendarDays, GraduationCap } from 'lucide-react'

import { CourseCard, featuredCoursesQueryOptions } from '#/entities/course'
import { Button } from '#/shared/ui'

const VALUES = [
  {
    icon: GraduationCap,
    title: 'Курсы и вебинары',
    text: 'Видео, текстовые уроки и живые сессии от практиков.',
  },
  {
    icon: Award,
    title: 'Сертификаты',
    text: 'Проходите тесты и получайте подтверждённые достижения.',
  },
  {
    icon: CalendarDays,
    title: 'Консультации',
    text: 'Бронируйте личные встречи с преподавателями.',
  },
]

export function LandingPage() {
  const featured = useQuery(featuredCoursesQueryOptions)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-brand-100 bg-gradient-to-br from-brand-50 via-white to-brand-50">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
            Учитесь и преподавайте на <span className="text-brand-600">AI Academy</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/60">
            Курсы, вебинары, тесты и консультации — всё в одном месте. Начните бесплатно уже сегодня.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/courses">
              <Button>Смотреть курсы</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">Начать бесплатно</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-card border border-brand-100 bg-white p-6 text-center">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <v.icon className="size-6" strokeWidth={1.8} />
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-ink">{v.title}</h3>
              <p className="mt-1 text-sm text-ink/60">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      {featured.data && featured.data.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-ink">Рекомендуемые курсы</h2>
            <Link to="/courses" className="text-sm font-medium text-brand-600 hover:underline">
              Все курсы →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="border-t border-brand-100 bg-brand-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-14 text-center">
          <h2 className="font-display text-2xl font-bold text-white">Готовы начать обучение?</h2>
          <p className="max-w-md text-brand-100/80">
            Создайте аккаунт и получите доступ к бесплатным курсам и сертификатам.
          </p>
          <Link to="/register">
            <Button>Зарегистрироваться</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
