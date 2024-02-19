import { Factory } from 'fishery'

import { ConnectSession } from '../../lib/types'

type ConnectSessionTransientParams = {
  token: string
}

class ConnectSessionFactory extends Factory<
  ConnectSession,
  ConnectSessionTransientParams
> {
  completePorting(subscription?: string) {
    return this.params({
      intent: {
        type: 'completePorting' as const,
        completePorting: {
          subscription: subscription || `sub_${this.sequence()}`,
        },
      },
    })
  }

  unauthenticated() {
    return this.params({
      url: `https://connect.gigs.com/portal/entry?session=csn_${this.sequence()}`,
      user: null,
    })
  }
}

export const connectSessionFactory = ConnectSessionFactory.define(
  ({ sequence, transientParams }) => ({
    object: 'connectSession' as const,
    id: `csn_${sequence}`,
    intent: {
      type: 'completePorting' as const,
      completePorting: {
        subscription: 'sub_123',
      },
    },
    callbackUrl: null,
    url: `https://connect.gigs.com/portal/entry?session=csn_${sequence}&token=${transientParams.token || 'secrettoken'}`,
    user: 'usr_123',
  }),
)
