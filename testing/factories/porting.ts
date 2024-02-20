import { Factory } from 'fishery'

import { Porting } from '../../lib/types'
import { serviceProviderFactory } from './serviceProvider'

type PortingTransientParams = never

class PortingFactory extends Factory<Porting, PortingTransientParams> {
  declined() {
    return this.params({ status: 'declined' })
  }
}

export const portingFactory = PortingFactory.define(
  ({ sequence, associations }) => ({
    object: 'porting' as const,
    id: `prt_${sequence}`,
    accountNumber: null,
    accountPinExists: false,
    address: null,
    birthday: null,
    declinedAttempts: 0,
    declinedCode: null,
    declinedMessage: null,
    donorProvider: associations.donorProvider || serviceProviderFactory.build(),
    donorProviderApproval: null,
    firstName: null,
    lastName: null,
    phoneNumber: '+19591234567',
    provider: 'p7',
    recipientProvider:
      associations.recipientProvider || serviceProviderFactory.build(),
    required: [],
    status: 'informationRequired' as const,
    subscription: null,
    user: 'usr_123',
    canceledAt: null,
    completedAt: null,
    createdAt: new Date().toISOString(),
    expiredAt: null,
    lastDeclinedAt: null,
    lastRequestedAt: null,
  }),
)
