import { portingFactory } from '@/testing/factories/porting'

import { currentStep } from '../wizard'

const basePorting = portingFactory

describe('for carrier details', () => {
  it('detects required and missing account number', () => {
    const porting = basePorting
      .params({ required: ['accountNumber'], accountNumber: null })
      .build()
    expect(currentStep(porting)).toBe('carrierDetails')
  })

  it('detects required and missing account pin', () => {
    const porting = basePorting
      .params({ required: ['accountPin'], accountPinExists: false })
      .build()
    expect(currentStep(porting)).toBe('carrierDetails')
  })

  it('skips if fields are filled out', () => {
    const porting = basePorting
      .params({
        required: ['accountNumber', 'accountPin'],
        accountNumber: '123',
        accountPinExists: true,
      })
      .build()
    expect(currentStep(porting)).toBe(null)
  })

  it('is before holder details', () => {
    const porting = basePorting
      .params({
        required: ['accountPin', 'firstName'],
        accountPinExists: false,
        firstName: null,
      })
      .build()
    expect(currentStep(porting)).toBe('carrierDetails')
  })
})

describe('for holder details', () => {
  it('detects required and missing firstName', () => {
    const porting = basePorting
      .params({ required: ['firstName'], firstName: null })
      .build()
    expect(currentStep(porting)).toBe('holderDetails')
  })

  it('detects required and missing lastName', () => {
    const porting = basePorting
      .params({ required: ['lastName'], lastName: null })
      .build()
    expect(currentStep(porting)).toBe('holderDetails')
  })

  it('detects required and missing birthday', () => {
    const porting = basePorting
      .params({ required: ['birthday'], birthday: null })
      .build()
    expect(currentStep(porting)).toBe('holderDetails')
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
    expect(currentStep(porting)).toBe(null)
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
    expect(currentStep(porting)).toBe('holderDetails')
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
    expect(currentStep(porting)).toBe('holderDetails')
  })
})
