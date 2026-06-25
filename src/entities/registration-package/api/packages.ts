import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// Packages for the instructor's role + their active package (teacher-gated).
export const registrationPackagesQueryOptions = queryOptions({
  queryKey: ['registration-packages'],
  queryFn: async () => {
    const { data } = await api.GET('/api/v1/registration-packages', {})
    return data ?? { packages: [], active_package: null }
  },
})
