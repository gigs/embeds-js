import { Factory } from 'fishery'

import { ServiceProvider } from '../../lib/types'

type ServiceProviderTransientParams = never

class ServiceProviderFactory extends Factory<
  ServiceProvider,
  ServiceProviderTransientParams
> {}

export const serviceProviderFactory = ServiceProviderFactory.define(
  ({ sequence }) => ({
    object: 'serviceProvider' as const,
    id: `svp_${sequence}`,
    name: 'Example Provider',
    recipientProviders: [],
  }),
)
