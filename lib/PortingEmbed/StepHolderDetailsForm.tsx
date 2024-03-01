import { required, toTrimmed, useForm } from '@modular-forms/preact'
import { useSignalEffect } from '@preact/signals'

import { Porting } from '../types'
import { EmbedField } from './EmbedField'
import { EmbedFieldError } from './EmbedFieldError'
import { EmbedFieldInput } from './EmbedFieldInput'
import { EmbedFieldLabel } from './EmbedFieldLabel'
import { defaultFormId, useEmbedOptions } from './Options'
import { sanitizeSubmitData } from './sanitizeSubmitData'

export type StepHolderDetailsFormData = {
  firstName?: string
  lastName?: string
  birthday?: string
}

type Props = {
  porting: Porting
  onValidationChange?: (event: { isValid: boolean }) => unknown
  onSubmit: (data: Partial<StepHolderDetailsFormData>) => unknown
}

export function StepHolderDetailsForm({
  porting,
  onValidationChange,
  onSubmit,
}: Props) {
  const options = useEmbedOptions()
  const [portingForm, { Form, Field }] = useForm<StepHolderDetailsFormData>({
    initialValues: {
      firstName: porting.firstName ?? '',
      lastName: porting.lastName ?? '',
      birthday: porting.birthday ?? '',
    },
    validateOn: 'blur',
  })

  useSignalEffect(() => {
    const isValid = !portingForm.invalid.value
    onValidationChange?.({ isValid })
  })

  return (
    <Form
      id={options.formId || defaultFormId}
      role="form"
      shouldDirty // only include changed fields in the onSubmit handler
      onSubmit={(data) => {
        const sanitizedData = sanitizeSubmitData(data)
        return onSubmit(sanitizedData)
      }}
    >
      {porting.required.includes('firstName') && (
        <Field
          name="firstName"
          validate={[required('Your first name is required')]}
          transform={toTrimmed({ on: 'input' })}
        >
          {(field, props) => (
            <EmbedField of={field}>
              <EmbedFieldLabel of={field}>First Name</EmbedFieldLabel>
              <EmbedFieldInput
                {...props}
                of={field}
                type="text"
                value={field.value}
                required
              />
              <EmbedFieldError of={field} />
            </EmbedField>
          )}
        </Field>
      )}
      {porting.required.includes('lastName') && (
        <Field
          name="lastName"
          validate={[required('Your last name is required')]}
          transform={toTrimmed({ on: 'input' })}
        >
          {(field, props) => (
            <EmbedField of={field}>
              <EmbedFieldLabel of={field}>Last Name</EmbedFieldLabel>
              <EmbedFieldInput
                {...props}
                of={field}
                type="text"
                value={field.value}
                required
              />
              <EmbedFieldError of={field} />
            </EmbedField>
          )}
        </Field>
      )}
      {porting.required.includes('birthday') && (
        <Field
          name="birthday"
          validate={[required('Your birthday is required')]}
          transform={toTrimmed({ on: 'input' })}
        >
          {(field, props) => (
            <EmbedField of={field}>
              <EmbedFieldLabel of={field}>Birthday</EmbedFieldLabel>
              <EmbedFieldInput
                {...props}
                of={field}
                value={field.value}
                required
                type="date"
              />
              <EmbedFieldError of={field} />
            </EmbedField>
          )}
        </Field>
      )}
    </Form>
  )
}
