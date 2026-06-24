import { useEffect, useState } from 'react'

import type { NoteTargetType } from '#/entities/note'
import { useDeleteNote, useNote, useSaveNote } from '#/features/personal-note/model/use-note'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function NotePanel({
  courseId,
  targetType,
  targetId,
}: {
  courseId: number
  targetType: NoteTargetType
  targetId: number
}) {
  const [open, setOpen] = useState(false)
  const note = useNote(targetType, targetId)
  const save = useSaveNote()
  const del = useDeleteNote(targetType, targetId)
  const [text, setText] = useState('')

  // Sync the textarea with the loaded note once it arrives.
  useEffect(() => {
    if (note.data) setText(note.data.note ?? '')
  }, [note.data])

  const hasNote = note.data != null

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-2 text-xs text-brand-600 hover:underline"
      >
        📝 Заметка{hasNote ? ' (есть)' : ''}
      </button>
    )
  }

  return (
    <div className="mt-2 rounded border border-brand-100 bg-brand-50/40 p-3">
      <textarea
        className="w-full rounded border border-brand-200 p-2 text-sm"
        rows={3}
        placeholder="Личная заметка к этому уроку…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {note.data?.attachment && (
        <a
          href={`${API_URL}${note.data.attachment}`}
          className="mt-1 block text-xs text-brand-600 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Вложение
        </a>
      )}
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => save.mutate({ courseId, targetType, targetId, note: text })}
          disabled={save.isPending || text.trim() === ''}
          className="rounded bg-brand-600 px-3 py-1 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {save.isPending ? 'Сохранение…' : 'Сохранить'}
        </button>
        {note.data && (
          <button
            onClick={() => {
              const id = note.data?.id
              if (id != null) del.mutate(id, { onSuccess: () => setText('') })
            }}
            disabled={del.isPending}
            className="rounded border border-brand-200 px-3 py-1 text-xs text-ink/70 hover:bg-white disabled:opacity-50"
          >
            Удалить
          </button>
        )}
        <button onClick={() => setOpen(false)} className="ml-auto text-xs text-ink/50 hover:underline">
          Свернуть
        </button>
      </div>
      {(save.isError || del.isError) && (
        <p className="mt-1 text-xs text-red-600">
          {save.error?.message ?? del.error?.message}
        </p>
      )}
    </div>
  )
}
