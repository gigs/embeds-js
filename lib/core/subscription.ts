import { Subscription } from '../types'
import { assert } from './assert'

type FetchSubOptions = {
  /** Project id of the subscription. */
  project: string
  /** User token. */
  token: string
}

/**
 * Fetch the user's subscription.
 * @param sub The subscription id.
 * @param opts Additional options.
 */
export async function fetchSubscription(sub: string, opts: FetchSubOptions) {
  const res = await fetch(
    `https://api.gigs.com/projects/${opts.project}/subscriptions/${sub}`,
    { headers: { authorization: `Bearer ${opts.token}` } },
  )
  const body = await res.json().catch(() => res.text())
  assert(
    res.status !== 404,
    'SUB_NOT_FOUND: Subscription could not be fetched.',
  )
  assert(res.ok, `FETCH_FAILED: ${body?.message || body?.toString()}`)
  const subscription = body as Subscription

  return subscription
}
