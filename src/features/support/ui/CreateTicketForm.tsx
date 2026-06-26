import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { supportDepartmentsQueryOptions } from '#/entities/support'
import type { SupportType } from '#/entities/support'
import { Button, Select } from '#/shared/ui'

import { useCreateTicket } from '#/features/support/model/use-support'

/** Form to open a new support ticket. `courseId` (when present) pre-targets a course. */
export function CreateTicketForm({
  courseId,
  onCreated,
}: {
  courseId?: number
  onCreated?: () => void
}) {
  const create = useCreateTicket()
  const departments = useQuery(supportDepartmentsQueryOptions)

  const [type, setType] = useState<SupportType>(
    courseId ? 'course_support' : 'platform_support',
  )
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [departmentId, setDepartmentId] = useState<number | ''>('')
  const [attach, setAttach] = useState<File | null>(null)

  const canSubmit =
    title.trim().length >= 2 &&
    message.trim().length >= 2 &&
    (type === 'course_support' ? !!courseId : departmentId !== '')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    create.mutate(
      {
        title,
        type,
        message,
        courseId: type === 'course_support' ? courseId : null,
        departmentId: type === 'platform_support' ? Number(departmentId) : null,
        attach,
      },
      {
        onSuccess: () => {
          setTitle('')
          setMessage('')
          setAttach(null)
          onCreated?.()
        },
      },
    )
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-3 rounded-xl border border-brand-100 bg-white p-4"
    >
      {!courseId && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('platform_support')}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              type === 'platform_support'
                ? 'bg-brand-600 text-white'
                : 'border border-brand-200 text-brand-700 hover:bg-brand-50'
            }`}
          >
            Платформа
          </button>
        </div>
      )}

      {type === 'platform_support' && !courseId && (
        <Select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : '')}
          className="w-full"
        >
          <option value="">Выберите отдел…</option>
          {(departments.data ?? []).map((d) => (
            <option key={d.id} value={d.id}>
              {d.title}
            </option>
          ))}
        </Select>
      )}

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Тема"
        className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Сообщение"
        rows={4}
        className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
      />
      <input
        type="file"
        onChange={(e) => setAttach(e.target.files?.[0] ?? null)}
        className="block w-full text-sm text-ink/60"
      />

      {create.isError && (
        <p className="text-sm text-red-600">{create.error.message}</p>
      )}

      <Button type="submit" size="sm" disabled={!canSubmit || create.isPending}>
        {create.isPending ? 'Отправка…' : 'Создать обращение'}
      </Button>
    </form>
  )
}
