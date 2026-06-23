import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { courseContentQueryOptions } from '#/entities/course'
import type { components } from '#/shared/api'

type ContentItem = components['schemas']['ContentItem']

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const TYPE_LABEL: Record<string, string> = {
  file: 'Файл',
  text_lesson: 'Текст',
  session: 'Сессия',
}

function Item({ item }: { item: ContentItem }) {
  return (
    <div className="rounded-lg border border-brand-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="font-medium text-ink">
          {item.locked && <span className="mr-1">🔒</span>}
          {item.title}
        </span>
        <span className="text-xs text-ink/50">{TYPE_LABEL[item.type] ?? item.type}</span>
      </div>

      {item.locked ? (
        <p className="mt-1 text-sm text-ink/50">Доступно после записи на курс</p>
      ) : (
        <div className="mt-2 text-sm text-ink/80">
          {item.type === 'text_lesson' && item.content && (
            <p className="whitespace-pre-line">{item.content}</p>
          )}
          {item.type === 'file' && item.file && (
            <a
              href={`${API_URL}${item.file}`}
              className="text-brand-600 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Скачать {item.file_type ? `(${item.file_type})` : ''}
            </a>
          )}
          {item.type === 'session' && item.link && (
            <a href={item.link} className="text-brand-600 hover:underline" target="_blank" rel="noreferrer">
              Присоединиться к сессии
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export function LearnPage({ slug }: { slug: string }) {
  const content = useQuery(courseContentQueryOptions(slug))

  if (content.isPending) return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (content.isError)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{content.error.message}</p>

  const data = content.data
  const empty = data.chapters.length === 0 && data.items.length === 0

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Содержание курса</h1>
        <Link to="/course/$slug" params={{ slug }} className="text-sm text-brand-600 hover:underline">
          ← К курсу
        </Link>
      </div>

      {empty && <p className="text-ink/60">Содержимое ещё не добавлено.</p>}

      {data.items.length > 0 && (
        <div className="mb-6 space-y-2">
          {data.items.map((item) => (
            <Item key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      )}

      {data.chapters.map((chapter) => (
        <section key={chapter.id} className="mb-6">
          <h2 className="mb-2 font-display text-lg font-bold text-ink">{chapter.title}</h2>
          <div className="space-y-2">
            {chapter.items.map((item) => (
              <Item key={`${item.type}-${item.id}`} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
