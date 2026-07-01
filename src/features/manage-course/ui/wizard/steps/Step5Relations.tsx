import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Archive, Link2, Trash2 } from 'lucide-react'

import { coursesQueryOptions } from '#/entities/course'
import {
  prerequisitesQueryOptions,
  relatedQueryOptions,
} from '#/features/manage-course/api/relations'
import { useRelationMutations } from '#/features/manage-course/model/use-relations'
import { Button, EmptyState, Select, Switch } from '#/shared/ui'

export function Step5Relations({ courseId }: { courseId: number }) {
  const courses = useQuery(coursesQueryOptions())
  const prereqs = useQuery(prerequisitesQueryOptions(courseId))
  const related = useQuery(relatedQueryOptions(courseId))
  const m = useRelationMutations(courseId)

  const options = (courses.data ?? []).filter((c) => c.id !== courseId)

  const [preId, setPreId] = useState('')
  const [preRequired, setPreRequired] = useState(false)
  const [relId, setRelId] = useState('')

  return (
    <div className="space-y-8">
      {/* Prerequisites */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <SectionHead
            icon={<Archive className="size-5" strokeWidth={1.8} />}
            title="Предварительные требования"
            hint="Добавьте предварительные требования, чтобы улучшить обучение."
          />
          <Select label="Выберите требование" value={preId} onChange={(e) => setPreId(e.target.value)}>
            <option value="">Поиск требований</option>
            {options.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </Select>
          <Switch checked={preRequired} onChange={setPreRequired} label="Обязательно" />
          <Button
            disabled={!preId || m.addPre.isPending}
            onClick={() =>
              m.addPre.mutate(
                { id: Number(preId), required: preRequired },
                { onSuccess: () => setPreId('') },
              )
            }
          >
            Сохранить
          </Button>
        </div>

        <div>
          {prereqs.data && prereqs.data.length > 0 ? (
            <ul className="space-y-2">
              {prereqs.data.map((p) => (
                <RelationRow
                  key={p.id}
                  title={p.title}
                  badge={p.required ? 'Обязательно' : 'Рекомендуется'}
                  onDelete={() => m.removePre.mutate(p.id)}
                />
              ))}
            </ul>
          ) : (
            <EmptyState icon="🎯">
              <p className="font-semibold text-ink">Предварительные требования не определены!</p>
              <p className="mt-1 text-sm">Укажите обязательные или рекомендуемые требования.</p>
            </EmptyState>
          )}
        </div>
      </section>

      {/* Related courses */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <SectionHead
            icon={<Link2 className="size-5" strokeWidth={1.8} />}
            title="Связанные курсы"
            hint="Показывать похожие курсы на странице курса."
          />
          <Select label="Выберите связанные курсы" value={relId} onChange={(e) => setRelId(e.target.value)}>
            <option value="">Поиск курсов</option>
            {options.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </Select>
          <Button
            disabled={!relId || m.addRel.isPending}
            onClick={() => m.addRel.mutate(Number(relId), { onSuccess: () => setRelId('') })}
          >
            Сохранить
          </Button>
        </div>

        <div>
          {related.data && related.data.length > 0 ? (
            <ul className="space-y-2">
              {related.data.map((r) => (
                <RelationRow key={r.id} title={r.title} onDelete={() => m.removeRel.mutate(r.id)} />
              ))}
            </ul>
          ) : (
            <EmptyState icon="🔗">
              <p className="font-semibold text-ink">Связанные курсы не выбраны!</p>
              <p className="mt-1 text-sm">Назначьте похожие курсы, чтобы помочь студентам в выборе.</p>
            </EmptyState>
          )}
        </div>
      </section>
    </div>
  )
}

function SectionHead({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode
  title: string
  hint: string
}) {
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

function RelationRow({
  title,
  badge,
  onDelete,
}: {
  title: string
  badge?: string
  onDelete: () => void
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-brand-100 bg-white px-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-sm text-ink">{title}</span>
        {badge && (
          <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] text-brand-600">
            {badge}
          </span>
        )}
      </div>
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
