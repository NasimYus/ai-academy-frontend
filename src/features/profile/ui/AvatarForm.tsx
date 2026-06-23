import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useSessionStore } from '#/entities/session'
import { profileQueryOptions, uploadAvatar } from '#/features/profile/api/profile'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function AvatarForm() {
  const qc = useQueryClient()
  const user = useSessionStore((s) => s.user)
  const setUser = useSessionStore((s) => s.setUser)
  const profile = useQuery(profileQueryOptions)

  const upload = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (avatar) => {
      if (user) setUser({ ...user, avatar })
      void qc.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const avatar = profile.data?.avatar
  const avatarUrl = avatar ? `${API_URL}${avatar}` : null

  return (
    <div className="flex items-center gap-4">
      <div className="flex size-16 items-center justify-center overflow-hidden rounded-full border border-brand-100 bg-brand-50 text-ink/40">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="size-full object-cover" />
        ) : (
          <span className="text-xs">нет фото</span>
        )}
      </div>
      <label className="cursor-pointer rounded-lg border border-brand-200 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50">
        {upload.isPending ? 'Загрузка…' : 'Изменить фото'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) upload.mutate(file)
          }}
        />
      </label>
      {upload.isError && <p className="text-sm text-red-600">{upload.error.message}</p>}
    </div>
  )
}
