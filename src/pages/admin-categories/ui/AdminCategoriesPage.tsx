import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CornerDownRight, Pencil, Trash2 } from 'lucide-react'

import { adminCategoriesQueryOptions, useCategoryAdmin } from '#/features/manage-categories'
import type { AdminCategory } from '#/features/manage-categories'
import { Button, Field, PageHeader, Select, Spinner, Switch } from '#/shared/ui'

export function AdminCategoriesPage() {
  const categories = useQuery(adminCategoriesQueryOptions)
  const m = useCategoryAdmin()
  const [title, setTitle] = useState('')
  const [parent, setParent] = useState('')

  const all = categories.data ?? []
  const parents = all.filter((c) => c.parent_id == null)
  const childrenOf = (id: number) => all.filter((c) => c.parent_id === id)

  const submit = () => {
    if (!title.trim()) return
    m.create.mutate(
      { title: title.trim(), parent_id: parent ? Number(parent) : null, order: 0, enable: true },
      {
        onSuccess: () => {
          setTitle('')
          setParent('')
        },
      },
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <PageHeader title="Категории" subtitle="Управляйте категориями курсов и подкатегориями." />

      {/* Add form */}
      <div className="mb-6 grid gap-3 rounded-2xl border border-brand-100 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label="Название" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Напр. Программирование" />
        <Select label="Родительская (необязательно)" value={parent} onChange={(e) => setParent(e.target.value)}>
          <option value="">— Верхний уровень —</option>
          {parents.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </Select>
        <Button onClick={submit} disabled={!title.trim() || m.create.isPending}>
          Добавить
        </Button>
      </div>

      {m.create.isError && <p className="mb-3 text-sm text-red-600">{m.create.error.message}</p>}

      {categories.isPending && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      <div className="space-y-2">
        {parents.map((cat) => (
          <div key={cat.id} className="space-y-2">
            <CategoryRow category={cat} />
            {childrenOf(cat.id).map((sub) => (
              <div key={sub.id} className="ml-6 flex items-center gap-2">
                <CornerDownRight className="size-4 shrink-0 text-ink/30" />
                <div className="flex-1">
                  <CategoryRow category={sub} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoryRow({ category }: { category: AdminCategory }) {
  const m = useCategoryAdmin()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(category.title)

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-100 bg-white px-3 py-2">
      {editing ? (
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && title.trim()) {
              m.update.mutate({ id: category.id, body: { title: title.trim() } })
              setEditing(false)
            }
            if (e.key === 'Escape') setEditing(false)
          }}
          className="flex-1 rounded-lg border border-brand-200 px-2 py-1 text-sm text-ink outline-none focus:border-brand-500"
        />
      ) : (
        <span className="truncate text-sm font-medium text-ink">{category.title}</span>
      )}

      <div className="flex shrink-0 items-center gap-3">
        <Switch
          checked={category.enable}
          onChange={(v) => m.update.mutate({ id: category.id, body: { enable: v } })}
        />
        <button
          type="button"
          aria-label="Переименовать"
          onClick={() => {
            setTitle(category.title)
            setEditing((v) => !v)
          }}
          className="flex size-8 items-center justify-center rounded-lg text-ink/50 hover:bg-brand-50 hover:text-brand-600"
        >
          <Pencil className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Удалить"
          onClick={() => m.remove.mutate(category.id)}
          className="flex size-8 items-center justify-center rounded-lg text-ink/50 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  )
}
