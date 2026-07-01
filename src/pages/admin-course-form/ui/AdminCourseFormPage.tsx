import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { categoriesQueryOptions } from '#/entities/category'
import {
  courseTeachersQueryOptions,
  useCreateCourse,
  useUploadCourseMedia,
} from '#/features/manage-course'
import type { CourseMediaKind } from '#/features/manage-course'
import { Field, FileUpload, PageHeader, Select, Switch, Textarea } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

type VideoSource = '' | 'upload' | 'youtube' | 'vimeo' | 'external_link'
type CourseType = 'webinar' | 'course' | 'text_lesson'

interface Form {
  locale: string
  type: CourseType
  title: string
  points: string
  slug: string
  teacher_id: string
  seo_description: string
  thumbnail: string
  image_cover: string
  icon: string
  video_demo_source: VideoSource
  video_demo: string
  summary: string
  description: string
  capacity: string
  start_date: string
  duration: string
  timezone: string
  support: boolean
  certificate: boolean
  downloadable: boolean
  partner_instructor: boolean
  forum: boolean
  subscribe: boolean
  private: boolean
  only_for_students: boolean
  enable_waitlist: boolean
  access_days: string
  price: string
  category_id: string
  message_for_reviewer: string
}

const INITIAL: Form = {
  locale: 'ru',
  type: 'webinar',
  title: '',
  points: '',
  slug: '',
  teacher_id: '',
  seo_description: '',
  thumbnail: '',
  image_cover: '',
  icon: '',
  video_demo_source: '',
  video_demo: '',
  summary: '',
  description: '',
  capacity: '',
  start_date: '',
  duration: '',
  timezone: 'Asia/Dushanbe',
  support: false,
  certificate: false,
  downloadable: false,
  partner_instructor: false,
  forum: false,
  subscribe: false,
  private: false,
  only_for_students: false,
  enable_waitlist: false,
  access_days: '',
  price: '',
  category_id: '',
  message_for_reviewer: '',
}

const num = (v: string): number | null => (v.trim() === '' ? null : Number(v))

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-1.5 w-8 rounded-full bg-brand-600" />
      <h2 className="font-display text-lg font-bold text-ink">{children}</h2>
    </div>
  )
}

function MediaField({
  label,
  kind,
  value,
  onChange,
}: {
  label: string
  kind: CourseMediaKind
  value: string
  onChange: (path: string) => void
}) {
  const upload = useUploadCourseMedia()
  return (
    <FileUpload
      label={label}
      value={value || null}
      uploading={upload.isPending}
      onSelect={(file) => upload.mutate({ file, kind }, { onSuccess: onChange })}
      onClear={() => onChange('')}
    />
  )
}

const TOGGLES: { key: keyof Form; label: string }[] = [
  { key: 'support', label: 'Поддержка' },
  { key: 'certificate', label: 'Включить сертификат завершения' },
  { key: 'downloadable', label: 'Доступно для скачивания' },
  { key: 'partner_instructor', label: 'Совместный преподаватель' },
  { key: 'forum', label: 'Форум курса' },
  { key: 'subscribe', label: 'Подписаться' },
  { key: 'private', label: 'Приватное обучение' },
  { key: 'only_for_students', label: 'Только для студентов' },
  { key: 'enable_waitlist', label: 'Включить список ожидания' },
]

