import { render, screen } from '@testing-library/preact'

import { portingFactory } from '@/testing/factories/porting'

import { PortingEmbed } from '../PortingEmbed'

it('gets the porting', () => {
  const porting = portingFactory.params({ id: 'prt_123' }).build()
  render(<PortingEmbed initialPorting={porting} token="abc:123" />)
  const greeting = screen.getByText(/Hello prt_123/i)
  expect(greeting).toBeInTheDocument()
})
