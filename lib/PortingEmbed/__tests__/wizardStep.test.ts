import { portingFactory } from '@/testing/factories/porting'

import { wizardStep } from '../wizardStep'

const basePorting = portingFactory

describe('carrier details', () => {
  it('detects required and missing account number', () => {
    const porting = basePorting
      .params({ required: ['accountNumber'], accountNumber: null })
      .build()
    expect(wizardStep(porting)).toBe('carrierDetails')
  })

  it('detects required and missing account pin', () => {
    const porting = basePorting
      .params({ required: ['accountPin'], accountPinExists: false })
      .build()
    expect(wizardStep(porting)).toBe('carrierDetails')
  })

  it('skips if fields are filled out', () => {
    const porting = basePorting
      .params({
        required: ['accountNumber', 'accountPin'],
        accountNumber: '123',
        accountPinExists: true,
      })
      .build()
    expect(wizardStep(porting)).toBe(null)
  })

  it('is before holder details', () => {
    const porting = basePorting
      .params({
        required: ['accountPin', 'firstName'],
        accountPinExists: false,
        firstName: null,
      })
      .build()
    expect(wizardStep(porting)).toBe('carrierDetails')
  })
})

describe('holder details', () => {
  it('detects required and missing firstName', () => {
    const porting = basePorting
      .params({ required: ['firstName'], firstName: null })
      .build()
    expect(wizardStep(porting)).toBe('holderDetails')
  })

  it('detects required and missing lastName', () => {
    const porting = basePorting
      .params({ required: ['lastName'], lastName: null })
      .build()
    expect(wizardStep(porting)).toBe('holderDetails')
  })

  it('detects required and missing birthday', () => {
    const porting = basePorting
      .params({ required: ['birthday'], birthday: null })
      .build()
    expect(wizardStep(porting)).toBe('holderDetails')
  })

  it('skips if fields are filled out', () => {
    const porting = basePorting
      .params({
        required: ['firstName', 'lastName', 'birthday'],
        firstName: 'first',
        lastName: 'last',
        birthday: 'birth',
      })
      .build()
    expect(wizardStep(porting)).toBe(null)
  })

  it('is after carrier details', () => {
    const porting = basePorting
      .params({
        required: ['accountNumber', 'accountPin', 'firstName'],
        accountNumber: '123',
        accountPinExists: true,
        firstName: null,
      })
      .build()
    expect(wizardStep(porting)).toBe('holderDetails')
  })

  it('is before address', () => {
    const porting = basePorting
      .params({
        required: ['firstName', 'lastName', 'birthday', 'address'],
        firstName: null,
        lastName: null,
        birthday: null,
        address: null,
      })
      .build()
    expect(wizardStep(porting)).toBe('holderDetails')
  })
})

describe('address', () => {
  it('detects required and missing address', () => {
    const porting = basePorting
      .params({ required: ['address'], address: null })
      .build()
    expect(wizardStep(porting)).toBe('address')
  })

  it('skips if fields are filled out', () => {
    const porting = basePorting
      .params({
        required: ['address'],
        address: {
          city: 'city',
          state: 'st',
          country: 'co',
          postalCode: '12345',
          line1: 'line1',
        },
      })
      .build()
    expect(wizardStep(porting)).toBe(null)
  })

  it('is after holder details', () => {
    const porting = basePorting
      .params({
        required: ['firstName', 'lastName', 'address'],
        firstName: 'first',
        lastName: 'last',
        address: null,
      })
      .build()
    expect(wizardStep(porting)).toBe('address')
  })

  it('is before donor approval', () => {
    const porting = basePorting
      .params({
        required: ['address', 'donorProviderApproval'],
        address: null,
        donorProviderApproval: null,
      })
      .build()
    expect(wizardStep(porting)).toBe('address')
  })
})

describe('donor approval', () => {
  it('detects required and missing donor approval', () => {
    const porting = basePorting
      .params({
        required: ['donorProviderApproval'],
        donorProviderApproval: null,
      })
      .build()
    expect(wizardStep(porting)).toBe('donorProviderApproval')
  })

  it('skips if donor approval was set', () => {
    const porting = basePorting
      .params({
        required: ['donorProviderApproval'],
        donorProviderApproval: true,
      })
      .build()
    expect(wizardStep(porting)).toBe(null)
  })

  it('is after address', () => {
    const porting = basePorting
      .params({
        required: ['address', 'donorProviderApproval'],
        address: {
          city: 'city',
          state: 'st',
          country: 'co',
          postalCode: '12345',
          line1: 'line1',
        },
        donorProviderApproval: null,
      })
      .build()
    expect(wizardStep(porting)).toBe('donorProviderApproval')
  })
})

it('returns null if nothing is required', () => {
  const porting = basePorting.params({ required: [] }).build()
  expect(wizardStep(porting)).toBe(null)
})
