import { render, screen } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'

import { portingFactory } from '@/testing/factories/porting'

import { PortingForm } from '../PortingForm'

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div data-testid="embed">{children}</div>
      <button form="gigsPortingEmbedForm">Submit</button>
    </div>
  )
}

const validationChange = vi.fn()
const submit = vi.fn()

it('renders nothing if there are no steps left', () => {
  const porting = portingFactory.build()
  render(
    <PortingForm
      porting={porting}
      onValidationChange={validationChange}
      onSubmit={submit}
    />,
    { wrapper },
  )

  expect(screen.getByTestId('embed')).toBeEmptyDOMElement()
})

describe('carrier details', () => {
  const porting = portingFactory.build({
    required: ['accountNumber', 'accountPin'],
  })

  it('renders the corresponding form', () => {
    render(
      <PortingForm
        porting={porting}
        onValidationChange={validationChange}
        onSubmit={submit}
      />,
      { wrapper },
    )
    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByLabelText('Account Number')).toBeInTheDocument()
    expect(screen.getByLabelText('Account PIN')).toBeInTheDocument()
  })

  it('forwards the submitted data', async () => {
    const user = userEvent.setup()
    render(
      <PortingForm
        porting={porting}
        onValidationChange={validationChange}
        onSubmit={submit}
      />,
      { wrapper },
    )

    await user.type(screen.getByLabelText('Account Number'), '123456')
    await user.type(screen.getByLabelText('Account PIN'), '1234')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(submit).toHaveBeenCalledWith({
      accountNumber: '123456',
      accountPin: '1234',
    })
  })
})

describe('holder details', () => {
  const porting = portingFactory.build({
    required: ['firstName', 'lastName', 'birthday'],
  })

  it('renders the corresponding form', () => {
    render(
      <PortingForm
        porting={porting}
        onValidationChange={validationChange}
        onSubmit={submit}
      />,
      { wrapper },
    )
    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Birthday')).toBeInTheDocument()
  })

  it('forwards the submitted data', async () => {
    const user = userEvent.setup()
    render(
      <PortingForm
        porting={porting}
        onValidationChange={validationChange}
        onSubmit={submit}
      />,
      { wrapper },
    )

    await user.type(screen.getByLabelText('First Name'), 'first')
    await user.type(screen.getByLabelText('Last Name'), 'last')
    await user.type(screen.getByLabelText('Birthday'), '1954-04-29')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(submit).toHaveBeenCalledWith({
      firstName: 'first',
      lastName: 'last',
      birthday: '1954-04-29',
    })
  })
})
