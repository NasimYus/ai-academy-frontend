import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { validateCertificate } from '#/entities/certificate'
import type { CertificateValidation } from '#/entities/certificate'

export function CertificateValidationPage() {
  const [id, setId] = useState('')
  const check = useMutation<CertificateValidation, Error, number>({
    mutationFn: (certificateId: number) => validateCertificate(certificateId),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const certificateId = Number(id)
    if (certificateId > 0) check.mutate(certificateId)
  }

  const result = check.data

  return (
    <div className="mx-auto max-w-xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Проверка сертификата</h1>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          inputMode="numeric"
          placeholder="ID сертификата"
          className="flex-1 rounded-md border border-brand-200 p-2 text-sm focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={check.isPending || !id}
          className="rounded-lg bg-brand-600 px-5 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          Проверить
        </button>
      </form>

      {result && (
        <div className="mt-6">
          {result.is_valid && result.certificate ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
              <p className="font-bold">Сертификат действителен</p>
              <p className="mt-1 text-sm">Студент: {result.certificate.student_name ?? '—'}</p>
              <p className="text-sm">Тест: {result.certificate.quiz_title ?? '—'}</p>
              <p className="text-sm">Курс: {result.certificate.course_title ?? '—'}</p>
              <p className="text-sm">
                Дата: {new Date(result.certificate.date).toLocaleDateString('ru')}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              Сертификат не найден
            </div>
          )}
        </div>
      )}
    </div>
  )
}
