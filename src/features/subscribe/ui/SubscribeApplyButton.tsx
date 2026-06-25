import { useApplySubscription } from '#/features/subscribe/model/use-subscribe'

export function SubscribeApplyButton({ courseId }: { courseId: number }) {
  const apply = useApplySubscription()

  if (apply.isSuccess) {
    return <p className="mt-3 text-center text-sm text-green-700">Открыто по подписке!</p>
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => apply.mutate(courseId)}
        disabled={apply.isPending}
        className="w-full rounded-full border border-brand-300 px-4 py-2 font-semibold text-brand-700 transition hover:bg-brand-50 disabled:opacity-50"
      >
        {apply.isPending ? 'Открываем…' : 'Открыть по подписке'}
      </button>
      {apply.isError && <p className="mt-1 text-center text-sm text-red-600">{apply.error.message}</p>}
    </div>
  )
}
