import { Porting, PortingRequiredField } from '../types'

export function wizardStep(porting: Porting) {
  if (requiresCarrierDetails(porting)) {
    return 'carrierDetails' as const
  }

  if (requiresHolderDetails(porting)) {
    return 'holderDetails' as const
  }

  if (requiresAddress(porting)) {
    return 'address' as const
  }

  if (requiresDonorApproval(porting)) {
    return 'donorApproval' as const
  }

  return null
}

function requiresCarrierDetails(porting: Porting) {
  if (requires(porting, 'accountPin') && !porting.accountPinExists) {
    return true
  }

  if (requires(porting, 'accountNumber') && !porting.accountNumber) {
    return true
  }

  return false
}

function requiresHolderDetails(porting: Porting) {
  if (requires(porting, 'firstName') && !porting.firstName) {
    return true
  }

  if (requires(porting, 'lastName') && !porting.lastName) {
    return true
  }

  if (requires(porting, 'birthday') && !porting.birthday) {
    return true
  }

  return false
}

function requiresAddress(porting: Porting) {
  return requires(porting, 'address') && !porting.address
}

function requiresDonorApproval(porting: Porting) {
  return (
    requires(porting, 'donorProviderApproval') && !porting.donorProviderApproval
  )
}

function requires(porting: Porting, field: PortingRequiredField) {
  return porting.required.includes(field)
}
