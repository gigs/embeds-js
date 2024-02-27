import { useForm } from '@modular-forms/preact'
import { useSignalEffect } from '@preact/signals'

import { Porting } from '../types'
import { sanitizeSubmitData } from './sanitizeSubmitData'

export type StepDonorApprovalFormData = {
  donorProviderApproval?: boolean
}

type Props = {
  porting: Porting
  onValidationChange?: (event: { isValid: boolean }) => unknown
  onSubmit: (data: Partial<StepDonorApprovalFormData>) => unknown
}

export function StepDonorApprovalForm({
  porting,
  onValidationChange,
  onSubmit,
}: Props) {
  const [portingForm, { Form, Field }] = useForm<StepDonorApprovalFormData>({
    initialValues: {
      donorProviderApproval: porting.donorProviderApproval ?? false,
    },
    validateOn: 'blur',
  })

  useSignalEffect(() => {
    const isValid = !portingForm.invalid.value
    onValidationChange?.({ isValid })
  })

  return (
    <Form
      id="gigsPortingEmbedForm" // TODO: make customizable
      role="form"
      shouldDirty // only include changed fields in the onSubmit handler
      onSubmit={(data) => {
        const sanitizedData = sanitizeSubmitData(data)
        return onSubmit(sanitizedData)
      }}
    >
      {porting.id}
    </Form>
  )
}
