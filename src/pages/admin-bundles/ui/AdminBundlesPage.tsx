import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import type { ReactNode } from 'react'

import { adminBundlesQueryOptions, useDeleteBundle } from '#/features/manage-bundle'
import { PageHeader, Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

const num = (n: number) => n.toLocaleString('ru-RU')

const STATUS: Record<string, { label: string; tone: string }> = {
  is_draft: { label: 'Черновик', tone: 'bg-ink/10 text-ink/60' },
  pending: { label: 'Ожидание', tone: 'bg-amber-100 text-amber-700' },
  active: { label: 'Активен', tone: 'bg-green-100 text-green-700' },
  inactive: { label: 'Неактивен', tone: 'bg-red-100 text-red-700' },
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/40">
      {children}
    </th>
  )
}

export function AdminBundlesPage() {
  const { data, isPending, isError, error } = useQuery(adminBundlesQueryOptions)
  const del = useDeleteBundle()

  return (
    <PanelLayout>
      <PageHeader
        title="Пакеты курсов"
        actions={
          <Link
            to="/admin/bundle/new"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            <Plus className="size-4" />
            Новый пакет
          </Link>
        }
      />

      <div className="rounded-2xl bg-white p-6">
        <div className="mb-2">
          <h3 className="font-display font-bold text-ink">Список пакетов</h3>
          <p className="mt-1 text-sm text-ink/45">
            Управляйте пакетами курсов и проверяйте ожидающие публикации.
          </p>
        </div>
        <div className="mt-4 overflow-x-auto">
          {isPending ? (
            <Spinner />
          ) : isError ? (
            <p className="text-red-600">{error.message}</p>
          ) : data.bundles.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink/40">Пакеты курсов не найдены</p>
          ) : (
            <table className="w-full min-w-[44rem]">
              <thead>
                <tr className="border-b border-brand-50">
                  <Th>ID</Th>
                  <Th>Название</Th>
                  <Th>Инструктор</Th>
                  <Th>Категория</Th>
                  <Th>Курсов</Th>
                  <Th>Цена</Th>
                  <Th>Статус</Th>
                  <Th>Действия</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {data.bundles.map((b) => {
                  const s = STATUS[b.status] ?? { label: b.status, tone: 'bg-ink/10 text-ink/60' }
                  return (
                    <tr key={b.id}>
                      <td className="px-3 py-4 text-sm text-ink/60">{b.id}</td>
                      <td className="px-3 py-4 text-sm font-semibold text-ink">{b.title}</td>
                      <td className="px-3 py-4 text-sm text-ink/70">{b.teacher_name ?? '—'}</td>
                      <td className="px-3 py-4 text-sm text-ink/70">{b.category ?? '—'}</td>
                      <td className="px-3 py-4 text-sm text-ink">{num(b.webinars_count)}</td>
                      <td className="px-3 py-4 text-sm text-ink">
                        {b.price ? `${num(b.price)} C` : 'Бесплатно'}
                      </td>
                      <td className="px-3 py-4">
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${s.tone}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <button
                          type="button"
                          disabled={del.isPending}
                          onClick={() => {
                            if (confirm('Удалить пакет курсов?')) del.mutate(b.id)
                          }}
                          className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PanelLayout>
  )
}
