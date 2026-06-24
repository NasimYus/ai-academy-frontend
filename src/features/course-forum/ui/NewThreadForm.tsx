import { useState } from 'react'

import { useCreateThread } from '#/features/course-forum/model/use-forum'

export function NewThreadForm({ courseId }: { courseId: number }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const create = useCreateThread(courseId)

  const submit = () => {
    create.mutate(
      { title, description },
      {
        onSuccess: () => {
          setTitle('')
          setDescription('')
        },
      },
    )
  }

  return (
    <div className="rounded-lg border border-brand-100 bg-white p-4">
      <h2 className="mb-2 font-display font-bold text-ink">Задать вопрос</h2>
      <input
        className="mb-2 w-full rounded border border-brand-200 p-2 text-sm"
        placeholder="Заголовок"
        maxLength={255}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full rounded border border-brand-200 p-2 text-sm"
        rows={3}
        placeholder="Опишите вопрос…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        onClick={submit}
        disabled={create.isPending || title.trim() === '' || description.trim() === ''}
        className="mt-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {create.isPending ? 'Отправка…' : 'Опубликовать'}
      </button>
      {create.isError && <p className="mt-1 text-sm text-red-600">{create.error.message}</p>}
    </div>
  )
}
