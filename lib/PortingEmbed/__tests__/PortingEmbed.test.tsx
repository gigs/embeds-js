import { render } from '@testing-library/preact'

import { portingFactory } from '@/testing/factories/porting'

import { PortingEmbed } from '../PortingEmbed'

it('renders the root', () => {
  const porting = portingFactory.build({
    required: ['accountNumber', 'accountPin'],
  })
  render(<PortingEmbed porting={porting} />)

  // stable class, used for in other tests
  expect(document.querySelector('.__ge_portingRoot')).toBeInTheDocument()
})
