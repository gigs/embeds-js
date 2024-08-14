import { required, setError, toTrimmed, useForm } from '@modular-forms/preact'
import { useSignalEffect } from '@preact/signals'

import { Porting } from '../types'
import { EmbedField } from './EmbedField'
import { EmbedFieldError } from './EmbedFieldError'
import { EmbedFieldInput } from './EmbedFieldInput'
import { EmbedFieldLabel } from './EmbedFieldLabel'
import { defaultFormId, useEmbedOptions } from './Options'
import { sanitizeSubmitData } from './sanitizeSubmitData'

const normalizeAccountPin = (
  accountPin: string | undefined,
  donorProviderName: string | undefined,
) => {
  // If accountPin is `undefined`, keep it that way
  if (!accountPin) {
    return accountPin
  }

  // If the donor provider is Verizon, we want to strip eventual dashes.
  // Verizon displays their account PINs to users with dashes when they retreive it,
  // but expects the PIN without dashes.
  // In order to prevent failed portings, we remove them here.
  if (donorProviderName === 'Verizon') {
    return accountPin.replaceAll('-', '').trim()
  }

  // In all other cases, trim the accountPin
  return accountPin.trim()
}

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
  const options = useEmbedOptions()
  const [form, { Form, Field }] = useForm<StepCarrierDetailsFormData>({
    initialValues: {
      accountNumber: porting.accountNumber ?? '',
    },
    validateOn: 'blur',
  })

  const customClassName =
    options.className?.form?.({
      name: 'carrierDetails',
      dirty: form.dirty.value,
      valid: !form.invalid.value,
      submitting: form.submitting.value,
      touched: form.touched.value,
    }) || ''

  useSignalEffect(() => {
    const isValid = !form.invalid.value
    onValidationChange?.({ isValid })
  })

  return (
    <Form
      id={options.formId || defaultFormId}
      role="form"
      className={`GigsEmbeds GigsPortingEmbed GigsEmbeds-form ${customClassName}`}
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
            options.text['field.accountPin.error.cleared'],
          )
          return
        }

        // Normalize the accountPin
        data.accountPin = normalizeAccountPin(
          data.accountPin,
          porting.donorProvider?.name,
        )

        const sanitizedData = sanitizeSubmitData(data)
        return onSubmit(sanitizedData)
      }}
    >
      {porting.required.includes('accountNumber') && (
        <Field
          name="accountNumber"
          validate={[
            required(options.text['field.accountNumber.error.required']),
          ]}
          transform={toTrimmed({ on: 'input' })}
        >
          {(field, props) => (
            <EmbedField of={field}>
              <EmbedFieldLabel of={field}>
                {options.text['field.accountNumber.label']}
              </EmbedFieldLabel>
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
              : [required(options.text['field.accountPin.error.required'])]
          }
        >
          {(field, props) => (
            <EmbedField of={field}>
              <EmbedFieldLabel of={field}>
                {options.text['field.accountPin.label']}
              </EmbedFieldLabel>
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
