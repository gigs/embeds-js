import { render, screen } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'

import { portingFactory } from '@/testing/factories/porting'

import { OptionsContext } from '../Options'
import { StepHolderDetailsForm } from '../StepHolderDetailsForm'

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <button form="gigsPortingEmbedForm">Submit</button>
    </div>
  )
}

describe('first name', () => {
  it('is shown when required', () => {
    const porting = portingFactory.build({ required: ['firstName'] })
    render(<StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
  })

  it('is hidden when not required', () => {
    const porting = portingFactory.build({ required: [] })
    render(<StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.queryByLabelText('First Name')).not.toBeInTheDocument()
  })

  it('prefills the existing value', () => {
    const porting = portingFactory.build({
      required: ['firstName'],
      firstName: 'first',
    })
    render(<StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('First Name')).toHaveValue('first')
  })

  it('trims the value while entering data', async () => {
    const porting = portingFactory.build({ required: ['firstName'] })
    const user = userEvent.setup()
    render(<StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })

    await user.type(screen.getByLabelText('First Name'), '  fir st  ')
    // still allows users to type spaces at the end, otherwise you can't type
    // any spaces
    expect(screen.getByLabelText('First Name')).toHaveValue('fir st  ')
  })

  it('trims the value when submitting', async () => {
    const porting = portingFactory.build({ required: ['firstName'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepHolderDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.type(screen.getByLabelText('First Name'), '  fir st  ')
    await user.click(screen.getByRole('button'))
    expect(submit).toHaveBeenCalledWith({ firstName: 'fir st' })
  })

  it('shows an error on submit when left empty', async () => {
    const porting = portingFactory.build({ required: ['firstName'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepHolderDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.click(screen.getByRole('button'))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
  })

  it('cannot be submitted with only spaces', async () => {
    const porting = portingFactory.build({ required: ['firstName'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepHolderDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.type(screen.getByLabelText('First Name'), '  ')
    await user.click(screen.getByRole('button'))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
  })

  it('fires validation events', async () => {
    const porting = portingFactory.build({ required: ['firstName'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    const validate = vi.fn()
    render(
      <StepHolderDetailsForm
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
    await user.clear(screen.getByLabelText('First Name'))
    await user.tab()
    expect(validate).toHaveBeenLastCalledWith({ isValid: false })
    await user.type(screen.getByLabelText('First Name'), 'first')
    expect(validate).toHaveBeenLastCalledWith({ isValid: true })
  })
})

describe('last name', () => {
  it('is shown when required', () => {
    const porting = portingFactory.build({ required: ['lastName'] })
    render(<StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
  })

  it('is hidden when not required', () => {
    const porting = portingFactory.build({ required: [] })
    render(<StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.queryByLabelText('Last Name')).not.toBeInTheDocument()
  })

  it('prefills the existing value', () => {
    const porting = portingFactory.build({
      required: ['lastName'],
      lastName: 'last',
    })
    render(<StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('Last Name')).toHaveValue('last')
  })

  it('trims the value while entering data', async () => {
    const porting = portingFactory.build({ required: ['lastName'] })
    const user = userEvent.setup()
    render(<StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })

    await user.type(screen.getByLabelText('Last Name'), '  la st  ')
    // still allows users to type spaces at the end, otherwise you can't type
    // any spaces
    expect(screen.getByLabelText('Last Name')).toHaveValue('la st  ')
  })

  it('trims the value when submitting', async () => {
    const porting = portingFactory.build({ required: ['lastName'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepHolderDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.type(screen.getByLabelText('Last Name'), '  la st  ')
    await user.click(screen.getByRole('button'))
    expect(submit).toHaveBeenCalledWith({ lastName: 'la st' })
  })

  it('shows an error on submit when left empty', async () => {
    const porting = portingFactory.build({ required: ['lastName'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepHolderDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.click(screen.getByRole('button'))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
  })

  it('cannot be submitted with only spaces', async () => {
    const porting = portingFactory.build({ required: ['lastName'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepHolderDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.type(screen.getByLabelText('Last Name'), '  ')
    await user.click(screen.getByRole('button'))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
  })

  it('fires validation events', async () => {
    const porting = portingFactory.build({ required: ['lastName'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    const validate = vi.fn()
    render(
      <StepHolderDetailsForm
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
    await user.clear(screen.getByLabelText('Last Name'))
    await user.tab()
    expect(validate).toHaveBeenLastCalledWith({ isValid: false })
    await user.type(screen.getByLabelText('Last Name'), 'last')
    expect(validate).toHaveBeenLastCalledWith({ isValid: true })
  })
})

describe('birthday', () => {
  it('is shown when required', () => {
    const porting = portingFactory.build({ required: ['birthday'] })
    render(<StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('Birthday')).toBeInTheDocument()
  })

  it('is hidden when not required', () => {
    const porting = portingFactory.build({ required: [] })
    render(<StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.queryByLabelText('Birthday')).not.toBeInTheDocument()
  })

  it('prefills the existing value', () => {
    const porting = portingFactory.build({
      required: ['birthday'],
      birthday: '1954-04-29',
    })
    render(<StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('Birthday')).toHaveValue('1954-04-29')
  })

  it('shows an error on submit when left empty', async () => {
    const porting = portingFactory.build({ required: ['birthday'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepHolderDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.click(screen.getByRole('button'))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText(/birthday is required/i)).toBeInTheDocument()
  })

  it('can enter and submit a valid date', async () => {
    const porting = portingFactory.build({ required: ['birthday'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepHolderDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.type(screen.getByLabelText('Birthday'), '1954-04-29')
    await user.click(screen.getByRole('button'))
    expect(submit).toHaveBeenCalledWith({ birthday: '1954-04-29' })
  })

  it('shows an error on submit with an invalid date', async () => {
    const porting = portingFactory.build({ required: ['birthday'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<StepHolderDetailsForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })

    await user.type(screen.getByLabelText('Birthday'), '1954-04')
    await user.click(screen.getByRole('button'))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText(/birthday is required/i)).toBeInTheDocument()
  })

  it('fires validation events', async () => {
    const porting = portingFactory.build({ required: ['birthday'] })
    const user = userEvent.setup()
    const submit = vi.fn()
    const validate = vi.fn()
    render(
      <StepHolderDetailsForm
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
    await user.clear(screen.getByLabelText('Birthday'))
    await user.tab()
    expect(validate).toHaveBeenLastCalledWith({ isValid: false })
    await user.type(screen.getByLabelText('Birthday'), '1954-04-29')
    expect(validate).toHaveBeenLastCalledWith({ isValid: true })
  })
})

describe('form id', () => {
  it('has the default form id', () => {
    const porting = portingFactory.build({ required: ['firstName'] })
    render(<StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByRole('form')).toHaveAttribute(
      'id',
      'gigsPortingEmbedForm',
    )
  })

  it('uses a custom form id', () => {
    const porting = portingFactory.build({ required: ['firstName'] })
    render(
      <OptionsContext.Provider value={{ formId: 'customFormId' }}>
        <StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveAttribute('id', 'customFormId')
  })
})

describe('form class names', () => {
  it('includes default class names', () => {
    const porting = portingFactory.build({ required: ['firstName'] })
    render(<StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByRole('form')).toHaveClass(
      'GigsEmbeds',
      'GigsPortingEmbed',
      'GigsEmbeds-form',
    )
  })

  it('allows to specify a custom class name', () => {
    const porting = portingFactory.build({ required: ['firstName'] })
    render(
      <OptionsContext.Provider
        value={{ className: { form: () => 'custom-class-name' } }}
      >
        <StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-name')
  })

  it('passes the form name to the custom class name', () => {
    const porting = portingFactory.build({ required: ['firstName'] })
    render(
      <OptionsContext.Provider
        value={{ className: { form: ({ name }) => `custom-class-${name}` } }}
      >
        <StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-holderDetails')
  })

  it('allows a custom class for the touched state', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['firstName'] })
    render(
      <OptionsContext.Provider
        value={{
          className: {
            form: ({ touched }) =>
              `custom-class-${touched ? 'touched' : 'untouched'}`,
          },
        }}
      >
        <StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-untouched')
    await user.click(screen.getByLabelText('First Name'))
    await user.tab()
    expect(screen.getByRole('form')).toHaveClass('custom-class-touched')
  })

  it('allows a custom class for the dirty state', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['firstName'] })
    render(
      <OptionsContext.Provider
        value={{
          className: {
            form: ({ dirty }) => `custom-class-${dirty ? 'dirty' : 'undirty'}`,
          },
        }}
      >
        <StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-undirty')
    await user.type(screen.getByLabelText('First Name'), 'first')
    expect(screen.getByRole('form')).toHaveClass('custom-class-dirty')
  })

  it('allows a custom class for the valid state', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['firstName'] })
    render(
      <OptionsContext.Provider
        value={{
          className: {
            form: ({ valid }) => `custom-class-${valid ? 'valid' : 'invalid'}`,
          },
        }}
      >
        <StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-valid')
    await user.click(screen.getByLabelText('First Name'))
    await user.tab()
    expect(screen.getByRole('form')).toHaveClass('custom-class-invalid')
  })

  it('allows a custom class for the submitting state', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['firstName'] })
    render(
      <OptionsContext.Provider
        value={{
          className: {
            form: ({ submitting }) =>
              `custom-class-${submitting ? 'submitting' : 'idle'}`,
          },
        }}
      >
        <StepHolderDetailsForm
          porting={porting}
          onSubmit={async () => {
            await new Promise<1>((resolve) => setTimeout(() => resolve(1), 1))
          }}
        />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-idle')
    await user.type(screen.getByLabelText('First Name'), 'first')
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('form')).toHaveClass('custom-class-submitting')
  })
})

describe('custom labels', () => {
  it('allows to specify custom labels', () => {
    const porting = portingFactory.build({
      required: ['firstName', 'lastName', 'birthday'],
    })
    render(
      <OptionsContext.Provider
        value={{
          text: {
            'field.firstName.label': 'FN',
            'field.lastName.label': 'LN',
            'field.birthday.label': 'BD',
          },
        }}
      >
        <StepHolderDetailsForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByLabelText('FN')).toBeInTheDocument()
    expect(screen.getByLabelText('LN')).toBeInTheDocument()
    expect(screen.getByLabelText('BD')).toBeInTheDocument()
  })
})
