import { createFileRoute } from '@tanstack/react-router'

import { CertificateValidationPage } from '#/pages/certificate-validation'

export const Route = createFileRoute('/certificate-validation')({
  component: CertificateValidationPage,
})
