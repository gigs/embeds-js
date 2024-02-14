import { render, screen } from '@testing-library/preact'

import { http, HttpResponse, server } from '@/testing/http'

import { TestComponentWithFetch } from '../TestComponentWithFetch'

it('greets the default user from the api', async () => {
  render(<TestComponentWithFetch />)

  expect(screen.getByText('Loading')).toBeInTheDocument()
  expect(await screen.findByText(/Hello, George/i)).toBeInTheDocument()
})

it('allows api overrides', async () => {
  server.use(
    // Be careful to only override unique handler URLs and not default handlers,
    // as it can otherwise affect concurrent tests.
    http.get('https://api.example.com/users/elaine-123', () => {
      return HttpResponse.json({ name: 'Elaine' })
    }),
  )
  render(<TestComponentWithFetch id="elaine-123" />)

  expect(screen.getByText('Loading')).toBeInTheDocument()
  expect(await screen.findByText(/Hello, Elaine/i)).toBeInTheDocument()
})