export function AdminCourseFormPage() {
  const navigate = useNavigate()
  const [f, setF] = useState<Form>(INITIAL)
  const set = <TKey extends keyof Form>(key: TKey, value: Form[TKey]) =>
    setF((p) => ({ ...p, [key]: value }))

  const { data: teachers } = useQuery(courseTeachersQueryOptions)
  const { data: categories } = useQuery(categoriesQueryOptions)
  const create = useCreateCourse()

  const submit = () => {
    if (!f.title.trim()) return
    create.mutate(
      {
        type: f.type,
        title: f.title,
        locale: f.locale,
        teacher_id: f.teacher_id ? Number(f.teacher_id) : null,
        points: num(f.points),
        seo_description: f.seo_description || null,
        thumbnail: f.thumbnail || null,
        image_cover: f.image_cover || null,
        icon: f.icon || null,
        video_demo: f.video_demo || null,
        video_demo_source: f.video_demo_source || null,
        summary: f.summary || null,
        description: f.description || null,
        capacity: num(f.capacity),
        start_date: f.type === 'webinar' && f.start_date ? new Date(f.start_date).toISOString() : null,
        duration: num(f.duration),
        timezone: f.timezone || null,
        support: f.support,
        certificate: f.certificate,
        downloadable: f.downloadable,
        partner_instructor: f.partner_instructor,
        forum: f.forum,
        subscribe: f.subscribe,
        private: f.private,
        only_for_students: f.only_for_students,
        enable_waitlist: f.enable_waitlist,
        access_days: num(f.access_days),
        price: num(f.price) ?? 0,
        category_id: num(f.category_id),
        message_for_reviewer: f.message_for_reviewer || null,
        rules: false,
        draft: true,
      },
      {
        onSuccess: (course) => {
          void navigate({
            to: '/instructor/course/$courseId/edit',
            params: { courseId: String(course.id) },
            search: { step: 4 },
          })
        },
      },
    )
  }

  const field =
    'w-full rounded-xl border border-brand-100 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-400'
  const label = 'mb-1 block text-xs font-medium text-ink/50'

  return (
    <PanelLayout>
      <PageHeader
        title="Новый курс"
        actions={
          <span className="text-sm text-ink/45">
            <Link to="/admin" className="text-brand-600 hover:underline">
              Панель управления
            </Link>{' '}
            /{' '}
            <Link to="/admin/courses-list" className="text-brand-600 hover:underline">
              Курсы
            </Link>{' '}
            / Новый
          </span>
        }
      />

      {/* Основная информация */}
      <div className="rounded-2xl bg-white p-6 lg:p-8">
        <SectionTitle>Основная информация</SectionTitle>
        <div className="max-w-2xl space-y-4">
          <Select label="Язык" value={f.locale} onChange={(e) => set('locale', e.target.value)}>
            <option value="ru">Русский</option>
            <option value="en">English</option>
            <option value="tg">Тоҷикӣ</option>
          </Select>
          <Select
            label="Тип курса"
            value={f.type}
            onChange={(e) => set('type', e.target.value as CourseType)}
          >
            <option value="webinar">Онлайн-обучение</option>
            <option value="course">Видеообучение</option>
            <option value="text_lesson">Текстовое обучение</option>
          </Select>
          <Field label="Название" value={f.title} onChange={(e) => set('title', e.target.value)} />
          <div>
            <Field
              label="Баллы"
              type="number"
              value={f.points}
              onChange={(e) => set('points', e.target.value)}
              placeholder="Пусто — режим отключён"
            />
          </div>
          <div>
            <Field
              label="URL курса"
              value={f.slug}
              onChange={(e) => set('slug', e.target.value)}
              placeholder="Создаётся автоматически"
            />
            <p className="mt-1 text-xs text-ink/40">
              URL должен быть уникальным и без пробелов. Создаётся автоматически по умолчанию.
            </p>
          </div>
          <Select
            label="Выбрать инструктора"
            value={f.teacher_id}
            onChange={(e) => set('teacher_id', e.target.value)}
          >
            <option value="">Выберите преподавателя</option>
            {(teachers ?? []).map((t) => (
              <option key={t.id} value={t.id}>
                {t.full_name ?? `#${t.id}`}
              </option>
            ))}
          </Select>
          <div>
            <Field
              label="SEO мета-описание"
              value={f.seo_description}
              onChange={(e) => set('seo_description', e.target.value)}
            />
            <p className="mt-1 text-xs text-ink/40">
              Отображается на странице результатов поиска. Рекомендуется 155–160 символов.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <MediaField
              label="Миниатюра"
              kind="thumbnail"
              value={f.thumbnail}
              onChange={(p) => set('thumbnail', p)}
            />
            <MediaField
              label="Обложка"
              kind="image_cover"
              value={f.image_cover}
              onChange={(p) => set('image_cover', p)}
            />
          </div>
          <MediaField
            label="Иконка курса (необязательно)"
            kind="icon"
            value={f.icon}
            onChange={(p) => set('icon', p)}
          />
          <div>
            <label className={label}>Демо-видео (необязательно) — источник</label>
            <select
              className={field}
              value={f.video_demo_source}
              onChange={(e) => set('video_demo_source', e.target.value as VideoSource)}
            >
              <option value="">—</option>
              <option value="upload">Загрузка</option>
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="external_link">Внешняя ссылка</option>
            </select>
          </div>
          {f.video_demo_source === 'upload' ? (
            <MediaField
              label="Путь"
              kind="demo_video"
              value={f.video_demo}
              onChange={(p) => set('video_demo', p)}
            />
          ) : f.video_demo_source ? (
            <Field
              label="Ссылка на видео"
              value={f.video_demo}
              onChange={(e) => set('video_demo', e.target.value)}
              placeholder="https://..."
            />
          ) : null}
          <Textarea
            label="Краткое описание"
            value={f.summary}
            onChange={(e) => set('summary', e.target.value)}
            placeholder="Краткое описание курса, желательно от 50 до 160 символов."
          />
          <Textarea
            label="Описание"
            rows={6}
            value={f.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Минимум 300 слов. Поддерживаются HTML и изображения."
          />
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-6 rounded-2xl bg-white p-6 lg:p-8">
        <SectionTitle>Дополнительная информация</SectionTitle>
        <div className="max-w-2xl space-y-4">
          <Field
            label="Вместимость"
            type="number"
            value={f.capacity}
            onChange={(e) => set('capacity', e.target.value)}
            placeholder="Пусто — без ограничений"
          />
          {f.type === 'webinar' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Дата начала"
                type="datetime-local"
                value={f.start_date}
                onChange={(e) => set('start_date', e.target.value)}
              />
              <Field
                label="Продолжительность (минуты)"
                type="number"
                value={f.duration}
                onChange={(e) => set('duration', e.target.value)}
              />
            </div>
          ) : (
            <Field
              label="Продолжительность (минуты)"
              type="number"
              value={f.duration}
              onChange={(e) => set('duration', e.target.value)}
            />
          )}
          <Field
            label="Часовой пояс"
            value={f.timezone}
            onChange={(e) => set('timezone', e.target.value)}
          />
          <div className="space-y-3 border-y border-brand-50 py-4">
            {TOGGLES.map((t) => (
              <Switch
                key={t.key}
                label={t.label}
                checked={f[t.key] as boolean}
                onChange={(v) => set(t.key, v as Form[typeof t.key])}
              />
            ))}
          </div>
          <div>
            <Field
              label="Период доступа (в днях)"
              type="number"
              value={f.access_days}
              onChange={(e) => set('access_days', e.target.value)}
            />
            <p className="mt-1 text-xs font-medium text-ink/60">
              После истечения срока доступа необходимо купить повторно.
            </p>
          </div>
          <Field
            label="Цена (C)"
            type="number"
            value={f.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="Введите 0, чтобы сделать бесплатным"
          />
          <Select
            label="Категория"
            value={f.category_id}
            onChange={(e) => set('category_id', e.target.value)}
          >
            <option value="">Выберите категорию</option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Сообщение рецензенту */}
      <div className="mt-6 rounded-2xl bg-white p-6 lg:p-8">
        <SectionTitle>Сообщение рецензенту</SectionTitle>
        <div className="max-w-2xl">
          <Textarea
            label=""
            rows={5}
            value={f.message_for_reviewer}
            onChange={(e) => set('message_for_reviewer', e.target.value)}
          />
        </div>
      </div>

      {create.isError ? (
        <p className="mt-4 text-sm text-red-600">{create.error.message}</p>
      ) : null}

      <div className="mt-6">
        <button
          type="button"
          onClick={submit}
          disabled={create.isPending || !f.title.trim()}
          className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
        >
          {create.isPending ? 'Сохранение…' : 'Сохранить и продолжить'}
        </button>
      </div>
    </PanelLayout>
  )
}
