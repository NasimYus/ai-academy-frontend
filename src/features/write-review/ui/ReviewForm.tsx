import { useState } from 'react'

import { useSubmitReview } from '#/features/write-review/model/use-review'

const DIMENSIONS = [
  { key: 'content_quality', label: 'Качество материала' },
  { key: 'instructor_skills', label: 'Навыки преподавателя' },
  { key: 'purchase_worth', label: 'Ценность покупки' },
  { key: 'support_quality', label: 'Поддержка' },
] as const

type DimKey = (typeof DIMENSIONS)[number]['key']

export function ReviewForm({ courseId, slug }: { courseId: number; slug: string }) {
  const submit = useSubmitReview(courseId, slug)
  const [rating, setRating] = useState<Record<DimKey, number>>({
    content_quality: 5,
    instructor_skills: 5,
    purchase_worth: 5,
    support_quality: 5,
  })
  const [description, setDescription] = useState('')

  if (submit.isSuccess) {
    return (
      <p className="mt-3 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
        Спасибо! Отзыв отправлен на модерацию.
      </p>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit.mutate({ ...rating, description: description.trim() || undefined })
      }}
      className="mt-3 space-y-3 rounded-xl border border-brand-100 bg-white p-4"
    >
      <p className="font-medium text-ink">Оставить отзыв</p>
      {DIMENSIONS.map((d) => (
        <label key={d.key} className="flex items-center justify-between gap-3 text-sm">
          <span className="text-ink/70">{d.label}</span>
          <span className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating((r) => ({ ...r, [d.key]: n }))}
                className={n <= rating[d.key] ? 'text-amber-500' : 'text-ink/20'}
                aria-label={`${d.label}: ${n}`}
              >
                ★
              </button>
            ))}
          </span>
        </label>
      ))}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Поделитесь впечатлениями (необязательно)"
        rows={3}
        className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={submit.isPending}
        className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {submit.isPending ? '…' : 'Отправить отзыв'}
      </button>
      {submit.isError && <p className="text-sm text-red-600">{submit.error.message}</p>}
    </form>
  )
}
