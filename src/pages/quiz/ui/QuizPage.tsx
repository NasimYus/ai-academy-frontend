import { Link } from '@tanstack/react-router'

import { QuizRunner } from '#/features/take-quiz'

export function QuizPage({ quizId, slug }: { quizId: number; slug?: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6">
        {slug ? (
          <Link
            to="/learn/$slug"
            params={{ slug }}
            className="text-sm text-brand-600 hover:underline"
          >
            ← К обучению
          </Link>
        ) : (
          <Link to="/courses" className="text-sm text-brand-600 hover:underline">
            ← К курсам
          </Link>
        )}
      </div>
      <QuizRunner quizId={quizId} />
    </div>
  )
}
