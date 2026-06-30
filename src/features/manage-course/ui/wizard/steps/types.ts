import type { WizardForm } from '#/features/manage-course/ui/wizard/config'

export interface StepProps {
  f: WizardForm
  set: <TKey extends keyof WizardForm>(key: TKey, value: WizardForm[TKey]) => void
}
