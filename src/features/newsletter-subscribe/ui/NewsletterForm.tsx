import { useState } from 'react'
import { Mail } from 'lucide-react'

import { useSubscribeNewsletter } from '#/features/newsletter-subscribe/model/use-subscribe'

export function NewsletterForm() {
  const subscribe = useSubscribeNewsletter()
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) subscribe.mutate(email, { onSuccess: () => setEmail('') })
  }

  return (
    <div className="w-full sm:w-96">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-xl border border-brand-100 bg-white p-1.5 pl-3"
      >
        <Mail className="size-4 shrink-0 text-ink/40" strokeWidth={1.8} />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Введите ваш e-mail"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
        />
        <button
          type="submit"
          disabled={subscribe.isPending || !email.trim()}
          className="shrink-0 rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {subscribe.isPending ? '…' : 'Join'}
        </button>
      </form>
      {subscribe.isSuccess && <p className="mt-2 text-sm text-green-700">Вы подписаны!</p>}
      {subscribe.isError && <p className="mt-2 text-sm text-red-600">{subscribe.error.message}</p>}
    </div>
  )
}
