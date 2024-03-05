import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

type FieldState = {
  name: string
  dirty: boolean
  touched: boolean
  valid: boolean
}

type FormState = {
  name: string
  dirty: boolean
  valid: boolean
  submitting: boolean
  touched: boolean
}

export const defaultFormId = 'gigsPortingEmbedForm'

const defaultText = {
  'field.accountNumber.label': `Account Number`,
  'field.accountNumber.error.required': `The account number is required`,
  'field.accountPin.label': `Account PIN`,
  'field.accountPin.error.required': `The account pin is required`,
  'field.accountPin.error.cleared': `The new account pin is empty. If you do not want to change the account pin, clear the input.`,
  'field.firstName.label': `First Name`,
  'field.firstName.error.required': `Your first name is required`,
  'field.lastName.label': `Last Name`,
  'field.lastName.error.required': `Your last name is required`,
  'field.birthday.label': `Birthday`,
  'field.birthday.error.required': `Your birthday is required`,
  'field.line1.label': `Line 1`,
  'field.line1.error.required': `Line 1 is required`,
  'field.line2.label': `Line 2`,
  'field.city.label': `City`,
  'field.city.error.required': `City is required`,
  'field.postalCode.label': `Postal Code`,
  'field.postalCode.error.required': `Postal Code is required`,
  'field.state.label': `State (ISO code)`,
  'field.state.error.format': `Must be an ISO state code`,
  'field.country.label': `Country (2 letter code)`,
  'field.country.error.required': `Country is required`,
  'field.country.error.format': `Must be an ISO country code`,
  'field.donorProviderApproval.label': `I have notified my current provider of the number porting and got the approval that the number can be ported`,
  'field.donorProviderApproval.error.required': `You must get the approval of your current provider`,
}

export type EmbedOptions = {
  formId?: string
  className?: {
    form?: (state: FormState) => string
    field?: (state: FieldState) => string
    input?: (state: FieldState) => string
    label?: (state: FieldState) => string
    error?: (state: Omit<FieldState, 'valid'>) => string
  }
  text?: Partial<typeof defaultText>
}

export const OptionsContext = createContext<EmbedOptions>({})

export function useEmbedOptions() {
  const options = useContext(OptionsContext)
  const mergedOptions = {
    ...options,
    text: {
      ...defaultText,
      ...options.text,
    },
  }

  return mergedOptions
}
