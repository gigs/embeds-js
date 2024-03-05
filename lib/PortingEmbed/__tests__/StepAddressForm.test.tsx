import { render, screen } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'

import { portingFactory } from '@/testing/factories/porting'

import { OptionsContext } from '../Options'
import { StepAddressForm } from '../StepAddressForm'

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <button form="gigsPortingEmbedForm">Submit</button>
    </div>
  )
}

const address = {
  line1: 'line1',
  line2: 'line2',
  city: 'city',
  postalCode: 'pc123',
  state: 'ST',
  country: 'CO',
}

describe('line1', () => {
  it('exists', async () => {
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('Line 1')).toBeInTheDocument()
  })

  it('can be prefilled', () => {
    const porting = portingFactory.build({
      required: ['address'],
      address: { line1: 'line1' },
    })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('Line 1')).toHaveValue('line1')
  })

  it('is trimmed', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    await user.type(screen.getByLabelText('Line 1'), '  line1  ')
    expect(screen.getByLabelText('Line 1')).toHaveValue('line1  ')
  })

  it('is required', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['address'],
      address: { ...address, line1: undefined },
    })
    const submit = vi.fn()
    render(<StepAddressForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })
    await user.click(screen.getByRole('button'))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText(/Line 1 is required/)).toBeInTheDocument()
  })

  it('can be submitted', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['address'],
      address: { ...address, line1: undefined },
    })
    const submit = vi.fn()
    render(<StepAddressForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })
    await user.type(screen.getByLabelText('Line 1'), 'newline1')
    await user.click(screen.getByRole('button'))
    expect(submit).toHaveBeenCalledWith({ ...address, line1: 'newline1' })
  })
})

describe('line2', () => {
  it('exists', async () => {
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('Line 2')).toBeInTheDocument()
  })

  it('can be prefilled', () => {
    const porting = portingFactory.build({
      required: ['address'],
      address: { line2: 'line2' },
    })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('Line 2')).toHaveValue('line2')
  })

  it('is trimmed', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    await user.type(screen.getByLabelText('Line 2'), '  line2  ')
    expect(screen.getByLabelText('Line 2')).toHaveValue('line2  ')
  })

  it('is not required', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['address'],
      address: { ...address, line2: undefined },
    })
    const submit = vi.fn()
    render(<StepAddressForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })
    await user.click(screen.getByRole('button'))
    expect(submit).toHaveBeenCalledWith({ ...address, line2: null })
  })

  it('can be submitted', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['address'],
      address: { ...address, line2: undefined },
    })
    const submit = vi.fn()
    render(<StepAddressForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })
    await user.type(screen.getByLabelText('Line 2'), 'newline2')
    await user.click(screen.getByRole('button'))
    expect(submit).toHaveBeenCalledWith({ ...address, line2: 'newline2' })
  })
})

describe('city', () => {
  it('exists', async () => {
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('City')).toBeInTheDocument()
  })

  it('can be prefilled', () => {
    const porting = portingFactory.build({
      required: ['address'],
      address: { city: 'city' },
    })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('City')).toHaveValue('city')
  })

  it('is trimmed', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    await user.type(screen.getByLabelText('City'), '  city  ')
    expect(screen.getByLabelText('City')).toHaveValue('city  ')
  })

  it('is required', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['address'],
      address: { ...address, city: undefined },
    })
    const submit = vi.fn()
    render(<StepAddressForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })
    await user.click(screen.getByRole('button'))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText(/City is required/)).toBeInTheDocument()
  })

  it('can be submitted', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['address'],
      address: { ...address, city: undefined },
    })
    const submit = vi.fn()
    render(<StepAddressForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })
    await user.type(screen.getByLabelText('City'), 'newcity')
    await user.click(screen.getByRole('button'))
    expect(submit).toHaveBeenCalledWith({ ...address, city: 'newcity' })
  })
})

