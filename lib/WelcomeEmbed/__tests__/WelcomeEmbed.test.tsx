import { fireEvent, render, screen } from '@testing-library/preact'

import { WelcomeEmbed } from '../WelcomeEmbed'

it('greets Jerry', () => {
  render(
    <WelcomeEmbed name="Jerry" token="abc:123" onCounterChange={vi.fn()} />,
  )
  const greeting = screen.getByText(/Hello/i)
  expect(greeting).toBeInTheDocument()
})

it('passes on the token Jerry', () => {
  render(
    <WelcomeEmbed name="Jerry" token="abc:123" onCounterChange={vi.fn()} />,
  )
  const token = screen.getByText(/abc:123/i)
  expect(token).toBeInTheDocument()
})

it('starts with a count of 0', () => {
  render(
    <WelcomeEmbed name="Jerry" token="abc:123" onCounterChange={vi.fn()} />,
  )
  const count = screen.getByText(/Count: 0/i)
  expect(count).toBeInTheDocument()
})

it('fires a callback when incrementing the counter', () => {
  const changeFn = vi.fn()
  render(
    <WelcomeEmbed name="Jerry" token="abc:123" onCounterChange={changeFn} />,
  )
  const count = screen.getByText(/Count: 0/i)
  fireEvent.click(count)
  expect(screen.getByText(/Count: 1/i)).toBeInTheDocument()
  expect(changeFn).toHaveBeenCalledWith(1)
})
