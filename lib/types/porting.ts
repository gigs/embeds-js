export type Porting = {
  object: 'porting'
  id: string
  accountNumber: string | null
  accountPinExists: boolean
  address: PortingAddress | null
  birthday: string | null
  declinedAttempts: number
  declinedCode: string | null
  declinedMessage: string | null
  donorProvider: ServiceProvider | null
  donorProviderApproval: boolean | null
  firstName: string | null
  lastName: string | null
  phoneNumber: string
  provider: string
  recipientProvider: ServiceProvider
  required: PortingRequiredField[]
  status: PortingStatus
  subscription: string | null
  user: string
  canceledAt: string | null
  completedAt: string | null
  createdAt: string
  expiredAt: string | null
  lastDeclinedAt: string | null
  lastRequestedAt: string | null
}

export type PortingAddress = {
  city: string
  country: string
  line1: string
  line2: string
  postalCode: string
  state: string | null
}

export type ServiceProvider = {
  object: 'serviceProvider'
  id: string
  name: string
  recipientProviders: string[]
}

export type PortingRequiredField =
  | 'accountNumber'
  | 'accountPin'
  | 'address'
  | 'birthday'
  | 'donorProvider'
  | 'donorProviderApproval'
  | 'firstName'
  | 'lastName'

export type PortingStatus =
  | 'draft'
  | 'pending'
  | 'informationRequired'
  | 'requested'
  | 'declined'
  | 'completed'
  | 'canceled'
  | 'expired'
