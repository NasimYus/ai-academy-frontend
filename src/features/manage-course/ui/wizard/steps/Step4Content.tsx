import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronDown, ChevronUp, LayoutGrid, Pencil, Plus, Trash2, X } from 'lucide-react'

import { contentQueryOptions } from '#/features/manage-course/api/content'
import type { ChapterManage } from '#/features/manage-course/api/content'
import { useChapterMutations } from '#/features/manage-course/model/use-content'
import { ChapterItems } from '#/features/manage-course/ui/wizard/steps/ChapterItems'
import { Button, EmptyState, Spinner } from '#/shared/ui'

export function Step4Content({ courseId }: { courseId: number }) {
  const content = useQuery(contentQueryOptions(courseId))
  const m = useChapterMutations(courseId)
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const chapters = content.data?.chapters ?? []

  const submitNew = () => {
    if (!newTitle.trim()) return
    m.create.mutate(newTitle.trim(), {
      onSuccess: () => {
        setNewTitle('')
        setAdding(false)
      },
    })
  }

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= chapters.length) return
    const ids = chapters.map((c) => c.id)
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    m.reorder.mutate(ids)
  }

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand-100 p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
            <LayoutGrid className="size-5" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">Разделы</p>
            <p className="text-xs text-ink/55">Разделяйте курс на секции и организуйте материалы.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
        >
          <Plus className="size-4" /> Новый раздел
        </button>
      </div>

      {adding && (
        <div className="flex items-center gap-2 rounded-2xl border border-brand-200 bg-brand-50/30 p-3">
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitNew()}
            placeholder="Название раздела"
            className="flex-1 rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
          <Button size="sm" onClick={submitNew} disabled={m.create.isPending || !newTitle.trim()}>
            Добавить
          </Button>
          <button
            type="button"
            aria-label="Отмена"
            onClick={() => setAdding(false)}
            className="flex size-9 items-center justify-center rounded-lg text-ink/50 hover:bg-brand-50"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {content.isPending && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {content.data && chapters.length === 0 && !adding && (
        <EmptyState icon="📚">
          <p className="font-semibold text-ink">Контент отсутствует!</p>
          <p className="mt-1 text-sm">Добавьте материалы в ваш курс для студентов.</p>
        </EmptyState>
      )}

      <div className="space-y-3">
        {chapters.map((chapter, i) => (
          <ChapterRow
            key={chapter.id}
            courseId={courseId}
            chapter={chapter}
            isFirst={i === 0}
            isLast={i === chapters.length - 1}
            onRename={(title) => m.rename.mutate({ id: chapter.id, title })}
            onDelete={() => m.remove.mutate(chapter.id)}
            onMoveUp={() => move(i, -1)}
            onMoveDown={() => move(i, 1)}
          />
        ))}
      </div>
    </div>
  )
}

function ChapterRow({
  courseId,
  chapter,
  isFirst,
  isLast,
  onRename,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  courseId: number
  chapter: ChapterManage
  isFirst: boolean
  isLast: boolean
  onRename: (title: string) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(chapter.title)

  const iconBtn =
    'flex size-8 items-center justify-center rounded-lg text-ink/50 transition hover:bg-brand-50 hover:text-brand-600 disabled:opacity-30'

  return (
    <div className="rounded-2xl border border-brand-100 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-400">
            <LayoutGrid className="size-4" strokeWidth={1.8} />
          </span>
          {editing ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && title.trim()) {
                  onRename(title.trim())
                  setEditing(false)
                }
                if (e.key === 'Escape') setEditing(false)
              }}
              className="rounded-lg border border-brand-200 bg-white px-2 py-1 text-sm text-ink outline-none focus:border-brand-500"
            />
          ) : (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{chapter.title}</p>
              <p className="text-xs text-ink/50">
                {chapter.items_count} тем · {chapter.duration} мин
              </p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {editing ? (
            <>
              <button
                type="button"
                aria-label="Сохранить"
                className={iconBtn}
                onClick={() => {
                  if (title.trim()) onRename(title.trim())
                  setEditing(false)
                }}
              >
                <Check className="size-4" />
              </button>
              <button type="button" aria-label="Отмена" className={iconBtn} onClick={() => setEditing(false)}>
                <X className="size-4" />
              </button>
            </>
          ) : (
            <>
              <button type="button" aria-label="Вверх" className={iconBtn} disabled={isFirst} onClick={onMoveUp}>
                <ChevronUp className="size-4" />
              </button>
              <button type="button" aria-label="Вниз" className={iconBtn} disabled={isLast} onClick={onMoveDown}>
                <ChevronDown className="size-4" />
              </button>
              <button type="button" aria-label="Переименовать" className={iconBtn} onClick={() => setEditing(true)}>
                <Pencil className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Удалить"
                className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
                onClick={onDelete}
              >
                <Trash2 className="size-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <ChapterItems courseId={courseId} chapterId={chapter.id} items={chapter.items} />
    </div>
  )
}
