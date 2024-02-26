import { portingFactory } from '@/testing/factories/porting'

import { patchPorting } from '../porting'

const project = 'test_project'
const token = 'test_token'

it('returns an existing subscription', async () => {
  const prt = await portingFactory.create()
  const result = await patchPorting(
    prt.id,
    { accountNumber: '123' },
    { project, token },
  )
  expect(result.accountNumber).toBe('123')
})

it('throws if the porting does not exist', async () => {
  expect(patchPorting('prt_not_found', {}, { project, token })).rejects.toThrow(
    /PRT_NOT_FOUND/,
  )
})
