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
import { defaultFormId, useEmbedOptions } from './Options'

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
  const options = useEmbedOptions()
  const [form, { Form, Field }] = useForm<StepAddressFormData>({
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

  const customClassName =
    options.className?.form?.({
      name: 'address',
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
        validate={[required(options.text['field.line1.error.required'])]}
        transform={toTrimmed({ on: 'input' })}
      >
        {(field, props) => (
          <EmbedField of={field}>
            <EmbedFieldLabel of={field}>
              {options.text['field.line1.label']}
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
      <Field name="line2" transform={toTrimmed({ on: 'input' })}>
        {(field, props) => (
          <EmbedField of={field}>
            <EmbedFieldLabel of={field}>
              {options.text['field.line2.label']}
            </EmbedFieldLabel>
            <EmbedFieldInput
              {...props}
              of={field}
              type="text"
              value={field.value.value || ''}
            />
            <EmbedFieldError of={field} />
          </EmbedField>
        )}
      </Field>
      <Field
        name="city"
        validate={[required(options.text['field.city.error.required'])]}
        transform={toTrimmed({ on: 'input' })}
      >
        {(field, props) => (
          <EmbedField of={field}>
            <EmbedFieldLabel of={field}>
              {options.text['field.city.label']}
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
      <Field
        name="postalCode"
        validate={[required(options.text['field.postalCode.error.required'])]}
        transform={toTrimmed({ on: 'input' })}
      >
        {(field, props) => (
          <EmbedField of={field}>
            <EmbedFieldLabel of={field}>
              {options.text['field.postalCode.label']}
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
      <Field
        name="state"
        validate={pattern(
          /^[A-Z]{1,3}(-[A-Z0-9]{1,3})?$/,
          options.text['field.state.error.format'],
        )}
        transform={[toTrimmed({ on: 'input' }), toUpperCase({ on: 'input' })]}
      >
        {(field, props) => (
          <EmbedField of={field}>
            <EmbedFieldLabel of={field}>
              {options.text['field.state.label']}
            </EmbedFieldLabel>
            <EmbedFieldInput
              {...props}
              of={field}
              type="text"
              value={field.value.value || ''}
              required
            />
            <EmbedFieldError of={field} />
          </EmbedField>
        )}
      </Field>
      <Field
        name="country"
        validate={[
          required(options.text['field.country.error.required']),
          pattern(/^[A-Z]{2}$/, options.text['field.country.error.format']),
        ]}
        transform={[toTrimmed({ on: 'input' }), toUpperCase({ on: 'input' })]}
      >
        {(field, props) => (
          <EmbedField of={field}>
            <EmbedFieldLabel of={field}>
              {options.text['field.country.label']}
            </EmbedFieldLabel>
            <EmbedFieldInput
              {...props}
              of={field}
              type="text"
              value={field.value.value || ''}
              required
            />
            <EmbedFieldError of={field} />
          </EmbedField>
        )}
      </Field>
    </Form>
  )
}
