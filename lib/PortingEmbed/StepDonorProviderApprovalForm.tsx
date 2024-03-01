import { required, useForm } from '@modular-forms/preact'
import { useSignalEffect } from '@preact/signals'

import { Porting } from '../types'
import { EmbedField } from './EmbedField'
import { EmbedFieldError } from './EmbedFieldError'
import { EmbedFieldInput } from './EmbedFieldInput'
import { EmbedFieldLabel } from './EmbedFieldLabel'
import { defaultFormId, useEmbedOptions } from './Options'
import { sanitizeSubmitData } from './sanitizeSubmitData'

export type StepDonorProviderApprovalFormData = {
  donorProviderApproval?: boolean
}

type Props = {
  porting: Porting
  onValidationChange?: (event: { isValid: boolean }) => unknown
  onSubmit: (data: Partial<StepDonorProviderApprovalFormData>) => unknown
}

export function StepDonorProviderApprovalForm({
  porting,
  onValidationChange,
  onSubmit,
}: Props) {
  const options = useEmbedOptions()
  const [portingForm, { Form, Field }] =
    useForm<StepDonorProviderApprovalFormData>({
      initialValues: {
        donorProviderApproval: porting.donorProviderApproval ?? false,
      },
      validateOn: 'change',
    })

  useSignalEffect(() => {
    const isValid = !portingForm.invalid.value
    onValidationChange?.({ isValid })
  })

  return (
    <Form
      id={options.formId || defaultFormId}
      role="form"
      shouldActive={false}
      onSubmit={async (data) => {
        const sanitizedData = sanitizeSubmitData(data)
        return onSubmit(sanitizedData)
      }}
    >
      <Field
        name="donorProviderApproval"
        type="boolean"
        validate={[
          required('You must get the approval of your current provider'),
        ]}
      >
        {(field, props) => (
          <EmbedField of={field}>
            <EmbedFieldInput
              {...props}
              of={field}
              type="checkbox"
              checked={field.value}
            />
            <EmbedFieldLabel of={field}>
              I have notified my current provider of the number porting and got
              the approval that the number can be ported
            </EmbedFieldLabel>
            <EmbedFieldError of={field} />
          </EmbedField>
        )}
      </Field>
    </Form>
  )
}
