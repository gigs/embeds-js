import { useForm } from '@modular-forms/preact'
import { useSignalEffect } from '@preact/signals'

import { Porting } from '../types'
import { sanitizeSubmitData } from './sanitizeSubmitData'

export type StepCarrierDetailsFormData = {
  accountNumber?: string
  accountPin?: string
}

type Props = {
  porting: Porting
  onValidationChange?: (event: { isValid: boolean }) => unknown
  onSubmit: (data: Partial<StepCarrierDetailsFormData>) => unknown
}

export function StepCarrierDetailsForm({
  porting,
  onValidationChange,
  onSubmit,
}: Props) {
  const [portingForm, { Form, Field }] = useForm<StepCarrierDetailsFormData>({
    initialValues: {
      accountNumber: porting.accountNumber ?? '',
      accountPin: '',
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
