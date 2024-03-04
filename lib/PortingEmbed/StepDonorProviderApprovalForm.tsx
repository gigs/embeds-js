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
  const [form, { Form, Field }] = useForm<StepDonorProviderApprovalFormData>({
    initialValues: {
      donorProviderApproval: porting.donorProviderApproval ?? false,
    },
    validateOn: 'change',
  })

  useSignalEffect(() => {
    const isValid = !form.invalid.value
    onValidationChange?.({ isValid })
  })

  const customClassName =
    options.className?.form?.({
      name: 'donorProviderApproval',
      dirty: form.dirty.value,
      valid: !form.invalid.value,
      submitting: form.submitting.value,
      touched: form.touched.value,
    }) || ''

  return (
    <Form
      id={options.formId || defaultFormId}
      role="form"
      className={`GigsEmbeds GigsPortingEmbed GigsEmbeds-form ${customClassName}`}
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
            <div className="GigsEmbeds GigsPortingEmbed GigsEmbeds-checkbox">
              <EmbedFieldInput
                {...props}
                of={field}
                type="checkbox"
                checked={field.value}
              />
              <EmbedFieldLabel of={field}>
                I have notified my current provider of the number porting and
                got the approval that the number can be ported
              </EmbedFieldLabel>
            </div>
            <EmbedFieldError of={field} />
          </EmbedField>
        )}
      </Field>
    </Form>
  )
}
