import { useIsFavorite, useToggleFavorite } from '#/features/favorite-toggle/model/use-favorite'

export function FavoriteButton({ courseId }: { courseId: number }) {
  const isFavorite = useIsFavorite(courseId)
  const toggle = useToggleFavorite()

  return (
    <button
      type="button"
      onClick={() => toggle.mutate(courseId)}
      disabled={toggle.isPending}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50 disabled:opacity-50"
    >
      <span>{isFavorite ? '♥' : '♡'}</span>
      {isFavorite ? 'В избранном' : 'В избранное'}
    </button>
  )
}
