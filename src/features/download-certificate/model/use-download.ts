import { useMutation } from '@tanstack/react-query'

import { downloadCertificate } from '#/features/download-certificate/api/download'

// Download a certificate and open the PDF in a new tab.
export function useDownloadCertificate() {
  return useMutation({
    mutationFn: (quizResultId: number) => downloadCertificate(quizResultId),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      setTimeout(() => URL.revokeObjectURL(url), 10_000)
    },
  })
}