describe('postal code', () => {
  it('exists', async () => {
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('Postal Code')).toBeInTheDocument()
  })

  it('can be prefilled', () => {
    const porting = portingFactory.build({
      required: ['address'],
      address: { postalCode: 'pc123' },
    })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText('Postal Code')).toHaveValue('pc123')
  })

  it('is trimmed', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    await user.type(screen.getByLabelText('Postal Code'), '  pc123  ')
    expect(screen.getByLabelText('Postal Code')).toHaveValue('pc123  ')
  })

  it('is required', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['address'],
      address: { ...address, postalCode: undefined },
    })
    const submit = vi.fn()
    render(<StepAddressForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })
    await user.click(screen.getByRole('button'))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText(/Postal Code is required/)).toBeInTheDocument()
  })

  it('can be submitted', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['address'],
      address: { ...address, postalCode: undefined },
    })
    const submit = vi.fn()
    render(<StepAddressForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })
    await user.type(screen.getByLabelText('Postal Code'), 'newpc123')
    await user.click(screen.getByRole('button'))
    expect(submit).toHaveBeenCalledWith({ ...address, postalCode: 'newpc123' })
  })
})

describe('state', () => {
  it('exists', async () => {
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText(/State/)).toBeInTheDocument()
  })

  it('can be prefilled', () => {
    const porting = portingFactory.build({
      required: ['address'],
      address: { state: 'state' },
    })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText(/State/)).toHaveValue('state')
  })

  it('is trimmed and uppercased', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    await user.type(screen.getByLabelText(/State/), '  st  ')
    expect(screen.getByLabelText(/State/)).toHaveValue('ST  ')
  })

  it('must be an ISO code', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    await user.type(screen.getByLabelText(/State/), 'hello world')
    await user.click(screen.getByRole('button'))
    expect(screen.getByText(/must be an iso state code/i)).toBeInTheDocument()
  })

  it('is not required', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['address'],
      address: { ...address, state: undefined },
    })
    const submit = vi.fn()
    render(<StepAddressForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })
    await user.click(screen.getByRole('button'))
    expect(submit).toHaveBeenCalledWith({ ...address, state: null })
  })

  it('can be submitted', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['address'],
      address: { ...address, state: undefined },
    })
    const submit = vi.fn()
    render(<StepAddressForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })
    await user.type(screen.getByLabelText(/State/), 'nst')
    await user.click(screen.getByRole('button'))
    expect(submit).toHaveBeenCalledWith({ ...address, state: 'NST' })
  })
})

describe('country', () => {
  it('exists', async () => {
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText(/Country/)).toBeInTheDocument()
  })

  it('can be prefilled', () => {
    const porting = portingFactory.build({
      required: ['address'],
      address: { country: 'CO' },
    })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByLabelText(/Country/)).toHaveValue('CO')
  })

  it('is trimmed and uppercased', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    await user.type(screen.getByLabelText(/Country/), '  co  ')
    expect(screen.getByLabelText(/Country/)).toHaveValue('CO  ')
  })

  it('must be an ISO code', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    await user.type(screen.getByLabelText(/Country/), 'hello world')
    await user.click(screen.getByRole('button'))
    expect(screen.getByText(/must be an iso country code/i)).toBeInTheDocument()
  })

  it('is required', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['address'],
      address: { ...address, country: undefined },
    })
    const submit = vi.fn()
    render(<StepAddressForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })
    await user.click(screen.getByRole('button'))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText(/Country is required/)).toBeInTheDocument()
  })

  it('can be submitted', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['address'],
      address: { ...address, country: undefined },
    })
    const submit = vi.fn()
    render(<StepAddressForm porting={porting} onSubmit={submit} />, {
      wrapper,
    })
    await user.type(screen.getByLabelText(/Country/), 'nc')
    await user.click(screen.getByRole('button'))
    expect(submit).toHaveBeenCalledWith({ ...address, country: 'NC' })
  })
})

