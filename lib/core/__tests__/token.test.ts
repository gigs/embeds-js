import { connectSessionFactory } from '@/testing/factories/connectSession'

import { exchangeSessionWithToken } from '../token'

it('exchanges an authenticated session with a user token', async () => {
  const csn = connectSessionFactory
    .params({ intent: { type: 'completePorting' } })
    .transient({ token: 'secret_sauce' })
    .build()
  const { token } = await exchangeSessionWithToken(csn, 'completePorting')
  expect(token).toBe('exchanged:secret_sauce')
})

it('returns the validated connectSession object', async () => {
  const csn = connectSessionFactory
    .params({ intent: { type: 'completePorting' } })
    .build()
  const { connectSession } = await exchangeSessionWithToken(
    csn,
    'completePorting',
  )
  expect(connectSession).toEqual(csn)
})

it('throws with an invalid connectSession object', () => {
  expect(exchangeSessionWithToken({}, 'completePorting')).rejects.toThrow(
    /INVALID_SESSION: The object you passed in/,
  )
  expect(exchangeSessionWithToken(null, 'completePorting')).rejects.toThrow(
    /INVALID_SESSION: The object you passed in/,
  )
  expect(
    exchangeSessionWithToken(undefined, 'completePorting'),
  ).rejects.toThrow(/INVALID_SESSION: The object you passed in/)
  expect(exchangeSessionWithToken('secret', 'completePorting')).rejects.toThrow(
    /INVALID_SESSION: The object you passed in/,
  )
})

it('throws with the wrong intent type', () => {
  const csn = connectSessionFactory
    // @ts-expect-error Assume the intent type is not supported
    .params({ intent: { type: 'somethingElse' } })
    .build()
  expect(exchangeSessionWithToken(csn, 'completePorting')).rejects.toThrow(
    /INVALID_SESSION: PortingEmbed must be initialized with the "completePorting" intent/,
  )
})

it('throws with an unauthenticated session', async () => {
  const csn = connectSessionFactory
    .params({ intent: { type: 'completePorting' } })
    .unauthenticated()
    .build()
  expect(exchangeSessionWithToken(csn, 'completePorting')).rejects.toThrow(
    /INVALID_SESSION: Session has no token./,
  )
})

it('throws without a url in the session', async () => {
  const csn = connectSessionFactory
    .params({ url: null, intent: { type: 'completePorting' } })
    .build()
  expect(exchangeSessionWithToken(csn, 'completePorting')).rejects.toThrow(
    /INVALID_SESSION: Session has no URL/,
  )
})

it('throws with an expired session', async () => {
  const csn = connectSessionFactory
    .params({ intent: { type: 'completePorting' } })
    .transient({ token: 'expired' })
    .build()
  expect(exchangeSessionWithToken(csn, 'completePorting')).rejects.toThrow(
    /INVALID_SESSION: Session is expired/,
  )
})
