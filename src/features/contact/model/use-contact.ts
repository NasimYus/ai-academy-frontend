import { useMutation } from '@tanstack/react-query'

import { submitContact } from '#/features/contact/api/contact'
import type { ContactInput } from '#/features/contact/api/contact'

export function useSubmitContact() {
  return useMutation({ mutationFn: (input: ContactInput) => submitContact(input) })
}
