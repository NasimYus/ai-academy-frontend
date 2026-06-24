import { useState } from 'react'

import { useSubscribeNewsletter } from '#/features/newsletter-subscribe/model/use-subscribe'

export function NewsletterForm() {
  const subscribe = useSubscribeNewsletter()
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) subscribe.mutate(email, { onSuccess: () => setEmail('') })
  }

  return (
    <div className="max-w-sm">
      <p className="mb-2 font-medium text-ink">Подпишитесь на рассылку</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-md border border-brand-200 p-2 text-sm focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={subscribe.isPending || !email.trim()}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {subscribe.isPending ? '…' : 'Подписаться'}
        </button>
      </form>
      {subscribe.isSuccess && <p className="mt-2 text-sm text-green-700">Вы подписаны!</p>}
      {subscribe.isError && <p className="mt-2 text-sm text-red-600">{subscribe.error.message}</p>}
    </div>
  )
}
