import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { useSessionStore } from '#/entities/session'
import { subscriptionsQueryOptions } from '#/entities/subscription'
import type { SubscribePlan } from '#/entities/subscription'
import { useActivatePlan, usePayPlan } from '#/features/subscribe'

function PlanCard({ plan, authed }: { plan: SubscribePlan; authed: boolean }) {
  const navigate = useNavigate()
  const activate = useActivatePlan()
  const pay = usePayPlan()
  const isFree = plan.price <= 0
  return (
    <div className="rounded-lg border border-brand-100 bg-white p-4">
      <p className="font-medium text-ink">{plan.title}</p>
      <p className="mt-1 text-xs text-ink/50">
        {plan.usable_count} курс(ов) · {plan.days} дн. · {isFree ? 'Бесплатно' : `${plan.price}`}
      </p>
      {authed &&
        (isFree ? (
          <button
            type="button"
            onClick={() => activate.mutate(plan.id)}
            disabled={activate.isPending || activate.isSuccess}
            className="mt-3 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {activate.isSuccess ? 'Активирован' : activate.isPending ? '…' : 'Активировать'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              pay.mutate(plan.id, { onSuccess: () => void navigate({ to: '/orders' }) })
            }
            disabled={pay.isPending}
            className="mt-3 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {pay.isPending ? '…' : `Купить за ${plan.price}`}
          </button>
        ))}
      {activate.isError && <p className="mt-2 text-sm text-red-600">{activate.error.message}</p>}
      {pay.isError && <p className="mt-2 text-sm text-red-600">{pay.error.message}</p>}
    </div>
  )
}

export function SubscriptionsPage() {
  const token = useSessionStore((s) => s.token)
  const data = useQuery(subscriptionsQueryOptions)

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Подписки</h1>

      {data.data?.subscribed && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
          <p className="font-bold">Активная подписка: {data.data.subscribed.title}</p>
          <p className="mt-1 text-sm">
            Осталось {data.data.subscribed.remaining} из {data.data.subscribed.usable_count} ·{' '}
            {data.data.subscribed.days_left} дн.
          </p>
        </div>
      )}

      {data.isPending && <p className="text-ink/60">Загрузка…</p>}
      {data.data && data.data.subscribes.length === 0 && (
        <p className="text-ink/60">Пока нет доступных подписок.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.data?.subscribes.map((p) => (
          <PlanCard key={p.id} plan={p} authed={token != null} />
        ))}
      </div>
    </div>
  )
}
