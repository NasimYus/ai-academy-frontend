import { useRef, useState } from 'react'

import { useSubmitMessage } from '#/features/submit-assignment/model/use-submit'

export function SubmitAssignmentForm({ assignmentId }: { assignmentId: number }) {
  const submit = useSubmitMessage(assignmentId)
  const [message, setMessage] = useState('')
  const [fileTitle, setFileTitle] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    const attachment = fileRef.current?.files?.[0] ?? null
    submit.mutate(
      { message, fileTitle: fileTitle || undefined, attachment },
      {
        onSuccess: () => {
          setMessage('')
          setFileTitle('')
          if (fileRef.current) fileRef.current.value = ''
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-brand-100 bg-white p-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        required
        placeholder="Сообщение к работе"
        className="w-full rounded-md border border-brand-200 p-2 text-sm focus:ring-brand-500"
      />
      <input
        value={fileTitle}
        onChange={(e) => setFileTitle(e.target.value)}
        placeholder="Название файла (необязательно)"
        className="w-full rounded-md border border-brand-200 p-2 text-sm focus:ring-brand-500"
      />
      <input ref={fileRef} type="file" className="block text-sm text-ink/70" />

      {submit.isError && <p className="text-sm text-red-600">{submit.error.message}</p>}

      <button
        type="submit"
        disabled={submit.isPending || !message.trim()}
        className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {submit.isPending ? 'Отправка…' : 'Отправить работу'}
      </button>
    </form>
  )
}
