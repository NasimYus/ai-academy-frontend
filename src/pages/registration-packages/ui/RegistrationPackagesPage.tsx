import { useQuery } from '@tanstack/react-query'

import { registrationPackagesQueryOptions } from '#/entities/registration-package'
import type { RegistrationPackage } from '#/entities/registration-package'
import { useActivatePackage } from '#/features/activate-package'

const cap = (v: number | null | undefined) => (v == null ? 'безлимит' : String(v))

function PackageCard({ plan }: { plan: RegistrationPackage }) {
  const activate = useActivatePackage()
  const isFree = plan.price <= 0
  return (
    <div
      className={`rounded-lg border p-4 ${
        plan.is_active ? 'border-green-300 bg-green-50' : 'border-brand-100 bg-white'
      }`}
    >
      <p className="font-medium text-ink">{plan.title}</p>
      <p className="mt-1 text-xs text-ink/50">
        {cap(plan.days)} дн. · {isFree ? 'Бесплатно' : `${plan.price}`}
      </p>
      <ul className="mt-2 space-y-0.5 text-xs text-ink/60">
        <li>Курсы: {cap(plan.courses_count)}</li>
        <li>Преподаватели: {cap(plan.instructors_count)}</li>
        <li>Консультации: {cap(plan.meeting_count)}</li>
      </ul>

      {plan.is_active ? (
        <p className="mt-3 text-sm font-medium text-green-700">Активен</p>
      ) : (
        isFree && (
          <button
            type="button"
            onClick={() => activate.mutate(plan.id)}
            disabled={activate.isPending}
            className="mt-3 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {activate.isPending ? '…' : 'Активировать'}
          </button>
        )
      )}
      {activate.isError && <p className="mt-2 text-sm text-red-600">{activate.error.message}</p>}
    </div>
  )
}

export function RegistrationPackagesPage() {
  const data = useQuery(registrationPackagesQueryOptions)

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Пакеты преподавателя</h1>

      {data.data?.active_package && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
          <p className="font-bold">Активный пакет: {data.data.active_package.title}</p>
          <p className="mt-1 text-sm">
            Осталось дней: {cap(data.data.active_package.days_remained)}
          </p>
        </div>
      )}

      {data.isPending && <p className="text-ink/60">Загрузка…</p>}
      {data.data && data.data.packages.length === 0 && (
        <p className="text-ink/60">Пакеты пока недоступны.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.data?.packages.map((p) => (
          <PackageCard key={p.id} plan={p} />
        ))}
      </div>
    </div>
  )
}
