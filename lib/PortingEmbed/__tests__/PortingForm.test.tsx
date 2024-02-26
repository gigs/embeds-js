import { render, screen } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'

import { portingFactory } from '@/testing/factories/porting'

import { PortingForm } from '../PortingForm'

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <button form="gigsPortingEmbedForm">Submit</button>
    </div>
  )
}

it('can enter and submit', async () => {
  const user = userEvent.setup()
  const porting = portingFactory.build()
  const submit = vi.fn()
  render(<PortingForm porting={porting} onSubmit={submit} />, { wrapper })

  await user.type(screen.getByLabelText('Account Number'), '1234')
  await user.type(screen.getByLabelText('Account PIN'), '0000')
  await user.type(screen.getByLabelText('Birthday'), '01.01.1990')
  await user.type(screen.getByLabelText('First Name'), 'Jerry')
  await user.type(screen.getByLabelText('Last Name'), 'Seinfeld')
  await user.click(screen.getByRole('button', { name: 'Submit' }))

  expect(submit).toHaveBeenCalledWith({
    accountNumber: '1234',
    accountPin: '0000',
    birthday: '01.01.1990',
    firstName: 'Jerry',
    lastName: 'Seinfeld',
  })
})

describe('with existing porting fields', () => {
  it('prefills the inputs', async () => {
    const porting = portingFactory.build({
      accountNumber: '1234',
      accountPinExists: true,
      birthday: '01.01.1990',
      firstName: 'Jerry',
      lastName: 'Seinfeld',
    })
    const submit = vi.fn()
    render(<PortingForm porting={porting} onSubmit={submit} />, { wrapper })

    expect(screen.getByLabelText('Account Number')).toHaveValue('1234')
    expect(screen.getByLabelText('Birthday')).toHaveValue('01.01.1990')
    expect(screen.getByLabelText('First Name')).toHaveValue('Jerry')
    expect(screen.getByLabelText('Last Name')).toHaveValue('Seinfeld')

    // the account pin cannot be prefilled, and instead indicates it exists with
    // a placeholder
    expect(screen.getByLabelText('Account PIN')).toHaveValue('')
    expect(screen.getByLabelText('Account PIN')).toHaveAttribute(
      'placeholder',
      '••••',
    )
  })

  it('only submits changed fields', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      accountNumber: '1234',
      accountPinExists: true,
      birthday: '01.01.1990',
      firstName: 'Jerry',
      lastName: 'Seinfeld',
    })
    const submit = vi.fn()
    render(<PortingForm porting={porting} onSubmit={submit} />, { wrapper })

    await user.clear(screen.getByLabelText('Account Number'))
    await user.type(screen.getByLabelText('Account Number'), '5678')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(submit).toHaveBeenCalledWith({
      accountNumber: '5678',
    })
  })
})
