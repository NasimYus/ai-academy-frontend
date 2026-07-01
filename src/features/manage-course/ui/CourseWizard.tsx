import { useCallback, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import {
  useCreateCourse,
  useDeleteCourse,
  useSubmitCourse,
  useUpdateCourse,
} from '#/features/manage-course/model/use-manage'
import type { CourseDetail, WizardForm } from '#/features/manage-course/ui/wizard/config'
import { STEPS, buildCreateBody, buildStepBody, initialForm } from '#/features/manage-course/ui/wizard/config'
import { BottomBar } from '#/features/manage-course/ui/wizard/BottomBar'
import { Stepper } from '#/features/manage-course/ui/wizard/Stepper'
import { Step1Basic } from '#/features/manage-course/ui/wizard/steps/Step1Basic'
import { Step2Extra } from '#/features/manage-course/ui/wizard/steps/Step2Extra'
import { Step3Pricing } from '#/features/manage-course/ui/wizard/steps/Step3Pricing'
import { Step4Content } from '#/features/manage-course/ui/wizard/steps/Step4Content'
import { Step5Relations } from '#/features/manage-course/ui/wizard/steps/Step5Relations'
import { Step6Faq } from '#/features/manage-course/ui/wizard/steps/Step6Faq'
import { Step8Reviewer } from '#/features/manage-course/ui/wizard/steps/Step8Reviewer'
import { StepSoon } from '#/features/manage-course/ui/wizard/steps/StepSoon'

export function CourseWizard({ course, step }: { course?: CourseDetail; step: number }) {
  const navigate = useNavigate()
  const create = useCreateCourse()
  const update = useUpdateCourse(course?.id ?? 0)
  const del = useDeleteCourse()
  const submit = useSubmitCourse()

  const [f, setF] = useState<WizardForm>(() => initialForm(course))
  const [localError, setLocalError] = useState('')

  const set = useCallback(
    <TKey extends keyof WizardForm>(key: TKey, value: WizardForm[TKey]) =>
      setF((prev) => ({ ...prev, [key]: value })),
    [],
  )

  const saving = create.isPending || update.isPending || del.isPending || submit.isPending
  const error =
    localError ||
    create.error?.message ||
    update.error?.message ||
    del.error?.message ||
    submit.error?.message

  const goToStep = (courseId: number, target: number) =>
    void navigate({
      to: '/instructor/course/$courseId/edit',
      params: { courseId: String(courseId) },
      search: { step: target },
    })

  // Persist the current step; returns the (possibly new) course id, or null on error.
  const persist = async (draft: boolean): Promise<number | null> => {
    setLocalError('')
    if (!course) {
      if (!f.title.trim()) {
        setLocalError('Укажите название курса')
        return null
      }
      try {
        const created = await create.mutateAsync(buildCreateBody(f, draft))
        return created.id
      } catch {
        return null
      }
    }
    try {
      await update.mutateAsync(buildStepBody(step, f))
      return course.id
    } catch {
      return null
    }
  }

  const onNext = async () => {
    const id = await persist(true)
    if (id) goToStep(id, Math.min(step + 1, STEPS.length))
  }

  const onPrev = () => {
    if (course && step > 1) goToStep(course.id, step - 1)
  }

  const onSaveDraft = async () => {
    const id = await persist(true)
    if (id) void navigate({ to: '/instructor' })
  }

  const onSubmit = async () => {
    // Save the current step first, then flip draft -> pending via the submit endpoint.
    const id = await persist(true)
    if (!id) return
    submit.mutate(
      { courseId: id, message: f.message_for_reviewer || null, rules: f.rules },
      { onSuccess: () => void navigate({ to: '/instructor' }) },
    )
  }

  const onDelete = () => {
    if (!course) return
    del.mutate(course.id, { onSuccess: () => void navigate({ to: '/instructor' }) })
  }

  return (
    <div className="space-y-6">
      <Stepper current={step} onJump={course ? (n) => goToStep(course.id, n) : undefined} />

      <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        {step === 1 && <Step1Basic f={f} set={set} />}
        {step === 2 && <Step2Extra f={f} set={set} />}
        {step === 3 && <Step3Pricing f={f} set={set} />}
        {step === 4 && course && <Step4Content courseId={course.id} />}
        {step === 5 && course && <Step5Relations courseId={course.id} />}
        {step === 6 && course && <Step6Faq courseId={course.id} />}
        {step === 7 && <StepSoon step={step} />}
        {step === 8 && <Step8Reviewer f={f} set={set} />}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <BottomBar
        step={step}
        total={STEPS.length}
        saving={saving}
        canDelete={course != null}
        onPrev={onPrev}
        onNext={() => void onNext()}
        onSaveDraft={() => void onSaveDraft()}
        onDelete={onDelete}
        onSubmit={() => void onSubmit()}
      />
    </div>
  )
}
