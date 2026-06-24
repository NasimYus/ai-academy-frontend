import { useSessionStore } from '#/entities/session'
import { useFollow } from '#/features/follow-user/model/use-follow'

export function FollowButton({
  userId,
  isFollowing,
  followersCount,
}: {
  userId: number
  isFollowing: boolean
  followersCount: number
}) {
  const token = useSessionStore((s) => s.token)
  const currentUserId = useSessionStore((s) => s.user?.id)
  const follow = useFollow(userId)

  // Hide for guests and on one's own profile.
  if (!token || currentUserId === userId) {
    return <span className="text-sm text-ink/50">Подписчиков: {followersCount}</span>
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => follow.mutate(!isFollowing)}
        disabled={follow.isPending}
        className={
          isFollowing
            ? 'rounded-full border border-brand-200 px-4 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50 disabled:opacity-50'
            : 'rounded-full bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50'
        }
      >
        {isFollowing ? 'Вы подписаны' : 'Подписаться'}
      </button>
      <span className="text-sm text-ink/50">Подписчиков: {followersCount}</span>
    </div>
  )
}
