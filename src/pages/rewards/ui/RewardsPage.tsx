import { useQuery } from '@tanstack/react-query'

import { rewardCoursesQueryOptions, rewardsOverviewQueryOptions } from '#/entities/reward'
import type { RewardCourse } from '#/entities/reward'
import { useRedeemCourse } from '#/features/redeem-points'

function RewardCourseRow({ course }: { course: RewardCourse }) {
  const redeem = useRedeemCourse()
  return (
    <div className="flex items-center justify-between rounded-lg border border-brand-100 bg-white p-4">
      <div>
        <p className="font-medium text-ink">{course.title}</p>
        <p className="text-xs text-ink/50">{course.points} баллов</p>
      </div>
      <button
        type="button"
        onClick={() => redeem.mutate(course.id)}
        disabled={redeem.isPending}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {redeem.isPending ? '…' : redeem.isSuccess ? 'Получено' : 'Купить за баллы'}
      </button>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-brand-100 bg-white p-4 text-center">
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="text-xs text-ink/50">{label}</p>
    </div>
  )
}

export function RewardsPage() {
  const overview = useQuery(rewardsOverviewQueryOptions)
  const courses = useQuery(rewardCoursesQueryOptions)

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Баллы и награды</h1>

      {overview.isError ? (
        <p className="mb-8 text-ink/60">{overview.error.message}</p>
      ) : (
        overview.data && (
          <>
            <div className="mb-6 grid grid-cols-3 gap-3">
              <Stat label="Доступно" value={overview.data.available_points} />
              <Stat label="Всего" value={overview.data.total_points} />
              <Stat label="Потрачено" value={overview.data.spent_points} />
            </div>

            {overview.data.rewards.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-2 font-display text-lg font-bold text-ink">История</h2>
                <div className="space-y-1">
                  {overview.data.rewards.map((r) => (
                    <div
                      key={r.id}
                      className="flex justify-between rounded-md border border-brand-100 bg-white px-3 py-2 text-sm"
                    >
                      <span className="text-ink/80">{r.type}</span>
                      <span className={r.status === 'deduction' ? 'text-red-600' : 'text-green-700'}>
                        {r.status === 'deduction' ? '−' : '+'}
                        {r.score}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )
      )}

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-ink">Курсы за баллы</h2>
        {courses.data && courses.data.length > 0 ? (
          <div className="space-y-2">
            {courses.data.map((c) => (
              <RewardCourseRow key={c.id} course={c} />
            ))}
          </div>
        ) : (
          <p className="text-ink/60">Пока нет курсов, доступных за баллы.</p>
        )}
      </section>
    </div>
  )
}
