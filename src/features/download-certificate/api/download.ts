import { api } from '#/shared/api'

// Fetch the certificate PDF (auth'd; the server renders + caches it on first
// call). Returns a Blob so the caller can open/download it.
export async function downloadCertificate(quizResultId: number): Promise<Blob> {
  const { data, error } = await api.GET('/api/v1/panel/quizzes/results/{quiz_result_id}/show', {
    params: { path: { quiz_result_id: quizResultId } },
    parseAs: 'blob',
  })
  if (error) throw new Error('Не удалось получить сертификат')
  return data
}
