import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type InstructorCertificatesList = components['schemas']['InstructorCertificatesList']
export type IssuedCertificate = components['schemas']['IssuedCertificate']

export const instructorCertificatesQueryOptions = queryOptions({
  queryKey: ['instructor-certificates-list'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/certificates/list', {})
    if (error) throw new Error('Не удалось загрузить сертификаты')
    return data
  },
})

export const certificateStudentsQueryOptions = queryOptions({
  queryKey: ['instructor-certificate-students'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/certificates/students', {})
    if (error) throw new Error('Не удалось загрузить студентов')
    return data
  },
})
