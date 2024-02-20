import { ConnectSession, ConnectSessionIntent } from '../types'
import { assert } from './assert'

type Tokens = {
  access_token: string
}

/**
 * Exchange an authenticated ConnectSession with a user token.
 * Returns the token, together with the validated ConnectSession for the sake
 * of easier type-safety.
 */
export async function exchangeSessionWithToken(
  session: unknown,
  type: ConnectSessionIntent['type'],
) {
  const { connectSession, token } = parseConnectSession(session, type)

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

  return { connectSession, token: body.token.access_token }
}

function parseConnectSession(
  session: unknown,
  type: ConnectSessionIntent['type'],
) {
  // The session which is used to initilialize an embed is intentionally typed
  // as unknown.
  // 1. For non-typescript usage, we need to ensure that the passed in object is
  //    correct anyways.
  // 2. To not require the caller to cast the response as a ConnectSession.
  //    Especially since fetch returns any. Makes it a little easier to use.

  assert(
    session &&
      typeof session === 'object' &&
      'object' in session &&
      'intent' in session &&
      'url' in session &&
      session.object === 'connectSession',
    'INVALID_SESSION: The object you passed in is not a ConnectSession resoure. Make sure to pass in the complete resource.',
  )
  const connectSession = session as ConnectSession

  assert(
    connectSession.intent.type === type,
    `INVALID_SESSION: PortingEmbed must be initialized with the "${type}" intent, but got "${connectSession.intent.type}" instead.`,
  )
  assert(
    connectSession.url,
    'INVALID_SESSION: Session has no URL. Did you pass in the created session?',
  )

  const url = new URL(connectSession.url)
  const token = url.searchParams.get('token')
  assert(
    token,
    'INVALID_SESSION: Session has no token. Is it an authenticated session?',
  )

  return { connectSession, token }
}
