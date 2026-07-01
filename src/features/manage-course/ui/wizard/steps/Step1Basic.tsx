import { BookOpen, MonitorPlay, PlayCircle } from 'lucide-react'

import type { CourseMediaKind } from '#/features/manage-course/api/manage'
import type { CourseType, WizardForm } from '#/features/manage-course/ui/wizard/config'
import { useUploadCourseMedia } from '#/features/manage-course/model/use-manage'
import { Field, FileUpload, RichEditor, Select, Textarea } from '#/shared/ui'

import type { StepProps } from '#/features/manage-course/ui/wizard/steps/types'

const TYPES: { value: CourseType; title: string; hint: string; icon: typeof BookOpen }[] = [
  { value: 'webinar', title: 'Онлайн-обучение', hint: 'Онлайн-сессии на поддерживаемых платформах.', icon: MonitorPlay },
  { value: 'course', title: 'Видеообучение', hint: 'Видео или другие файлы в курсе.', icon: PlayCircle },
  { value: 'text_lesson', title: 'Текстовое обучение', hint: 'Текстовые уроки в курсе.', icon: BookOpen },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-bold text-ink">{children}</h2>
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

export function Step1Basic({ f, set }: StepProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <SectionTitle>
          Тип курса <span className="text-red-500">*</span>
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          {TYPES.map((t) => {
            const active = f.type === t.value
            const Icon = t.icon
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => set('type', t.value)}
                className={`flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition ${
                  active
                    ? 'border-brand-500 bg-brand-50/40 ring-1 ring-brand-500'
                    : 'border-brand-100 hover:border-brand-300'
                }`}
              >
                <span
                  className={`flex size-14 items-center justify-center rounded-2xl ${
                    active ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-300'
                  }`}
                >
                  <Icon className="size-6" strokeWidth={1.8} />
                </span>
                <span className={`font-semibold ${active ? 'text-brand-700' : 'text-ink'}`}>
                  {t.title}
                </span>
                <span className="text-xs text-ink/50">{t.hint}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>Основная информация</SectionTitle>
        <Select label="Язык" value={f.locale} onChange={(e) => set('locale', e.target.value)}>
          <option value="ru">Русский</option>
          <option value="en">English</option>
          <option value="tg">Тоҷикӣ</option>
        </Select>
        <Field
          label="Название *"
          value={f.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Введите название курса"
        />
        <Field
          label="SEO мета-описание"
          value={f.seo_description}
          onChange={(e) => set('seo_description', e.target.value)}
          placeholder="Рекомендуемая длина: 155–160 символов"
        />
      </section>

      <section className="space-y-3">
        <SectionTitle>
          Миниатюра и обложка <span className="text-red-500">*</span>
        </SectionTitle>
        <div className="grid max-w-md gap-4 sm:grid-cols-2">
          <MediaField label="Миниатюра" kind="thumbnail" value={f.thumbnail} onChange={(p) => set('thumbnail', p)} />
          <MediaField label="Обложка" kind="image_cover" value={f.image_cover} onChange={(p) => set('image_cover', p)} />
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Иконка курса (необязательно)</SectionTitle>
        <div className="max-w-[12rem]">
          <MediaField label="Иконка" kind="icon" value={f.icon} onChange={(p) => set('icon', p)} />
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Демо-видео (необязательно)</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Источник видео"
            value={f.video_demo_source}
            onChange={(e) => set('video_demo_source', e.target.value as WizardForm['video_demo_source'])}
          >
            <option value="">—</option>
            <option value="upload">Загрузка</option>
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
            <option value="external_link">Внешняя ссылка</option>
          </Select>
          {f.video_demo_source === 'upload' ? (
            <MediaField label="Загрузить видео" kind="demo_video" value={f.video_demo} onChange={(p) => set('video_demo', p)} />
          ) : (
            <Field
              label="Ссылка на видео"
              value={f.video_demo}
              onChange={(e) => set('video_demo', e.target.value)}
              placeholder="https://…"
            />
          )}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Краткое описание курса</SectionTitle>
        <Textarea
          label="Краткое описание"
          rows={3}
          value={f.summary}
          onChange={(e) => set('summary', e.target.value)}
          placeholder="Введите краткое описание курса"
        />
      </section>

      <section className="space-y-3">
        <SectionTitle>Описание курса</SectionTitle>
        <RichEditor
          label="Описание"
          value={f.description}
          onChange={(html) => set('description', html)}
          placeholder="Минимум 300 слов. Поддерживаются HTML и изображения."
          minHeight={220}
        />
      </section>
    </div>
  )
}
