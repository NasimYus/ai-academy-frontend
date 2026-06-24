import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// The auth user's passed quizzes + their certificate (legacy achievements).
export const achievementsQueryOptions = queryOptions({
  queryKey: ['certificate-achievements'],
  queryFn: async () => {
    const { data } = await api.GET('/api/v1/panel/certificates/achievements', {})
    return data ?? []
  },
})

// Public certificate validation by id (legacy checkValidate).
export async function validateCertificate(certificateId: number) {
  const { data } = await api.GET('/api/v1/certificate_validation', {
    params: { query: { certificate_id: certificateId } },
  })
  return data ?? { is_valid: false, certificate: null }
}
