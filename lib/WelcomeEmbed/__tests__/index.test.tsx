import { fireEvent, render, screen } from '@testing-library/preact'

import { WelcomeEmbed } from '../'

beforeEach(() => {
  render(<div id="mount" />)
})

it('initializes', async () => {
  const embed = await WelcomeEmbed('session', { name: 'Test' })
  expect(embed.mount).toBeDefined()
  expect(embed.update).toBeDefined()
  expect(embed.unmount).toBeDefined()
  expect(embed.on).toBeDefined()
  expect(embed.off).toBeDefined()
})

describe('mounting', () => {
  it('mounts into a DOM selector', async () => {
    const embed = await WelcomeEmbed('session', { name: 'Test' })
    embed.mount('#mount')
    expect(screen.getByText(/Hello, Test/i)).toBeInTheDocument()
  })

  it('mounts into a DOM element', async () => {
    const embed = await WelcomeEmbed('session', { name: 'Test' })
    embed.mount(document.getElementById('mount')!)
    expect(screen.getByText(/Hello, Test/i)).toBeInTheDocument()
  })
})

describe('updating', () => {
  it('updates the embed', async () => {
    const embed = await WelcomeEmbed('session', { name: 'Test' })
    embed.mount('#mount')
    embed.update({ name: 'James' })
    expect(screen.getByText(/Hello, James/i)).toBeInTheDocument()
  })

  it('fails to update an unmounted embed', async () => {
    const embed = await WelcomeEmbed('session', { name: 'Test' })
    expect(() => embed.update({})).toThrow(/an unmounted embed/i)
  })
})

describe('unmounting', () => {
  it('unmounts the embed', async () => {
    const embed = await WelcomeEmbed('session', { name: 'Test' })
    embed.mount('#mount')
    expect(document.getElementById('mount')).not.toBeEmptyDOMElement()
    embed.unmount()
    expect(document.getElementById('mount')).toBeEmptyDOMElement()
  })

  it('fails to unmount an unmounted embed', async () => {
    const embed = await WelcomeEmbed('session', { name: 'Test' })
    expect(() => embed.unmount()).toThrow(/an unmounted embed/i)
  })
})

describe('events', () => {
  it('fires the count event when the count changed', async () => {
    const embed = await WelcomeEmbed('session', { name: 'Test' })
    embed.mount('#mount')
    const countFn = vi.fn()
    embed.on('count', countFn)
    fireEvent.click(screen.getByText(/Count/i))
    expect(countFn).toHaveBeenCalledWith(1)
  })
})
