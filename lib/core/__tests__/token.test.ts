import { connectSessionFactory } from '@/testing/factories/connectSession'

import { exchangeSessionWithToken } from '../token'

it('exchanges an authenticated session with a user token', async () => {
  const csn = connectSessionFactory.transient({ token: 'secret_sauce' }).build()
  const token = await exchangeSessionWithToken(csn)
  expect(token).toBe('exchanged:secret_sauce')
})

it('throws with an unauthenticated session', async () => {
  const csn = connectSessionFactory.unauthenticated().build()
  expect(exchangeSessionWithToken(csn)).rejects.toThrow(
    /INVALID_SESSION: Session has no token./,
  )
})

it('throws without a url in the session', async () => {
  const csn = connectSessionFactory.params({ url: null }).build()
  expect(exchangeSessionWithToken(csn)).rejects.toThrow(
    /INVALID_SESSION: Session has no URL/,
  )
})

it('throws with an expired session', async () => {
  const csn = connectSessionFactory.transient({ token: 'expired' }).build()
  expect(exchangeSessionWithToken(csn)).rejects.toThrow(
    /INVALID_SESSION: Session is expired/,
  )
})
