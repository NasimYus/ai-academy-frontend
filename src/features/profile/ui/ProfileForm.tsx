import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useSessionStore } from '#/entities/session'
import { profileQueryOptions, updateProfile } from '#/features/profile/api/profile'

const inputCls =
  'rounded-lg border border-brand-200 px-3 py-2 font-normal outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
const labelCls = 'flex flex-col gap-1.5 text-sm font-medium text-ink'

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
      <label className={labelCls}>
        Имя и фамилия
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
      </label>
      <label className={labelCls}>
        О себе (кратко)
        <input value={bio} onChange={(e) => setBio(e.target.value)} maxLength={48} className={inputCls} />
      </label>
      <label className={labelCls}>
        Подробнее
        <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={3} className={inputCls} />
      </label>
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

      <button
        type="submit"
        disabled={save.isPending}
        className="mt-2 self-start rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
      >
        {save.isPending ? 'Сохраняем…' : 'Сохранить'}
      </button>
    </form>
  )
}
