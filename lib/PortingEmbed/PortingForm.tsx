import { required, useForm } from '@modular-forms/preact'
import { useSignalEffect } from '@preact/signals'

import { Porting } from '../types'
import { sanitizeSubmitData } from './sanitizeSubmitData'

type Props = {
  porting: Porting
  onValidationChange?: (event: { isValid: boolean }) => unknown
  onSubmit: (data: Partial<PortingForm>) => unknown
}

type PortingForm = {
  accountPin: string
  accountNumber: string
  birthday: string
  firstName: string
  lastName: string
}

export function PortingForm({ porting, onValidationChange, onSubmit }: Props) {
  const [portingForm, { Form, Field }] = useForm<PortingForm>({
    initialValues: {
      accountNumber: porting.accountNumber || '',
      accountPin: '',
      birthday: porting.birthday || '',
      firstName: porting.firstName || '',
      lastName: porting.lastName || '',
    },
    validateOn: 'blur',
  })

  useSignalEffect(() => {
    const isValid = !portingForm.invalid.value
    onValidationChange?.({ isValid })
  })

  return (
    <Form
      id="gigsPortingEmbedForm"
      role="form"
      onSubmit={(data) => {
        const sanitizedData = sanitizeSubmitData(data)
        return onSubmit(sanitizedData)
      }}
      shouldDirty
    >
      <Field name="accountNumber" validate={[required('Please enter')]}>
        {(field, props) => (
          <div>
            <label for="accountNumber">Account Number</label>
            <input
              id="accountNumber"
              type="text"
              value={field.value}
              {...props}
            />
            {field.error && <div>{field.error}</div>}
          </div>
        )}
      </Field>

      <Field
        name="accountPin"
        validate={porting.accountPinExists ? [] : [required('Please enter')]}
      >
        {(field, props) => (
          <div>
            <label for="accountPin">Account PIN</label>
            <input
              id="accountPin"
              type="text"
              placeholder={porting.accountPinExists ? '••••' : undefined}
              {...props}
            />
            {field.error && <div>{field.error}</div>}
          </div>
        )}
      </Field>

      <Field name="birthday" validate={[required('Please enter')]}>
        {(field, props) => (
          <div>
            <label for="birthday">Birthday</label>
            <input id="birthday" type="text" value={field.value} {...props} />
            {field.error && <div>{field.error}</div>}
          </div>
        )}
      </Field>

      <Field name="firstName" validate={[required('Please enter')]}>
        {(field, props) => (
          <div>
            <label for="firstName">First Name</label>
            <input id="firstName" type="text" value={field.value} {...props} />
            {field.error && <div>{field.error}</div>}
          </div>
        )}
      </Field>

      <Field name="lastName" validate={[required('Please enter')]}>
        {(field, props) => (
          <div>
            <label for="lastName">Last Name</label>
            <input id="lastName" type="text" value={field.value} {...props} />
            {field.error && <div>{field.error}</div>}
          </div>
        )}
      </Field>
    </Form>
  )
}
