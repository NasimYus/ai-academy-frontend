import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GraduationCap, HelpCircle, ListChecks, Trash2 } from 'lucide-react'

import {
  extrasQueryOptions,
  faqsQueryOptions,
  logosQueryOptions,
} from '#/features/manage-course/api/extras'
import type { ExtraType } from '#/features/manage-course/api/extras'
import { useExtraMutations } from '#/features/manage-course/model/use-extras'
import { useUploadCourseMedia } from '#/features/manage-course/model/use-manage'
import { Button, EmptyState, Field, FileUpload, Select, Textarea } from '#/shared/ui'

const LOCALES = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
  { value: 'tg', label: 'Тоҷикӣ' },
]

function Head({ icon, title, hint }: { icon: React.ReactNode; title: string; hint: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
        {icon}
      </span>
      <div>
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="text-xs text-ink/55">{hint}</p>
      </div>
    </div>
  )
}

function Row({ title, onDelete }: { title: string; onDelete: () => void }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-brand-100 bg-white px-3 py-2">
      <span className="truncate text-sm text-ink">{title}</span>
      <button
        type="button"
        aria-label="Удалить"
        onClick={onDelete}
        className="flex size-7 shrink-0 items-center justify-center rounded-lg text-ink/50 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  )
}

export function Step6Faq({ courseId }: { courseId: number }) {
  const faqs = useQuery(faqsQueryOptions(courseId))
  const extras = useQuery(extrasQueryOptions(courseId))
  const logos = useQuery(logosQueryOptions(courseId))
  const m = useExtraMutations(courseId)
  const upload = useUploadCourseMedia()

  const [locale, setLocale] = useState('ru')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [learning, setLearning] = useState('')
  const [requirement, setRequirement] = useState('')

  const learningItems = (extras.data ?? []).filter((e) => e.type === 'learning')
  const requirementItems = (extras.data ?? []).filter((e) => e.type === 'requirement')

  const addExtra = (type: ExtraType, title: string, reset: () => void) => {
    if (!title.trim()) return
    m.addExtraM.mutate({ type, title: title.trim(), locale }, { onSuccess: reset })
  }

  return (
    <div className="space-y-10">
      {/* FAQ */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <Head
            icon={<HelpCircle className="size-5" strokeWidth={1.8} />}
            title="Часто задаваемые вопросы"
            hint="Добавьте FAQ и отобразите их на странице курса."
          />
          <Select label="Язык" value={locale} onChange={(e) => setLocale(e.target.value)}>
            {LOCALES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </Select>
          <Field label="Вопрос" value={question} onChange={(e) => setQuestion(e.target.value)} />
          <Textarea label="Ответ" rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} />
          <Button
            disabled={!question.trim() || m.addFaqM.isPending}
            onClick={() =>
              m.addFaqM.mutate(
                { question: question.trim(), answer, locale },
                {
                  onSuccess: () => {
                    setQuestion('')
                    setAnswer('')
                  },
                },
              )
            }
          >
            Сохранить
          </Button>
        </div>
        <div>
          {faqs.data && faqs.data.length > 0 ? (
            <ul className="space-y-2">
              {faqs.data.map((f) => (
                <Row key={f.id} title={f.question} onDelete={() => m.removeFaq.mutate(f.id)} />
              ))}
            </ul>
          ) : (
            <EmptyState icon="❓">
              <p className="font-semibold text-ink">Нет доступных вопросов!</p>
              <p className="mt-1 text-sm">FAQ помогает лучше понять ваш курс.</p>
            </EmptyState>
          )}
        </div>
      </section>

      {/* Learning materials */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <Head
            icon={<GraduationCap className="size-5" strokeWidth={1.8} />}
            title="Учебные материалы"
            hint="Покажите студентам, чему они научатся."
          />
          <Field label="Название" value={learning} onChange={(e) => setLearning(e.target.value)} />
          <Button
            disabled={!learning.trim() || m.addExtraM.isPending}
            onClick={() => addExtra('learning', learning, () => setLearning(''))}
          >
            Сохранить
          </Button>
        </div>
        <div>
          {learningItems.length > 0 ? (
            <ul className="space-y-2">
              {learningItems.map((e) => (
                <Row key={e.id} title={e.title} onDelete={() => m.removeExtra.mutate(e.id)} />
              ))}
            </ul>
          ) : (
            <EmptyState icon="🎓">
              <p className="font-semibold text-ink">Учебных материалов нет!</p>
            </EmptyState>
          )}
        </div>
      </section>

      {/* Requirements */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <Head
            icon={<ListChecks className="size-5" strokeWidth={1.8} />}
            title="Требования"
            hint="Помогите студентам подготовиться перед регистрацией."
          />
          <Field label="Название" value={requirement} onChange={(e) => setRequirement(e.target.value)} />
          <Button
            disabled={!requirement.trim() || m.addExtraM.isPending}
            onClick={() => addExtra('requirement', requirement, () => setRequirement(''))}
          >
            Сохранить
          </Button>
        </div>
        <div>
          {requirementItems.length > 0 ? (
            <ul className="space-y-2">
              {requirementItems.map((e) => (
                <Row key={e.id} title={e.title} onDelete={() => m.removeExtra.mutate(e.id)} />
              ))}
            </ul>
          ) : (
            <EmptyState icon="✅">
              <p className="font-semibold text-ink">Требований нет!</p>
            </EmptyState>
          )}
        </div>
      </section>

      {/* Company logos */}
      <section className="space-y-3">
        <Head
          icon={<GraduationCap className="size-5" strokeWidth={1.8} />}
          title="Логотипы компаний"
          hint="Отображать логотипы компаний на странице курса."
        />
        <div className="flex flex-wrap items-center gap-3">
          {(logos.data ?? []).map((logo) => (
            <div key={logo.id} className="relative">
              <img
                src={logo.image}
                alt="logo"
                className="size-24 rounded-xl border border-brand-100 object-contain p-2"
              />
              <button
                type="button"
                aria-label="Удалить"
                onClick={() => m.removeLogo.mutate(logo.id)}
                className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-white text-ink shadow hover:text-red-600"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          <div className="w-32">
            <FileUpload
              label="Выберите логотип"
              uploading={upload.isPending}
              onSelect={(file) =>
                upload.mutate(
                  { file, kind: 'icon' },
                  { onSuccess: (path) => m.addLogoM.mutate(path) },
                )
              }
            />
          </div>
        </div>
      </section>
    </div>
  )
}
