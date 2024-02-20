import { subscriptionFactory } from '@/testing/factories/subscription'

import { fetchSubscription } from '../subscription'

const project = 'test_project'
const token = 'test_token'

it('returns an existing subscription', async () => {
  const sub = await subscriptionFactory.create()
  const result = await fetchSubscription(sub.id, { project, token })
  expect(result).toEqual(sub)
})

it('throws if the subscription does not exist', async () => {
  expect(
    fetchSubscription('sub_not_found', { project, token }),
  ).rejects.toThrow(/SUB_NOT_FOUND/)
})
