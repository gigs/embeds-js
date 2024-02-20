import { Porting } from '.'

// Reduced version of a subscription because we only care about the porting
export type Subscription = {
  object: 'subscription'
  id: string
  porting: Porting | null
}
