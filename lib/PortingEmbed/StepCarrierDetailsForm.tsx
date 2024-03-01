import { required, setError, toTrimmed, useForm } from '@modular-forms/preact'
import { useSignalEffect } from '@preact/signals'

import { Porting } from '../types'
import { EmbedField } from './EmbedField'
import { EmbedFieldError } from './EmbedFieldError'
import { EmbedFieldInput } from './EmbedFieldInput'
import { EmbedFieldLabel } from './EmbedFieldLabel'
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
  const [form, { Form, Field }] = useForm<StepCarrierDetailsFormData>({
    initialValues: {
      accountNumber: porting.accountNumber ?? '',
    },
    validateOn: 'blur',
  })

  useSignalEffect(() => {
    const isValid = !form.invalid.value
    onValidationChange?.({ isValid })
  })

  return (
    <Form
      id="gigsPortingEmbedForm" // TODO: make customizable
      role="form"
      shouldDirty // only include changed fields in the onSubmit handler
      onSubmit={(data) => {
        const existingAccountPinWasTouched =
          data.accountPin && porting.accountPinExists

        // Make sure that the user can choose to not override the account pin,
        // by clearing the input.
        if (existingAccountPinWasTouched && data.accountPin === '') {
          data.accountPin = undefined
        }

        // Notify the user that the account pin was modified but is empty
        if (
          existingAccountPinWasTouched &&
          data.accountPin !== '' &&
          data.accountPin?.trim() === ''
        ) {
          setError(
            form,
            'accountPin',
            'The new account pin is empty. If you do not want to change the account pin, clear the input.',
          )
          return
        }

        // Trim the account pin if there is one
        data.accountPin = data.accountPin?.trim()

        const sanitizedData = sanitizeSubmitData(data)
        return onSubmit(sanitizedData)
      }}
    >
      {porting.required.includes('accountNumber') && (
        <Field
          name="accountNumber"
          validate={[required('The account number is required')]}
          transform={toTrimmed({ on: 'input' })}
        >
          {(field, props) => (
            <EmbedField of={field}>
              <EmbedFieldLabel of={field}>Account Number</EmbedFieldLabel>
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
      {porting.required.includes('accountPin') && (
        <Field
          name="accountPin"
          validate={
            porting.accountPinExists
              ? []
              : [required('The account pin is required')]
          }
        >
          {(field, props) => (
            <EmbedField of={field}>
              <EmbedFieldLabel of={field}>Account PIN</EmbedFieldLabel>
              <EmbedFieldInput
                {...props}
                of={field}
                type="text"
                placeholder={porting.accountPinExists ? '••••' : undefined}
                value={field.value}
              />
              <EmbedFieldError of={field} />
            </EmbedField>
          )}
        </Field>
      )}
    </Form>
  )
}
