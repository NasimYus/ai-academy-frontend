import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'

import { forumCategoriesQueryOptions } from '#/entities/community-forum'
import { useCreateTopic } from '#/features/manage-forum'
import { Button, Field, PageHeader, Select, Textarea } from '#/shared/ui'

export function NewTopicPage() {
  const navigate = useNavigate()
  const categories = useQuery(forumCategoriesQueryOptions)
  const create = useCreateTopic()
  const [forumId, setForumId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!forumId || !title.trim() || !description.trim()) return
    create.mutate(
      { forum_id: Number(forumId), title: title.trim(), description: description.trim() },
      { onSuccess: (topic) => void navigate({ to: '/forum-topics/$slug', params: { slug: topic.slug } }) },
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center justify-between">
        <PageHeader title="Новая тема" subtitle="Задайте вопрос или начните обсуждение." />
        <Link to="/forums" className="text-sm text-brand-600 hover:underline">
          ← К форумам
        </Link>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-brand-100 p-5">
        <Select label="Форум" value={forumId} onChange={(e) => setForumId(e.target.value)}>
          <option value="">Выберите форум</option>
          {(categories.data ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </Select>
        <Field label="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea
          label="Сообщение"
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {create.isError && <p className="text-sm text-red-600">{create.error.message}</p>}
        <Button
          type="submit"
          disabled={create.isPending || !forumId || !title.trim() || !description.trim()}
        >
          {create.isPending ? 'Создание…' : 'Создать тему'}
        </Button>
      </form>
    </div>
  )
}
