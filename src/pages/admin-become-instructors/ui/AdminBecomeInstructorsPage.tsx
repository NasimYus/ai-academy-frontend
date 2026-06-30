import { useQuery } from '@tanstack/react-query'
import { UserCheck } from 'lucide-react'

import { adminBecomeInstructorsQueryOptions } from '#/entities/become-instructor'
import { useModerateBecomeInstructor } from '#/features/become-instructor'
import { Avatar, Badge, Button, PageHeader, Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

const STATUS: Record<string, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  accept: { label: 'Одобрено', tone: 'success' },
  pending: { label: 'На рассмотрении', tone: 'warning' },
  reject: { label: 'Отклонено', tone: 'danger' },
}

const ROLE_LABEL: Record<string, string> = { teacher: 'Инструктор', organization: 'Организация' }

export function AdminBecomeInstructorsPage() {
  const { data, isPending, isError, error } = useQuery(adminBecomeInstructorsQueryOptions)
  const moderate = useModerateBecomeInstructor()

  return (
    <PanelLayout>
      <PageHeader title="Заявки инструкторов" subtitle="Одобряйте или отклоняйте заявки студентов" />
      {isPending ? (
        <Spinner />
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-brand-200 bg-white p-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
            <UserCheck className="size-6" />
          </span>
          <h5 className="mt-3 text-sm font-semibold text-ink">Заявок нет</h5>
          <p className="mt-1 text-xs text-ink/50">Новые заявки появятся здесь.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((r) => {
            const s = STATUS[r.status] ?? STATUS.pending
            return (
              <div key={r.id} className="rounded-2xl bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={r.user.full_name} size={42} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">
                        {r.user.full_name ?? r.user.email}
                      </p>
                      <p className="mt-0.5 text-xs text-ink/50">
                        {ROLE_LABEL[r.role] ?? r.role} · {r.user.email}
                      </p>
                    </div>
                  </div>
                  <Badge tone={s.tone}>{s.label}</Badge>
                </div>

                {r.description && <p className="mt-3 text-sm text-ink/70">{r.description}</p>}

                {r.status === 'pending' && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      disabled={moderate.isPending}
                      onClick={() => moderate.mutate({ id: r.id, action: 'accept' })}
                    >
                      Одобрить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={moderate.isPending}
                      onClick={() => moderate.mutate({ id: r.id, action: 'reject' })}
                    >
                      Отклонить
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </PanelLayout>
  )
}
