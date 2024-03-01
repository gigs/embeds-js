import { render, screen } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'

import { portingFactory } from '@/testing/factories/porting'

import { OptionsContext } from '../Options'
import { StepCarrierDetailsForm } from '../StepCarrierDetailsForm'

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <button form="gigsPortingEmbedForm">Submit</button>
    </div>
  )
}

describe('form id', () => {
  it('has the default form id', () => {
    const porting = portingFactory.build({ required: ['accountNumber'] })
    render(<StepCarrierDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByRole('form')).toHaveAttribute(
      'id',
      'gigsPortingEmbedForm',
    )
  })

  it('uses a custom form id', () => {
    const porting = portingFactory.build({ required: ['accountNumber'] })
    render(
      <OptionsContext.Provider value={{ formId: 'customFormId' }}>
        <StepCarrierDetailsForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveAttribute('id', 'customFormId')
  })
})

describe('account number', () => {
  it('is shown when required', () => {
    const porting = portingFactory.build({ required: ['accountNumber'] })
    render(<StepCarrierDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('Account Number')).toBeInTheDocument()
  })

  it('is hidden when not required', () => {
    const porting = portingFactory.build({ required: [] })
    render(<StepCarrierDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.queryByLabelText('Account Number')).not.toBeInTheDocument()
  })

  it('prefills the existing value', () => {
    const porting = portingFactory.build({
      required: ['accountNumber'],
      accountNumber: '123456',
    })
    render(<StepCarrierDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('Account Number')).toHaveValue('123456')
  })

  it('trims the value while entering data', async () => {
    const porting = portingFactory.build({ required: ['accountNumber'] })
    const user = userEvent.setup()
    render(<StepCarrierDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })

    await user.type(screen.getByLabelText('Account Number'), '  1234 56  ')
    // still allows users to type spaces at the end, otherwise you can't type
    // any spaces
    expect(screen.getByLabelText('Account Number')).toHaveValue('1234 56  ')
  })

  it('trims the value when submitting', async () => {
    const porting = portingFactory.build({ required: ['accountNumber'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepCarrierDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.type(screen.getByLabelText('Account Number'), '  1234 56  ')
    await user.click(screen.getByRole('button'))
    expect(submit).toHaveBeenCalledWith({ accountNumber: '1234 56' })
  })

  it('shows an error on submit when left empty', async () => {
    const porting = portingFactory.build({ required: ['accountNumber'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepCarrierDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.click(screen.getByRole('button'))
    expect(submit).not.toHaveBeenCalled()
    expect(
      screen.getByText(/the account number is required/i),
    ).toBeInTheDocument()
  })

  it('cannot be submitted with only spaces', async () => {
    const porting = portingFactory.build({ required: ['accountNumber'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepCarrierDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.type(screen.getByLabelText('Account Number'), '  ')
    await user.click(screen.getByRole('button'))
    expect(submit).not.toHaveBeenCalled()
    expect(
      screen.getByText(/the account number is required/i),
    ).toBeInTheDocument()
  })

  it('fires validation events', async () => {
    const porting = portingFactory.build({ required: ['accountNumber'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    const validate = vi.fn()
    render(
      <StepCarrierDetailsForm
        porting={porting}
        onSubmit={submit}
        onValidationChange={validate}
      />,
      {
        wrapper,
      },
    )

    // initially valid because no validation was done yet
    expect(validate).toHaveBeenLastCalledWith({ isValid: true })
    await user.clear(screen.getByLabelText('Account Number'))
    await user.tab()
    expect(validate).toHaveBeenLastCalledWith({ isValid: false })
    await user.type(screen.getByLabelText('Account Number'), '123456')
    expect(validate).toHaveBeenLastCalledWith({ isValid: true })
  })
})

describe('account pin', () => {
  it('is shown when required', () => {
    const porting = portingFactory.build({ required: ['accountPin'] })
    render(<StepCarrierDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('Account PIN')).toBeInTheDocument()
  })

  it('is hidden when not required', () => {
    const porting = portingFactory.build({ required: [] })
    render(<StepCarrierDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.queryByLabelText('Account PIN')).not.toBeInTheDocument()
  })

  it('indicates the PIN already exists', () => {
    const porting = portingFactory.build({
      required: ['accountPin'],
      accountPinExists: true,
    })
    render(<StepCarrierDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('Account PIN')).toHaveValue('')
    expect(screen.getByLabelText('Account PIN')).toHaveAttribute(
      'placeholder',
      '••••',
    )
  })

  it('trims the value when submitting', async () => {
    const porting = portingFactory.build({ required: ['accountPin'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepCarrierDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.type(screen.getByLabelText('Account PIN'), '  1234 56  ')
    await user.click(screen.getByRole('button'))
    expect(submit).toHaveBeenCalledWith({ accountPin: '1234 56' })
  })

  it('shows an error on submit when left empty and not present', async () => {
    const porting = portingFactory.build({ required: ['accountPin'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepCarrierDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.click(screen.getByRole('button'))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText(/the account pin is required/i)).toBeInTheDocument()
  })

  it('can be left empty and submitted when already present', async () => {
    const porting = portingFactory.build({
      required: ['accountPin'],
      accountPinExists: true,
    })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepCarrierDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.click(screen.getByRole('button'))
    expect(submit).toHaveBeenCalledWith({}) // account pin must not be in submit response
  })

  it('cannot be submitted with only spaces', async () => {
    const porting = portingFactory.build({
      required: ['accountPin'],
      accountPinExists: true,
    })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepCarrierDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.type(screen.getByLabelText('Account PIN'), '    ')
    await user.click(screen.getByRole('button'))
    expect(submit).not.toHaveBeenCalled()
    expect(
      screen.getByText(/the new account pin is empty/i),
    ).toBeInTheDocument()
  })

  it('fires validation events', async () => {
    const porting = portingFactory.build({ required: ['accountPin'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    const validate = vi.fn()
    render(
      <StepCarrierDetailsForm
        porting={porting}
        onSubmit={submit}
        onValidationChange={validate}
      />,
      { wrapper },
    )

    // initially valid because no validation was done yet
    expect(validate).toHaveBeenLastCalledWith({ isValid: true })
    await user.clear(screen.getByLabelText('Account PIN'))
    await user.tab()
    expect(validate).toHaveBeenLastCalledWith({ isValid: false })
    await user.type(screen.getByLabelText('Account PIN'), '123456')
    expect(validate).toHaveBeenLastCalledWith({ isValid: true })
  })
})
