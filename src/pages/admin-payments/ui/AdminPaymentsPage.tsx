import { useQuery } from '@tanstack/react-query'

import {
  adminChannelsQueryOptions,
  ChannelEditor,
  CreateChannelForm,
} from '#/features/manage-payment-channels'

export function AdminPaymentsPage() {
  const { data, isPending, isError, error } = useQuery(adminChannelsQueryOptions)

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <header>
        <h1 className="text-2xl font-bold text-ink">Платёжные шлюзы</h1>
        <p className="mt-1 text-sm text-ink/60">
          Настройка драйверов, реквизитов (credentials) и статуса. Реальные шлюзы требуют ключей
          мерчанта.
        </p>
      </header>

      <CreateChannelForm />

      {isPending ? (
        <p className="text-ink/60">Загрузка…</p>
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : data.length === 0 ? (
        <p className="text-ink/60">Шлюзы ещё не добавлены.</p>
      ) : (
        <div className="space-y-4">
          {data.map((channel) => (
            <ChannelEditor key={channel.id} channel={channel} />
          ))}
        </div>
      )}
    </div>
  )
}
