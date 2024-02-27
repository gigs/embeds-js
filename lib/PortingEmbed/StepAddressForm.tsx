import { useForm } from '@modular-forms/preact'
import { useSignalEffect } from '@preact/signals'

import { Porting } from '../types'

export type StepAddressFormData = {
  city: string
  country: string
  line1: string
  line2: string | null
  postalCode: string
  state: string | null
}

type Props = {
  porting: Porting
  onValidationChange?: (event: { isValid: boolean }) => unknown
  onSubmit: (data: StepAddressFormData) => unknown
}

export function StepAddressForm({
  porting,
  onValidationChange,
  onSubmit,
}: Props) {
  const [portingForm, { Form, Field }] = useForm<StepAddressFormData>({
    initialValues: {
      city: porting.address?.city ?? '',
      country: porting.address?.country ?? '',
      line1: porting.address?.line1 ?? '',
      line2: porting.address?.line2 ?? '',
      postalCode: porting.address?.postalCode ?? '',
      state: porting.address?.state ?? '',
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
      onSubmit={(data) => {
        // The address form is always submitted as a whole, never partially.
        // line2 and state are optional and must be converted to null if empty.
        const sanitizedData = {
          ...data,
          line2: data.line2 || null,
          state: data.state || null,
        }

        return onSubmit(sanitizedData)
      }}
    >
      {porting.id}
    </Form>
  )
}
