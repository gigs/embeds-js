import { Factory } from 'fishery'

import { Subscription } from '../../lib/types'
import { db } from '../db'
import { portingFactory } from './porting'

type SubscriptionTransientParams = never

class SubscriptionFactory extends Factory<
  Subscription,
  SubscriptionTransientParams
> {
  withoutPorting() {
    return this.params({ porting: null })
  }
}

export const subscriptionFactory = SubscriptionFactory.define(
  ({ sequence, associations, onCreate }) => {
    onCreate((sub) => {
      db.subscriptions.push(sub)
      if (sub.porting) db.portings.push(sub.porting)
      return sub
    })

    return {
      object: 'subscription' as const,
      id: `sub_${sequence}`,
      porting: associations.porting || portingFactory.build(),
    }
  },
)
