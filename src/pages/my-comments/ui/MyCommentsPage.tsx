import { useQuery } from '@tanstack/react-query'
import { MessageSquare } from 'lucide-react'

import { myCommentsQueryOptions } from '#/entities/comment'
import { Badge, PageHeader, Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

const STATUS: Record<string, { label: string; tone: 'success' | 'warning' | 'neutral' }> = {
  replied: { label: 'Отвечено', tone: 'success' },
  open: { label: 'Открыт', tone: 'warning' },
  new: { label: 'Новый', tone: 'neutral' },
}

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(iso),
  )

export function MyCommentsPage() {
  const { data, isPending, isError, error } = useQuery(myCommentsQueryOptions)

  return (
    <PanelLayout>
      <PageHeader title="Мои комментарии" subtitle="Ваши комментарии к курсам и статьям" />
      {isPending ? (
        <Spinner />
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-brand-200 bg-white p-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
            <MessageSquare className="size-6" />
          </span>
          <h5 className="mt-3 text-sm font-semibold text-ink">Комментариев нет!</h5>
          <p className="mt-1 text-xs text-ink/50">Вы ещё не оставляли комментариев.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((c) => {
            const s = STATUS[c.status] ?? STATUS.new
            return (
              <div key={c.id} className="rounded-2xl bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-ink/50">{fmt(c.created_at)}</span>
                  <Badge tone={s.tone}>{s.label}</Badge>
                </div>
                <p className="mt-2 text-sm text-ink/80">{c.comment}</p>
              </div>
            )
          })}
        </div>
      )}
    </PanelLayout>
  )
}
