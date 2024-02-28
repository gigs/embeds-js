import {
  pattern,
  required,
  toTrimmed,
  toUpperCase,
  useForm,
} from '@modular-forms/preact'
import { useSignalEffect } from '@preact/signals'

import { Porting } from '../types'
import { EmbedField } from './EmbedField'
import { EmbedFieldError } from './EmbedFieldError'
import { EmbedFieldInput } from './EmbedFieldInput'
import { EmbedFieldLabel } from './EmbedFieldLabel'

export type StepAddressFormData = {
  line1: string
  line2: string | null
  city: string
  postalCode: string
  state: string | null
  country: string
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
      line1: porting.address?.line1 ?? '',
      line2: porting.address?.line2 ?? null,
      city: porting.address?.city ?? '',
      postalCode: porting.address?.postalCode ?? '',
      state: porting.address?.state,
      country: porting.address?.country ?? '',
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
      <Field
        name="line1"
        validate={[required('Line 1 is required')]}
        transform={toTrimmed({ on: 'input' })}
      >
        {(field, props) => (
          <EmbedField>
            <EmbedFieldLabel for="__ge_addressLine1">Line 1</EmbedFieldLabel>
            <EmbedFieldInput
              {...props}
              id="__ge_addressLine1"
              type="text"
              value={field.value}
              required
            />
            <EmbedFieldError error={field.error.value} />
          </EmbedField>
        )}
      </Field>
      <Field name="line2" transform={toTrimmed({ on: 'input' })}>
        {(field, props) => (
          <EmbedField>
            <EmbedFieldLabel for="__ge_addressLine2">Line 2</EmbedFieldLabel>
            <EmbedFieldInput
              {...props}
              id="__ge_addressLine2"
              type="text"
              value={field.value.value || ''}
            />
            <EmbedFieldError error={field.error.value} />
          </EmbedField>
        )}
      </Field>
      <Field
        name="city"
        validate={[required('City is required')]}
        transform={toTrimmed({ on: 'input' })}
      >
        {(field, props) => (
          <EmbedField>
            <EmbedFieldLabel for="__ge_addressCity">City</EmbedFieldLabel>
            <EmbedFieldInput
              {...props}
              id="__ge_addressCity"
              type="text"
              value={field.value}
              required
            />
            <EmbedFieldError error={field.error.value} />
          </EmbedField>
        )}
      </Field>
      <Field
        name="postalCode"
        validate={[required('Postal Code is required')]}
        transform={toTrimmed({ on: 'input' })}
      >
        {(field, props) => (
          <EmbedField>
            <EmbedFieldLabel for="__ge_addressPostalCode">
              Postal Code
            </EmbedFieldLabel>
            <EmbedFieldInput
              {...props}
              id="__ge_addressPostalCode"
              type="text"
              value={field.value}
              required
            />
            <EmbedFieldError error={field.error.value} />
          </EmbedField>
        )}
      </Field>
      <Field
        name="state"
        validate={pattern(
          /^[A-Z]{1,3}(-[A-Z0-9]{1,3})?$/,
          'Must be an ISO state code',
        )}
        transform={[toTrimmed({ on: 'input' }), toUpperCase({ on: 'input' })]}
      >
        {(field, props) => (
          <EmbedField>
            <EmbedFieldLabel for="__ge_addressState">
              State (ISO code)
            </EmbedFieldLabel>
            <EmbedFieldInput
              {...props}
              id="__ge_addressState"
              type="text"
              value={field.value.value || ''}
              required
            />
            <EmbedFieldError error={field.error.value} />
          </EmbedField>
        )}
      </Field>
      <Field
        name="country"
        validate={[
          required('Country is required'),
          pattern(/^[A-Z]{2}$/, 'Must be an iso country code'),
        ]}
        transform={[toTrimmed({ on: 'input' }), toUpperCase({ on: 'input' })]}
      >
        {(field, props) => (
          <EmbedField>
            <EmbedFieldLabel for="__ge_addressCountry">
              Country (2 letter code)
            </EmbedFieldLabel>
            <EmbedFieldInput
              {...props}
              id="__ge_addressCountry"
              type="text"
              value={field.value.value || ''}
              required
            />
            <EmbedFieldError error={field.error.value} />
          </EmbedField>
        )}
      </Field>
    </Form>
  )
}
