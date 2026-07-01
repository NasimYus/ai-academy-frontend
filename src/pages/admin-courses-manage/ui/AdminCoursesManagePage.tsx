import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  Clock,
  Download,
  MoreHorizontal,
  Plus,
  ShoppingCart,
  Timer,
} from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { adminCoursesManageQueryOptions } from '#/entities/admin-course-manage'
import type { CourseStatus, CourseType } from '#/entities/admin-course-manage'
import { categoriesQueryOptions } from '#/entities/category'
import {
  useApproveCourse,
  useDeleteCourse,
  useRejectCourse,
  useUnpublishCourse,
} from '#/features/moderate-courses'
import { PageHeader, Spinner, StatCard } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

const num = (n: number) => n.toLocaleString('ru-RU')

const STATUS: Record<string, { label: string; tone: string }> = {
  is_draft: { label: 'Черновик', tone: 'bg-ink/10 text-ink/60' },
  pending: { label: 'Ожидание', tone: 'bg-amber-100 text-amber-700' },
  active: { label: 'Активен', tone: 'bg-green-100 text-green-700' },
  inactive: { label: 'Неактивен', tone: 'bg-red-100 text-red-700' },
}

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${d.getFullYear()} ${MONTHS[d.getMonth()]} ${d.getDate()} | ${hh}:${mm}`
}

function fmtDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}:${String(m).padStart(2, '0')} Часы`
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/40">
      {children}
    </th>
  )
}

function RowActions({ id, status }: { id: number; status: CourseStatus }) {
  const [open, setOpen] = useState(false)
  const approve = useApproveCourse()
  const reject = useRejectCourse()
  const unpublish = useUnpublishCourse()
  const del = useDeleteCourse()
  const busy = approve.isPending || reject.isPending || unpublish.isPending || del.isPending

  const item = 'block w-full px-4 py-2 text-left text-sm hover:bg-brand-50'
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex size-8 items-center justify-center rounded-lg text-ink/50 transition hover:bg-brand-50"
        aria-label="Действия"
      >
        <MoreHorizontal className="size-5" />
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
            aria-hidden
            tabIndex={-1}
          />
          <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-xl border border-brand-100 bg-white py-1 shadow-lg">
            <Link
              to="/instructor/course/$courseId/edit"
              params={{ courseId: String(id) }}
              search={{ step: 1 }}
              className={item}
            >
              Редактировать
            </Link>
            {status === 'pending' ? (
              <>
                <button
                  type="button"
                  disabled={busy}
                  className={`${item} text-green-700`}
                  onClick={() => approve.mutate(id, { onSettled: () => setOpen(false) })}
                >
                  Одобрить
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className={`${item} text-red-600`}
                  onClick={() => reject.mutate(id, { onSettled: () => setOpen(false) })}
                >
                  Отклонить
                </button>
              </>
            ) : null}
            {status === 'active' ? (
              <button
                type="button"
                disabled={busy}
                className={`${item} text-amber-700`}
                onClick={() => unpublish.mutate(id, { onSettled: () => setOpen(false) })}
              >
                Снять с публикации
              </button>
            ) : null}
            <button
              type="button"
              disabled={busy}
              className={`${item} text-red-600`}
              onClick={() => {
                if (confirm('Удалить курс безвозвратно?')) {
                  del.mutate(id, { onSettled: () => setOpen(false) })
                }
              }}
            >
              Удалить
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}

