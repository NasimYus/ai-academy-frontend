import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { achievementsQueryOptions } from '#/entities/certificate'
import type { Achievement } from '#/entities/certificate'
import { useDownloadCertificate } from '#/features/download-certificate'

function AchievementRow({ a }: { a: Achievement }) {
  const download = useDownloadCertificate()
  return (
    <div className="flex items-center justify-between rounded-lg border border-brand-100 bg-white p-4">
      <div>
        <p className="font-medium text-ink">{a.quiz_title}</p>
        <p className="text-xs text-ink/50">
          {a.course_title ?? '—'} · балл: {a.user_grade ?? '—'}
        </p>
      </div>
      {a.certificate ? (
        <button
          type="button"
          onClick={() => download.mutate(a.quiz_result_id)}
          disabled={download.isPending}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {download.isPending ? 'Открываем…' : 'Скачать сертификат'}
        </button>
      ) : (
        <span className="text-xs text-ink/40">Без сертификата</span>
      )}
    </div>
  )
}

export function CertificatesPage() {
  const achievements = useQuery(achievementsQueryOptions)

  if (achievements.isPending)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (achievements.isError)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{achievements.error.message}</p>

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Мои сертификаты</h1>
        <Link to="/certificate-validation" className="text-sm text-brand-600 hover:underline">
          Проверить сертификат
        </Link>
      </div>

      {achievements.data.length === 0 ? (
        <p className="text-ink/60">Пройдите тест с сертификатом, чтобы получить достижение.</p>
      ) : (
        <div className="space-y-2">
          {achievements.data.map((a) => (
            <AchievementRow key={a.quiz_result_id} a={a} />
          ))}
        </div>
      )}
    </div>
  )
}
