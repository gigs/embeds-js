import { sanitizeSubmitData } from '../sanitizeSubmitData'

it('removes any null values', () => {
  expect(sanitizeSubmitData({ foo: 'bar', bar: null, baz: null })).toEqual({
    foo: 'bar',
  })
})

it('removes any empty string values', () => {
  expect(sanitizeSubmitData({ foo: 'bar', bar: '', baz: '' })).toEqual({
    foo: 'bar',
  })
})

it('removes any undefined values', () => {
  expect(sanitizeSubmitData({ foo: 'bar', bar: undefined })).toEqual({
    foo: 'bar',
  })
})

it('keeps any other values', () => {
  expect(
    sanitizeSubmitData({ foo: 'bar', bar: 1, baz: true, qux: {}, quux: false }),
  ).toEqual({
    foo: 'bar',
    bar: 1,
    baz: true,
    qux: {},
    quux: false,
  })
})
