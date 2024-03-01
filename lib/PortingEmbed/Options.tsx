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

export type EmbedOptions = {
  formId?: string
  className?: {
    form?: (state: FormState) => string
    field?: (state: FieldState) => string
    input?: (state: FieldState) => string
    label?: (state: FieldState) => string
    error?: (state: Omit<FieldState, 'valid'>) => string
  }
}

export const OptionsContext = createContext<EmbedOptions>({})

export function useEmbedOptions() {
  return useContext(OptionsContext)
}
