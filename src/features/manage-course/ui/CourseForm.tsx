import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { categoriesQueryOptions } from '#/entities/category'
import type { CourseCreateBody } from '#/features/manage-course/api/manage'
import { useCreateCourse, useUpdateCourse } from '#/features/manage-course/model/use-manage'
import type { components } from '#/shared/api'

type CourseDetail = components['schemas']['CourseDetail']

interface FormState {
  type: 'course' | 'webinar' | 'text_lesson'
  title: string
  category_id: string
  description: string
  thumbnail: string
  image_cover: string
  duration: string
  price: string
  points: string
  start_date: string
  private: boolean
  support: boolean
  downloadable: boolean
  subscribe: boolean
  rules: boolean
  draft: boolean
}

function initialState(course?: CourseDetail): FormState {
  return {
    type: course ? course.type : 'course',
    title: course?.title ?? '',
    category_id: course?.category_id ? String(course.category_id) : '',
    description: course?.description ?? '',
    thumbnail: course?.image ?? '',
    image_cover: course?.image_cover ?? '',
    duration: course?.duration ? String(course.duration) : '',
    price: course?.price != null ? String(course.price) : '0',
    points: course?.points != null ? String(course.points) : '',
    start_date: '',
    private: course?.is_private ?? false,
    support: course?.support ?? false,
    downloadable: course?.downloadable ?? false,
    subscribe: course?.subscribe ?? false,
    rules: false,
    draft: false,
  }
}

const FIELD = 'w-full rounded-md border border-brand-200 p-2 text-sm focus:ring-brand-500'

export function CourseForm({ course }: { course?: CourseDetail }) {
  const navigate = useNavigate()
  const categories = useQuery(categoriesQueryOptions)
  const create = useCreateCourse()
  const update = useUpdateCourse(course?.id ?? 0)
  const [f, setF] = useState<FormState>(() => initialState(course))
  const isEdit = course != null
  const mutation = isEdit ? update : create

  const set = <TKey extends keyof FormState>(key: TKey, value: FormState[TKey]) =>
    setF((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body: CourseCreateBody = {
      type: f.type,
      title: f.title,
      thumbnail: f.thumbnail,
      image_cover: f.image_cover,
      description: f.description,
      category_id: Number(f.category_id),
      duration: f.duration ? Number(f.duration) : null,
      price: f.price ? Number(f.price) : 0,
      points: f.points ? Number(f.points) : null,
      start_date: f.type === 'webinar' && f.start_date ? new Date(f.start_date).toISOString() : null,
      private: f.private,
      support: f.support,
      downloadable: f.downloadable,
      partner_instructor: false,
      subscribe: f.subscribe,
      rules: f.rules,
      draft: f.draft,
    }
    mutation.mutate(body, { onSuccess: () => void navigate({ to: '/instructor' }) })
  }

  const options = (categories.data ?? []).flatMap((c) => [
    { id: c.id, title: c.title },
    ...c.sub_categories.map((s) => ({ id: s.id, title: `— ${s.title}` })),
  ])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          Тип
          <select
            value={f.type}
            onChange={(e) => set('type', e.target.value as FormState['type'])}
            className={FIELD}
          >
            <option value="course">Курс</option>
            <option value="webinar">Вебинар</option>
            <option value="text_lesson">Текстовый урок</option>
          </select>
        </label>
        <label className="text-sm">
          Категория
          <select
            required
            value={f.category_id}
            onChange={(e) => set('category_id', e.target.value)}
            className={FIELD}
          >
            <option value="">—</option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm">
        Название
        <input required value={f.title} onChange={(e) => set('title', e.target.value)} className={FIELD} />
      </label>

      <label className="block text-sm">
        Описание
        <textarea
          required
          rows={4}
          value={f.description}
          onChange={(e) => set('description', e.target.value)}
          className={FIELD}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          Обложка (thumbnail URL)
          <input required value={f.thumbnail} onChange={(e) => set('thumbnail', e.target.value)} className={FIELD} />
        </label>
        <label className="text-sm">
          Картинка (cover URL)
          <input required value={f.image_cover} onChange={(e) => set('image_cover', e.target.value)} className={FIELD} />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <label className="text-sm">
          Длительность (мин)
          <input type="number" value={f.duration} onChange={(e) => set('duration', e.target.value)} className={FIELD} />
        </label>
        <label className="text-sm">
          Цена
          <input type="number" value={f.price} onChange={(e) => set('price', e.target.value)} className={FIELD} />
        </label>
        <label className="text-sm">
          Баллы
          <input type="number" value={f.points} onChange={(e) => set('points', e.target.value)} className={FIELD} />
        </label>
      </div>

      {f.type === 'webinar' && (
        <label className="block text-sm">
          Дата старта
          <input
            type="datetime-local"
            value={f.start_date}
            onChange={(e) => set('start_date', e.target.value)}
            className={FIELD}
          />
        </label>
      )}

      <div className="flex flex-wrap gap-4 text-sm">
        {(['private', 'support', 'downloadable', 'subscribe'] as const).map((flag) => (
          <label key={flag} className="flex items-center gap-2">
            <input type="checkbox" checked={f[flag]} onChange={(e) => set(flag, e.target.checked)} />
            {flag}
          </label>
        ))}
      </div>

      {!isEdit && (
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={f.rules} onChange={(e) => set('rules', e.target.checked)} />
            Принимаю правила
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={f.draft} onChange={(e) => set('draft', e.target.checked)} />
            Сохранить как черновик
          </label>
        </div>
      )}

      {mutation.isError && <p className="text-sm text-red-600">{mutation.error.message}</p>}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {mutation.isPending ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Создать курс'}
      </button>
    </form>
  )
}
