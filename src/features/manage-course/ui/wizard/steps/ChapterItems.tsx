import { useState } from 'react'
import { FileText, MonitorPlay, Pencil, Plus, ScrollText, Trash2 } from 'lucide-react'

import type {
  ContentItemInput,
  ContentItemManage,
  ItemType,
} from '#/features/manage-course/api/content'
import { useItemMutations } from '#/features/manage-course/model/use-content'
import { Button, Field, Select, Textarea } from '#/shared/ui'

const TYPE_META: Record<ItemType, { label: string; icon: typeof FileText }> = {
  session: { label: 'Сессия', icon: MonitorPlay },
  file: { label: 'Файл', icon: FileText },
  text_lesson: { label: 'Урок', icon: ScrollText },
}

interface FormState {
  title: string
  accessibility: 'free' | 'paid'
  duration: string
  link: string
  session_date: string
  file: string
  description: string
  content: string
  study_time: string
}

const EMPTY: FormState = {
  title: '',
  accessibility: 'paid',
  duration: '',
  link: '',
  session_date: '',
  file: '',
  description: '',
  content: '',
  study_time: '',
}

function toInput(type: ItemType, f: FormState): ContentItemInput {
  const base: ContentItemInput = { title: f.title, accessibility: f.accessibility }
  if (type === 'session') {
    base.duration = f.duration ? Number(f.duration) : null
    base.link = f.link || null
    base.session_date = f.session_date ? new Date(f.session_date).toISOString() : null
    base.description = f.description || null
  } else if (type === 'file') {
    base.file = f.file || null
    base.description = f.description || null
  } else {
    base.content = f.content || null
    base.study_time = f.study_time ? Number(f.study_time) : null
  }
  return base
}

export function ChapterItems({
  courseId,
  chapterId,
  items,
}: {
  courseId: number
  chapterId: number
  items: ContentItemManage[]
}) {
  const m = useItemMutations(courseId)
  const [type, setType] = useState<ItemType>('session')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [f, setF] = useState<FormState>(EMPTY)

  const set = <TKey extends keyof FormState>(k: TKey, v: FormState[TKey]) =>
    setF((prev) => ({ ...prev, [k]: v }))

  const startAdd = (t: ItemType) => {
    setType(t)
    setEditingId(null)
    setF(EMPTY)
    setOpen(true)
  }

  const startEdit = (item: ContentItemManage) => {
    setType(item.type as ItemType)
    setEditingId(item.id)
    setF({ ...EMPTY, title: item.title, accessibility: item.accessibility })
    setOpen(true)
  }

  const submit = () => {
    if (!f.title.trim()) return
    const body = toInput(type, f)
    if (editingId != null) {
      m.update.mutate({ type, id: editingId, body }, { onSuccess: () => setOpen(false) })
    } else {
      m.create.mutate({ chapterId, type, body }, { onSuccess: () => setOpen(false) })
    }
  }

  return (
    <div className="mt-3 space-y-2">
      {items.map((item) => {
        const Icon = TYPE_META[item.type as ItemType].icon
        return (
          <div
            key={`${item.type}-${item.id}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-brand-100 bg-white px-3 py-2"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <Icon className="size-4 shrink-0 text-brand-400" strokeWidth={1.8} />
              <span className="truncate text-sm text-ink">{item.title}</span>
              <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] text-brand-600">
                {item.accessibility === 'free' ? 'Бесплатно' : 'Платно'}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label="Изменить"
                onClick={() => startEdit(item)}
                className="flex size-7 items-center justify-center rounded-lg text-ink/50 hover:bg-brand-50 hover:text-brand-600"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label="Удалить"
                onClick={() => m.remove.mutate({ type: item.type as ItemType, id: item.id })}
                className="flex size-7 items-center justify-center rounded-lg text-ink/50 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        )
      })}

      {open ? (
        <div className="space-y-3 rounded-xl border border-brand-200 bg-brand-50/30 p-3">
          {editingId == null && (
            <div className="flex gap-1.5">
              {(Object.keys(TYPE_META) as ItemType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    type === t ? 'bg-brand-600 text-white' : 'bg-white text-ink/60 hover:text-ink'
                  }`}
                >
                  {TYPE_META[t].label}
                </button>
              ))}
            </div>
          )}

          <Field label="Название *" value={f.title} onChange={(e) => set('title', e.target.value)} />

          {type === 'session' && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Длительность (мин)" type="number" value={f.duration} onChange={(e) => set('duration', e.target.value)} />
              <Field label="Дата и время" type="datetime-local" value={f.session_date} onChange={(e) => set('session_date', e.target.value)} />
              <Field label="Ссылка" value={f.link} onChange={(e) => set('link', e.target.value)} placeholder="https://…" />
            </div>
          )}
          {type === 'file' && (
            <>
              <Field label="Файл (URL)" value={f.file} onChange={(e) => set('file', e.target.value)} placeholder="/media/…" />
              <Field label="Описание" value={f.description} onChange={(e) => set('description', e.target.value)} />
            </>
          )}
          {type === 'text_lesson' && (
            <>
              <Field label="Время изучения (мин)" type="number" value={f.study_time} onChange={(e) => set('study_time', e.target.value)} />
              <Textarea label="Содержание" rows={4} value={f.content} onChange={(e) => set('content', e.target.value)} />
            </>
          )}

          <Select
            label="Доступ"
            value={f.accessibility}
            onChange={(e) => set('accessibility', e.target.value as 'free' | 'paid')}
          >
            <option value="paid">Платно</option>
            <option value="free">Бесплатно</option>
          </Select>

          <div className="flex gap-2">
            <Button size="sm" onClick={submit} disabled={m.create.isPending || m.update.isPending || !f.title.trim()}>
              {editingId != null ? 'Сохранить' : 'Добавить'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 pt-1">
          {(Object.keys(TYPE_META) as ItemType[]).map((t) => {
            const Icon = TYPE_META[t].icon
            return (
              <button
                key={t}
                type="button"
                onClick={() => startAdd(t)}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-600 transition hover:border-brand-400 hover:bg-brand-50"
              >
                <Plus className="size-3.5" /> <Icon className="size-3.5" /> {TYPE_META[t].label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
