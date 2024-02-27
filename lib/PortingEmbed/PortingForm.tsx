import { Porting } from '../types'
import { StepAddressForm, StepAddressFormData } from './StepAddressForm'
import {
  StepCarrierDetailsForm,
  StepCarrierDetailsFormData,
} from './StepCarrierDetailsForm'
import {
  StepDonorApprovalForm,
  StepDonorApprovalFormData,
} from './StepDonorApproval'
import {
  StepHolderDetailsForm,
  StepHolderDetailsFormData,
} from './StepHolderDetailsForm'
import { wizardStep } from './wizardStep'

type Props = {
  porting: Porting
  onValidationChange?: (event: { isValid: boolean }) => unknown
  onSubmit: (data: Partial<PortingFormData>) => unknown
}

type PortingFormData =
  | StepCarrierDetailsFormData
  | StepHolderDetailsFormData
  | { address?: StepAddressFormData }
  | StepDonorApprovalFormData

export function PortingForm({ porting, onValidationChange, onSubmit }: Props) {
  const step = wizardStep(porting)

  if (step === 'carrierDetails') {
    return (
      <StepCarrierDetailsForm
        porting={porting}
        onValidationChange={onValidationChange}
        onSubmit={(data) => onSubmit(data)}
      />
    )
  }

  if (step === 'holderDetails') {
    return (
      <StepHolderDetailsForm
        porting={porting}
        onValidationChange={onValidationChange}
        onSubmit={(data) => onSubmit(data)}
      />
    )
  }

  if (step === 'address') {
    return (
      <StepAddressForm
        porting={porting}
        onValidationChange={onValidationChange}
        onSubmit={(data) => onSubmit({ address: data })}
      />
    )
  }

  if (step === 'donorApproval') {
    return (
      <StepDonorApprovalForm
        porting={porting}
        onValidationChange={onValidationChange}
        onSubmit={(data) => onSubmit(data)}
      />
    )
  }

  return null
}
