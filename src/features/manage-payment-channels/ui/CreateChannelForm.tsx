import { useState } from 'react'

import { useCreateChannel } from '#/features/manage-payment-channels/model/use-channels'

/** Register a new gateway by title + driver class_name. */
export function CreateChannelForm() {
  const create = useCreateChannel()
  const [title, setTitle] = useState('')
  const [className, setClassName] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!title.trim() || !className.trim()) return
        create.mutate(
          {
            title: title.trim(),
            class_name: className.trim(),
            status: 'inactive',
            test_mode: false,
          },
          {
            onSuccess: () => {
              setTitle('')
              setClassName('')
            },
          },
        )
      }}
      className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-brand-200 p-4"
    >
      <label className="text-sm text-ink/70">
        Название
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-40 rounded-lg border border-brand-200 px-3 py-1.5 text-sm"
        />
      </label>
      <label className="text-sm text-ink/70">
        Драйвер (class_name)
        <input
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Zarinpal / Sandbox"
          className="mt-1 block w-44 rounded-lg border border-brand-200 px-3 py-1.5 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={create.isPending}
        className="rounded-lg border border-brand-300 px-4 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50 disabled:opacity-50"
      >
        Добавить шлюз
      </button>
      {create.isError && <p className="w-full text-sm text-red-600">{create.error.message}</p>}
    </form>
  )
}
