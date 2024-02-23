import { render, screen } from '@testing-library/preact'

import { portingFactory } from '@/testing/factories/porting'

import { PortingEmbed } from '../PortingEmbed'

it('renders a form', () => {
  const porting = portingFactory.params({ id: 'prt_123' }).build()
  render(<PortingEmbed porting={porting} />)
  const form = screen.getByRole('form')
  expect(form).toBeInTheDocument()
})
