import { ConnectSession } from '../types'
import { assert } from './assert'

type Tokens = {
  access_token: string
}

/**
 * Exchange an authenticated ConnectSession with a user token.
 */
export async function exchangeSessionWithToken(session: ConnectSession) {
  assert(
    session.url,
    'INVALID_SESSION: Session has no URL. Did you pass in the created session?',
  )
  const url = new URL(session.url)
  const token = url.searchParams.get('token')
  assert(
    token,
    'INVALID_SESSION: Session has no token. Is it an authenticated session?',
  )

  const res = await fetch(`https://connect.gigs.com/api/embeds/auth`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ secret: token }),
  })
  const body: { token?: Tokens; error?: string } = await res
    .json()
    .catch(async () => ({ error: await res.text() }))
  assert(res.status !== 422, 'INVALID_SESSION: Session is expired.')
  assert(res.ok, `FETCH_FAILED: ${body.error}`)
  assert(
    body.token?.access_token,
    'Expected user token to be returned in response of token exchange, but was not found.',
  )

  return body.token.access_token
}