describe('form id', () => {
  it('has the default form id', () => {
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByRole('form')).toHaveAttribute(
      'id',
      'gigsPortingEmbedForm',
    )
  })

  it('uses a custom form id', () => {
    const porting = portingFactory.build({ required: ['address'] })
    render(
      <OptionsContext.Provider value={{ formId: 'customFormId' }}>
        <StepAddressForm porting={porting} onSubmit={vi.fn()} />
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
    const porting = portingFactory.build({ required: ['address'] })
    render(<StepAddressForm porting={porting} onSubmit={vi.fn()} />, {
      wrapper,
    })
    expect(screen.getByRole('form')).toHaveClass(
      'GigsEmbeds',
      'GigsPortingEmbed',
      'GigsEmbeds-form',
    )
  })

  it('allows to specify a custom class name', () => {
    const porting = portingFactory.build({ required: ['address'] })
    render(
      <OptionsContext.Provider
        value={{ className: { form: () => 'custom-class-name' } }}
      >
        <StepAddressForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-name')
  })

  it('passes the form name to the custom class name', () => {
    const porting = portingFactory.build({ required: ['address'] })
    render(
      <OptionsContext.Provider
        value={{ className: { form: ({ name }) => `custom-class-${name}` } }}
      >
        <StepAddressForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-address')
  })

  it('allows a custom class for the touched state', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['address'] })
    render(
      <OptionsContext.Provider
        value={{
          className: {
            form: ({ touched }) =>
              `custom-class-${touched ? 'touched' : 'untouched'}`,
          },
        }}
      >
        <StepAddressForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-untouched')
    await user.click(screen.getByLabelText('Line 1'))
    await user.tab()
    expect(screen.getByRole('form')).toHaveClass('custom-class-touched')
  })

  it('allows a custom class for the dirty state', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['address'] })
    render(
      <OptionsContext.Provider
        value={{
          className: {
            form: ({ dirty }) => `custom-class-${dirty ? 'dirty' : 'undirty'}`,
          },
        }}
      >
        <StepAddressForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-undirty')
    await user.type(screen.getByLabelText('Line 1'), 'a')
    expect(screen.getByRole('form')).toHaveClass('custom-class-dirty')
  })

  it('allows a custom class for the valid state', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['address'] })
    render(
      <OptionsContext.Provider
        value={{
          className: {
            form: ({ valid }) => `custom-class-${valid ? 'valid' : 'invalid'}`,
          },
        }}
      >
        <StepAddressForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-valid')
    await user.click(screen.getByLabelText('Line 1'))
    await user.tab()
    expect(screen.getByRole('form')).toHaveClass('custom-class-invalid')
  })

  it('allows a custom class for the submitting state', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({ required: ['address'] })
    render(
      <OptionsContext.Provider
        value={{
          className: {
            form: ({ submitting }) =>
              `custom-class-${submitting ? 'submitting' : 'idle'}`,
          },
        }}
      >
        <StepAddressForm
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
    await user.type(screen.getByLabelText('Line 1'), 'line1')
    await user.type(screen.getByLabelText('City'), 'city')
    await user.type(screen.getByLabelText('Postal Code'), 'pc123')
    await user.type(screen.getByLabelText(/Country/), 'CO')
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('form')).toHaveClass('custom-class-submitting')
  })
})

describe('custom labels', () => {
  it('allows to specify custom labels', () => {
    const porting = portingFactory.build({ required: ['address'] })
    render(
      <OptionsContext.Provider
        value={{
          text: {
            'field.line1.label': 'L1',
            'field.line2.label': 'L2',
            'field.city.label': 'CI',
            'field.postalCode.label': 'PC',
            'field.state.label': 'ST',
            'field.country.label': 'CO',
          },
        }}
      >
        <StepAddressForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByLabelText('L1')).toBeInTheDocument()
    expect(screen.getByLabelText('L2')).toBeInTheDocument()
    expect(screen.getByLabelText('CI')).toBeInTheDocument()
    expect(screen.getByLabelText('PC')).toBeInTheDocument()
    expect(screen.getByLabelText('ST')).toBeInTheDocument()
    expect(screen.getByLabelText('CO')).toBeInTheDocument()
  })
})
