import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { supportIndexQueryOptions } from '#/entities/support'
import type { SupportDetail } from '#/entities/support'
import { CreateTicketForm } from '#/features/support'

const STATUS_LABEL: Record<string, string> = {
  open: 'Открыто',
  replied: 'Есть ответ',
  supporter_replied: 'Ответ поддержки',
  close: 'Закрыто',
}

function TicketRow({ ticket }: { ticket: SupportDetail }) {
  return (
    <Link
      to="/support/$supportId"
      params={{ supportId: String(ticket.id) }}
      className="flex items-center justify-between rounded-xl border border-brand-100 bg-white px-4 py-3 transition hover:border-brand-300"
    >
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">{ticket.title}</p>
        <p className="truncate text-xs text-ink/50">
          {ticket.type === 'course_support'
            ? (ticket.course?.title ?? 'Курс')
            : (ticket.department ?? 'Платформа')}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
          ticket.status === 'close'
            ? 'bg-ink/10 text-ink/50'
            : 'bg-brand-100 text-brand-700'
        }`}
      >
        {STATUS_LABEL[ticket.status] ?? ticket.status}
      </span>
    </Link>
  )
}

function Section({
  title,
  tickets,
}: {
  title: string
  tickets: SupportDetail[]
}) {
  if (tickets.length === 0) return null
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-ink/70">{title}</h2>
      {tickets.map((t) => (
        <TicketRow key={t.id} ticket={t} />
      ))}
    </section>
  )
}

export function SupportPage() {
  const { data, isPending, isError, error } = useQuery(supportIndexQueryOptions)
  const [showForm, setShowForm] = useState(false)

  if (isPending)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (isError)
    return (
      <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">
        {error.message}
      </p>
    )

  const empty =
    data.class_support.length === 0 &&
    data.my_class_support.length === 0 &&
    data.tickets.length === 0

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Поддержка</h1>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          {showForm ? 'Отмена' : 'Новое обращение'}
        </button>
      </div>

      {showForm && <CreateTicketForm onCreated={() => setShowForm(false)} />}

      {empty && !showForm ? (
        <p className="text-ink/60">У вас пока нет обращений.</p>
      ) : (
        <>
          <Section
            title="Мои обращения по курсам"
            tickets={data.class_support}
          />
          <Section
            title="Обращения по моим курсам"
            tickets={data.my_class_support}
          />
          <Section
            title="Обращения в поддержку платформы"
            tickets={data.tickets}
          />
        </>
      )}
    </div>
  )
}
