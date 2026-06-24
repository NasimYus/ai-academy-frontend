import { useMutation } from '@tanstack/react-query'

import { subscribeNewsletter } from '#/features/newsletter-subscribe/api/subscribe'

export function useSubscribeNewsletter() {
  return useMutation({ mutationFn: (email: string) => subscribeNewsletter(email) })
}
