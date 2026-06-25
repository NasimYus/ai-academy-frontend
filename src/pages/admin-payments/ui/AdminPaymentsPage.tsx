import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ink">Платёжные шлюзы</h1>
          <Link to="/admin/courses" className="text-sm text-brand-600 hover:underline">
            Модерация курсов →
          </Link>
        </div>
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
