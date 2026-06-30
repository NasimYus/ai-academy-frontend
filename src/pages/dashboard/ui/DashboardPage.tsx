import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  Award,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  HelpCircle,
  LifeBuoy,
  PlayCircle,
  Video,
  Wallet,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { dashboardQueryOptions } from '#/entities/dashboard'
import { useSessionStore } from '#/entities/session'
import { Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

/** A white panel card (legacy `.bg-white .rounded-24`). */
function Panel({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-3xl bg-white p-4 ${className}`}>{children}</div>
}

/** Dashed empty-state block with an icon bubble — matches legacy dashboard empties. */
function EmptyBlock({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
        {icon}
      </span>
      <h5 className="mt-3 text-sm font-semibold text-ink">{title}</h5>
      <p className="mt-1 text-xs text-ink/50">{subtitle}</p>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h4 className="font-display text-sm font-bold text-ink">{children}</h4>
}

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)

export function DashboardPage() {
  const user = useSessionStore((s) => s.user)
  const { data, isPending, isError, error } = useQuery(dashboardQueryOptions)

  if (isPending) {
    return (
      <PanelLayout>
        <Spinner />
      </PanelLayout>
    )
  }
  if (isError) {
    return (
      <PanelLayout>
        <p className="text-red-600">{error.message}</p>
      </PanelLayout>
    )
  }

  const counters = [
    { label: 'Курсы', value: data.enrolled_count, icon: <PlayCircle className="size-6" /> },
    { label: 'Встречи', value: data.meetings_count, icon: <Video className="size-6" /> },
    { label: 'Сертификаты', value: data.certificates_count, icon: <Award className="size-6" /> },
    {
      label: 'Сданные тесты',
      value: data.passed_quizzes_count,
      icon: <ClipboardCheck className="size-6" />,
    },
  ]

  return (
    <PanelLayout>
      <div className="grid gap-6 lg:grid-cols-12">
        {/* ── Main column ── */}
        <div className="space-y-6 lg:col-span-6">
          {/* Hello box */}
          <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-500 p-6 text-white">
            <h1 className="truncate font-display text-2xl font-bold">
              Привет, {user?.full_name ?? 'студент'} 👋
            </h1>
            <p className="mt-2 text-sm text-white/75">
              Добро пожаловать — начнём эффективное обучение сегодня!
            </p>
            <div className="mt-6 grid grid-cols-2 gap-y-5 sm:grid-cols-4">
              {counters.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-full bg-white/15">
                    {c.icon}
                  </span>
                  <div>
                    <span className="block font-bold">{c.value}</span>
                    <span className="mt-0.5 block text-sm text-white/75">{c.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courses overview */}
          <Panel>
            <SectionTitle>Обзор курсов</SectionTitle>
            {data.enrolled_count > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <OverviewStat label="Всего курсов" value={data.enrolled_count} tone="brand" />
                <OverviewStat label="Завершено" value={0} tone="success" />
                <OverviewStat label="В процессе" value={data.enrolled_count} tone="warning" />
              </div>
            ) : (
              <div className="mt-4">
                <EmptyBlock
                  icon={<PlayCircle className="size-6" />}
                  title="Нет курсов!"
                  subtitle="У вас пока нет курсов. Найдите подходящий курс в каталоге."
                />
              </div>
            )}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h5 className="text-sm text-ink">Хотите больше курсов?</h5>
                <p className="mt-0.5 text-xs text-ink/50">
                  Изучите все курсы и найдите профессиональный курс.
                </p>
              </div>
              <Link
                to="/courses"
                className="flex size-10 items-center justify-center rounded-full border border-brand-100 text-ink/50 transition hover:bg-brand-50"
                aria-label="Все курсы"
              >
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </Panel>

          {/* My assignments */}
          <Panel>
            <SectionTitle>Мои задания</SectionTitle>
            <div className="mt-4">
              <EmptyBlock
                icon={<ClipboardList className="size-6" />}
                title="Задания отсутствуют!"
                subtitle="У вас нет несданных заданий или заданий на проверке."
              />
            </div>
          </Panel>

          {/* Learning activity */}
          <Panel>
            <SectionTitle>Активность в обучении</SectionTitle>
            <div className="mt-4">
              <EmptyBlock
                icon={<PlayCircle className="size-6" />}
                title="Пока нет активности!"
                subtitle="Начните обучение сегодня — смотрите купленные курсы или запишитесь на новые."
              >
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-white p-2">
                  <Link
                    to="/my-courses"
                    className="flex items-center gap-2 rounded-xl border border-dashed border-brand-200 px-4 py-3 text-sm text-ink transition hover:bg-brand-50"
                  >
                    <PlayCircle className="size-5 text-brand-600" />
                    Мои курсы
                  </Link>
                  <Link
                    to="/courses"
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-ink transition hover:bg-brand-50"
                  >
                    Изучить курсы
                    <ChevronRight className="size-4 text-ink/50" />
                  </Link>
                </div>
              </EmptyBlock>
            </div>
          </Panel>
        </div>

        {/* ── Wallet / noticeboard / quizzes column ── */}
        <div className="space-y-6 lg:col-span-3">
          {/* Wallet */}
          <Panel>
            <div className="rounded-2xl bg-gradient-to-br from-ink to-brand-700 px-4 pb-6 pt-4 text-white">
              <span className="font-display text-base font-bold">Текущий баланс</span>
              <span className="mt-1 block text-xs text-white/70">{fmtDate(new Date())}</span>
              <span className="mt-6 block font-display text-4xl font-bold">
                {data.balance > 0 ? `${data.balance.toLocaleString('ru-RU')} c` : 'Нет баланса'}
              </span>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <span className="block text-sm font-bold text-ink">Кошелёк</span>
                <span className="mt-0.5 block text-xs text-ink/50">Управляйте своим балансом</span>
              </div>
              <Link
                to="/purchases"
                className="flex size-10 items-center justify-center rounded-full border border-brand-100 text-ink/50 transition hover:bg-brand-50"
                aria-label="Кошелёк"
              >
                <Wallet className="size-4" />
              </Link>
            </div>
          </Panel>

          {/* Noticeboard */}
          <Panel>
            <SectionTitle>Доска объявлений</SectionTitle>
            <div className="mt-4">
              <EmptyBlock
                icon={<CalendarDays className="size-6" />}
                title="Нет уведомлений!"
                subtitle="У вас пока нет уведомлений от администратора."
              />
            </div>
          </Panel>

          {/* Support CTA */}
          <Panel>
            <span className="flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
              <LifeBuoy className="size-6" />
            </span>
            <h5 className="mt-4 font-display text-base font-bold text-ink">
              Нужна помощь по курсу?
            </h5>
            <p className="mt-2 text-xs text-ink/50">
              Свяжитесь с преподавателями курса или поддержкой платформы — мы поможем.
            </p>
            <Link
              to="/support"
              className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-brand-600"
            >
              Получить поддержку
              <ChevronRight className="size-4" />
            </Link>
          </Panel>

          {/* My quizzes */}
          <Panel>
            <SectionTitle>Мои тесты</SectionTitle>
            <div className="mt-4">
              <EmptyBlock
                icon={<ClipboardCheck className="size-6" />}
                title="Нет тестов!"
                subtitle="У вас нет непройденных тестов или тестов на проверке."
              />
            </div>
          </Panel>
        </div>

        {/* ── Calendar / sessions column ── */}
        <div className="space-y-6 lg:col-span-3">
          {/* Events calendar */}
          <Panel>
            <SectionTitle>Календарь событий</SectionTitle>
            <p className="mt-1 text-xs text-ink/50">Управляйте своими активностями в календаре.</p>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <SectionTitle>Предстоящие события</SectionTitle>
                <p className="mt-1 text-xs text-ink/50">0 всего событий</p>
              </div>
              <Link
                to="/meetings"
                className="flex size-10 items-center justify-center rounded-full border border-brand-100 text-ink/50 transition hover:bg-brand-50"
                aria-label="События"
              >
                <ChevronRight className="size-4" />
              </Link>
            </div>
            <div className="mt-4">
              <EmptyBlock
                icon={<CalendarDays className="size-6" />}
                title="Нет событий!"
                subtitle="На вашем сайте нет предстоящих событий."
              />
            </div>
          </Panel>

          {/* Upcoming live sessions */}
          <Panel>
            <SectionTitle>Предстоящие онлайн-сессии</SectionTitle>
            <div className="mt-4">
              <EmptyBlock
                icon={<Video className="size-6" />}
                title="Нет онлайн-сессий!"
                subtitle="У вас нет предстоящих сессий. Найдите подходящий курс."
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h5 className="text-sm text-ink">Изучить онлайн-классы</h5>
                <p className="mt-0.5 text-xs text-ink/50">Найдите подходящий онлайн-класс.</p>
              </div>
              <Link
                to="/courses"
                className="flex size-10 items-center justify-center rounded-full border border-brand-100 text-ink/50 transition hover:bg-brand-50"
                aria-label="Онлайн-классы"
              >
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </Panel>

          {/* Quick help hint */}
          <Panel className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <HelpCircle className="size-5" />
            </span>
            <Link to="/support" className="text-sm font-medium text-ink/70 hover:text-brand-600">
              Часто задаваемые вопросы
            </Link>
          </Panel>
        </div>
      </div>
    </PanelLayout>
  )
}

const TONES = {
  brand: 'bg-brand-50 text-brand-600',
  success: 'bg-green-50 text-green-600',
  warning: 'bg-amber-50 text-amber-600',
} as const

function OverviewStat({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: keyof typeof TONES
}) {
  return (
    <div className="flex items-start justify-between rounded-2xl bg-brand-50/50 p-4">
      <div>
        <span className="text-xs text-ink/50">{label}</span>
        <span className="mt-4 block font-display text-2xl font-bold text-ink">{value}</span>
      </div>
      <span className={`flex size-12 items-center justify-center rounded-xl ${TONES[tone]}`}>
        <PlayCircle className="size-6" />
      </span>
    </div>
  )
}
