import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useSessionStore } from '#/entities/session'
import { profileQueryOptions, updateProfile } from '#/features/profile/api/profile'
import { Button, Field, Textarea } from '#/shared/ui'

export function ProfileForm() {
  const qc = useQueryClient()
  const setUser = useSessionStore((s) => s.setUser)
  const profile = useQuery(profileQueryOptions)

  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [about, setAbout] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [publicMessage, setPublicMessage] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!profile.data) return
    setFullName(profile.data.full_name ?? '')
    setBio(profile.data.bio ?? '')
    setAbout(profile.data.about ?? '')
    setNewsletter(profile.data.newsletter)
    setPublicMessage(profile.data.public_message)
  }, [profile.data])

  const save = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      setUser(updated)
      void qc.invalidateQueries({ queryKey: ['profile'] })
      setSaved(true)
    },
  })

  if (profile.isPending) return <p className="text-ink/60">Загрузка…</p>
  if (profile.isError) return <p className="text-red-600">{profile.error.message}</p>

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(false)
    save.mutate({
      full_name: fullName,
      bio: bio || null,
      about: about || null,
      newsletter,
      public_message: publicMessage,
    })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field
        label="Имя и фамилия"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <Field
        label="О себе (кратко)"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        maxLength={48}
      />
      <Textarea
        label="Подробнее"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        rows={3}
      />
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
        Подписка на рассылку
      </label>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={publicMessage} onChange={(e) => setPublicMessage(e.target.checked)} />
        Разрешить личные сообщения
      </label>

      {save.isError && <p className="text-sm text-red-600">{save.error.message}</p>}
      {saved && <p className="text-sm text-green-600">Сохранено</p>}

      <Button type="submit" disabled={save.isPending} className="mt-2 self-start">
        {save.isPending ? 'Сохраняем…' : 'Сохранить'}
      </Button>
    </form>
  )
}