export function AdminCoursesManagePage({
  courseType,
  title,
}: {
  courseType: CourseType
  title: string
}) {
  // committed filters (applied on submit) vs the draft in the inputs
  const [filters, setFilters] = useState<{
    search: string
    from: string
    to: string
    category_id?: number
    status?: CourseStatus
    sort: string
    page: number
  }>({ search: '', from: '', to: '', sort: 'created_at_desc', page: 1 })
  const [draft, setDraft] = useState(filters)

  const { data: categories } = useQuery(categoriesQueryOptions)
  const { data, isPending, isError, error } = useQuery(
    adminCoursesManageQueryOptions({
      type: courseType,
      search: filters.search,
      from: filters.from,
      to: filters.to,
      category_id: filters.category_id,
      status: filters.status,
      sort: filters.sort,
      page: filters.page,
    }),
  )

  const apply = () => setFilters({ ...draft, page: 1 })

  const exportCsv = () => {
    if (!data) return
    const header = ['ID', 'Заголовок', 'Инструктор', 'Цена', 'Продажи', 'Доход', 'Студенты', 'Статус']
    const rows = data.courses.map((c) => [
      c.id,
      c.title,
      c.teacher_name ?? '',
      c.is_free ? 'Бесплатно' : c.price,
      c.sales_count,
      c.income,
      c.students_count,
      STATUS[c.status].label,
    ])
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${courseType}-courses.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.per_page)) : 1

  const field =
    'w-full rounded-xl border border-brand-100 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-400'
  const label = 'mb-1 block text-xs font-medium text-ink/50'

  return (
    <PanelLayout>
      <PageHeader
        title={`${title} — список`}
        actions={
          <span className="text-sm text-ink/45">
            <Link to="/admin" className="text-brand-600 hover:underline">
              Панель управления
            </Link>{' '}
            / {title}
          </span>
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={`Всего: ${title}`}
          value={data ? num(data.total_courses) : '—'}
          icon={<BookOpen className="size-5" />}
        />
        <StatCard
          label="Ожидает проверки"
          value={data ? num(data.total_pending) : '—'}
          icon={<Timer className="size-5" />}
        />
        <StatCard
          label="Общая продолжительность"
          value={data ? fmtDuration(data.total_duration) : '—'}
          icon={<Clock className="size-5" />}
        />
        <StatCard
          label="Всего продаж"
          value={data ? num(data.total_sales) : '—'}
          icon={<ShoppingCart className="size-5" />}
        />
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-2xl bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={label}>Поиск</label>
            <input
              className={field}
              value={draft.search}
              onChange={(e) => setDraft({ ...draft, search: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && apply()}
              placeholder="Название курса"
            />
          </div>
          <div>
            <label className={label}>Дата начала</label>
            <input
              type="date"
              className={field}
              value={draft.from}
              onChange={(e) => setDraft({ ...draft, from: e.target.value })}
            />
          </div>
          <div>
            <label className={label}>Дата окончания</label>
            <input
              type="date"
              className={field}
              value={draft.to}
              onChange={(e) => setDraft({ ...draft, to: e.target.value })}
            />
          </div>
          <div>
            <label className={label}>Сортировка</label>
            <select
              className={field}
              value={draft.sort}
              onChange={(e) => setDraft({ ...draft, sort: e.target.value })}
            >
              <option value="created_at_desc">Сначала новые</option>
              <option value="created_at_asc">Сначала старые</option>
              <option value="updated_at_desc">Недавно обновлённые</option>
              <option value="price_desc">Цена: по убыванию</option>
              <option value="price_asc">Цена: по возрастанию</option>
            </select>
          </div>
          <div>
            <label className={label}>Категория</label>
            <select
              className={field}
              value={draft.category_id ?? ''}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  category_id: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            >
              <option value="">Все категории</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Статус</label>
            <select
              className={field}
              value={draft.status ?? ''}
              onChange={(e) =>
                setDraft({ ...draft, status: (e.target.value || undefined) as CourseStatus })
              }
            >
              <option value="">Все статусы</option>
              <option value="active">Активен</option>
              <option value="pending">Ожидание</option>
              <option value="is_draft">Черновик</option>
              <option value="inactive">Неактивен</option>
            </select>
          </div>
          <div className="flex items-end lg:col-span-2">
            <button
              type="button"
              onClick={apply}
              className="w-full rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Показать результаты
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 rounded-2xl bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-ink">{title}</h3>
            <p className="mt-1 text-sm text-ink/45">
              Управляйте всеми курсами и проверяйте ожидающие публикации.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-xl border border-brand-100 px-4 py-2 text-sm font-medium text-ink/70 transition hover:bg-brand-50"
            >
              <Download className="size-4" />
              Экспорт в Excel
            </button>
            <Link
              to="/instructor/course/new"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              <Plus className="size-4" />
              Новый курс
            </Link>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          {isPending ? (
            <Spinner />
          ) : isError ? (
            <p className="text-red-600">{error.message}</p>
          ) : data.courses.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink/40">Курсы не найдены</p>
          ) : (
            <table className="w-full min-w-[60rem]">
              <thead>
                <tr className="border-b border-brand-50">
                  <Th>ID</Th>
                  <Th>Заголовок</Th>
                  <Th>Инструктор</Th>
                  <Th>Цена</Th>
                  <Th>Продажи</Th>
                  <Th>Доход</Th>
                  <Th>Студенты</Th>
                  <Th>Создано</Th>
                  <Th>Обновлено</Th>
                  <Th>Статус</Th>
                  <Th>Действия</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {data.courses.map((c) => {
                  const s = STATUS[c.status] ?? { label: c.status, tone: 'bg-ink/10 text-ink/60' }
                  return (
                    <tr key={c.id} className="align-top">
                      <td className="px-3 py-4 text-sm text-ink/60">{c.id}</td>
                      <td className="px-3 py-4">
                        <p className="text-sm font-semibold text-ink">{c.title}</p>
                        {c.category_name ? (
                          <p className="mt-0.5 text-xs text-ink/40">{c.category_name}</p>
                        ) : null}
                      </td>
                      <td className="px-3 py-4 text-sm text-ink/70">{c.teacher_name ?? '—'}</td>
                      <td className="px-3 py-4 text-sm text-ink">
                        {c.is_free ? 'Бесплатно' : `${num(c.price)} C`}
                      </td>
                      <td className="px-3 py-4 text-sm text-ink">
                        {num(c.sales_count)}
                        {c.capacity != null ? (
                          <span className="mt-0.5 block text-xs text-ink/40">
                            Вместимость: {c.capacity}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-4 text-sm text-ink">
                        {c.income > 0 ? `${num(c.income)} C` : '0'}
                      </td>
                      <td className="px-3 py-4 text-sm font-medium text-brand-600">
                        {num(c.students_count)}
                      </td>
                      <td className="px-3 py-4 text-xs text-ink/55">{fmtDate(c.created_at)}</td>
                      <td className="px-3 py-4 text-xs text-ink/55">{fmtDate(c.updated_at)}</td>
                      <td className="px-3 py-4">
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${s.tone}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <RowActions id={c.id} status={c.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isPending && !isError && data.total > data.per_page ? (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-ink/45">
              Стр. {data.page} из {totalPages} · всего {num(data.total)}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                className="rounded-lg border border-brand-100 px-3 py-1.5 disabled:opacity-40"
              >
                Назад
              </button>
              <button
                type="button"
                disabled={data.page >= totalPages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                className="rounded-lg border border-brand-100 px-3 py-1.5 disabled:opacity-40"
              >
                Вперёд
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </PanelLayout>
  )
}
