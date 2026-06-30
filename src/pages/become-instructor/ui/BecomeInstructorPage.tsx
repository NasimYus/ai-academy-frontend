import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, Clock, GraduationCap } from 'lucide-react'
import { useState } from 'react'

import { myBecomeInstructorQueryOptions } from '#/entities/become-instructor'
import { categoriesQueryOptions } from '#/entities/category'
import { useSessionStore } from '#/entities/session'
import { useSubmitBecomeInstructor } from '#/features/become-instructor'
import { Button, PageHeader, Spinner, Textarea } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

const ROLES = [
  { value: 'teacher', label: 'Инструктор', hint: 'Продавать и вести свои курсы' },
  { value: 'organization', label: 'Организация', hint: 'Команда преподавателей' },
] as const

function StatusCard({
  icon,
  tone,
  title,
  text,
}: {
  icon: React.ReactNode
  tone: 'pending' | 'accept' | 'reject'
  title: string
  text: string
}) {
  const ring =
    tone === 'accept'
      ? 'bg-green-50 text-green-600'
      : tone === 'reject'
        ? 'bg-red-50 text-red-600'
        : 'bg-amber-50 text-amber-600'
  return (
    <div className="flex items-start gap-4 rounded-3xl bg-white p-6">
      <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${ring}`}>
        {icon}
      </span>
      <div>
        <h3 className="font-display font-bold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-ink/60">{text}</p>
      </div>
    </div>
  )
}

export function BecomeInstructorPage() {
  const role = useSessionStore((s) => s.user?.role_name)
  const request = useQuery(myBecomeInstructorQueryOptions)
  const { data: categories } = useQuery(categoriesQueryOptions)
  const submit = useSubmitBecomeInstructor()

  const [accountRole, setAccountRole] = useState<'teacher' | 'organization'>('teacher')
  const [occupations, setOccupations] = useState<number[]>([])
  const [description, setDescription] = useState('')

  const toggleOccupation = (id: number) =>
    setOccupations((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit.mutate({ role: accountRole, occupations, description })
  }

  const body = () => {
    if (role && role !== 'user') {
      return (
        <StatusCard
          icon={<CheckCircle2 className="size-6" />}
          tone="accept"
          title="Вы уже инструктор"
          text="Ваш аккаунт уже имеет права инструктора — создавайте и продавайте курсы."
        />
      )
    }
    if (request.isPending) return <Spinner />
    if (request.isError) return <p className="text-red-600">{request.error.message}</p>

    const existing = request.data
    if (existing && existing.status === 'pending') {
      return (
        <StatusCard
          icon={<Clock className="size-6" />}
          tone="pending"
          title="Заявка на рассмотрении"
          text="Мы получили вашу заявку. Администратор рассмотрит её в ближайшее время."
        />
      )
    }
    if (existing && existing.status === 'accept') {
      return (
        <StatusCard
          icon={<CheckCircle2 className="size-6" />}
          tone="accept"
          title="Заявка одобрена"
          text="Поздравляем! Войдите заново, чтобы открылись инструменты инструктора."
        />
      )
    }

    return (
      <div className="rounded-3xl bg-white p-6">
        {existing && existing.status === 'reject' && (
          <div className="mb-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            Предыдущая заявка отклонена. Вы можете подать новую.
          </div>
        )}
        <h3 className="font-display font-bold text-ink">Заявка на роль инструктора</h3>
        <p className="mt-1 text-sm text-ink/50">
          Расскажите о себе — после одобрения вы сможете публиковать курсы.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          <div>
            <span className="mb-2 block text-sm font-medium text-ink">Тип аккаунта</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setAccountRole(r.value)}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    accountRole === r.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-brand-100 text-ink/70 hover:bg-brand-50/60'
                  }`}
                >
                  <span className="block text-sm font-semibold">{r.label}</span>
                  <span className="mt-0.5 block text-xs text-ink/50">{r.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-ink">Специализации</span>
            <div className="flex flex-wrap gap-2">
              {(categories ?? []).map((c) => {
                const active = occupations.includes(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleOccupation(c.id)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      active
                        ? 'border-brand-500 bg-brand-500 text-white'
                        : 'border-brand-200 text-ink/70 hover:bg-brand-50'
                    }`}
                  >
                    {c.title}
                  </button>
                )
              })}
              {(categories ?? []).length === 0 && (
                <span className="text-sm text-ink/40">Категории не найдены</span>
              )}
            </div>
          </div>

          <Textarea
            label="О себе"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Опыт преподавания, чему хотите учить…"
          />

          {submit.isError && <p className="text-sm text-red-600">{submit.error.message}</p>}
          {submit.isSuccess && (
            <p className="text-sm text-green-600">Заявка отправлена — ожидайте решения.</p>
          )}

          <Button type="submit" disabled={submit.isPending} className="w-full py-3">
            {submit.isPending ? 'Отправка…' : 'Отправить заявку'}
          </Button>
        </form>
      </div>
    )
  }

  return (
    <PanelLayout>
      <PageHeader
        title="Стать инструктором"
        subtitle="Превратите свои знания в курсы и начните преподавать"
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">{body()}</div>
        <aside className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-500 p-6 text-white">
          <span className="flex size-12 items-center justify-center rounded-xl bg-white/15">
            <GraduationCap className="size-6" />
          </span>
          <h4 className="mt-4 font-display text-lg font-bold">Почему стоит преподавать?</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>• Делитесь знаниями с тысячами студентов</li>
            <li>• Зарабатывайте на продаже курсов</li>
            <li>• Проводите встречи и живые сессии</li>
          </ul>
        </aside>
      </div>
    </PanelLayout>
  )
}
