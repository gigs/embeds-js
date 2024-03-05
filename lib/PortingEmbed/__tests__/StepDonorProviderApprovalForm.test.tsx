import { render, screen } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'

import { portingFactory } from '@/testing/factories/porting'

import { OptionsContext } from '../Options'
import { StepDonorProviderApprovalForm } from '../StepDonorProviderApprovalForm'

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <button form="gigsPortingEmbedForm">Submit</button>
    </div>
  )
}

it('shows a checkbox', () => {
  const porting = portingFactory.build({ required: ['donorProviderApproval'] })
  render(
    <StepDonorProviderApprovalForm porting={porting} onSubmit={vi.fn()} />,
    { wrapper },
  )
  expect(
    screen.getByLabelText(/i have notified my current provider/i),
  ).toBeInTheDocument()
})

it('is initially unchecked', () => {
  const porting = portingFactory.build({ required: ['donorProviderApproval'] })
  render(
    <StepDonorProviderApprovalForm porting={porting} onSubmit={vi.fn()} />,
    { wrapper },
  )
  expect(
    screen.getByLabelText(/i have notified my current provider/i),
  ).not.toBeChecked()
})

it('prefills the existing value', () => {
  const porting = portingFactory.build({
    required: ['donorProviderApproval'],
    donorProviderApproval: true,
  })
  render(
    <StepDonorProviderApprovalForm porting={porting} onSubmit={vi.fn()} />,
    {
      wrapper,
    },
  )
  expect(
    screen.getByLabelText(/i have notified my current provider/i),
  ).toBeChecked()
})

it('can be checked and submitted', async () => {
  const user = userEvent.setup()
  const porting = portingFactory.build({
    required: ['donorProviderApproval'],
  })
  const submit = vi.fn()
  render(
    <StepDonorProviderApprovalForm porting={porting} onSubmit={submit} />,
    { wrapper },
  )

  const checkbox = screen.getByLabelText(/i have notified my current provider/i)
  await user.click(checkbox)
  expect(checkbox).toBeChecked()
  await user.click(screen.getByRole('button', { name: 'Submit' }))
  expect(submit).toHaveBeenCalledWith({ donorProviderApproval: true })
})

it('is required to be checked', async () => {
  const user = userEvent.setup()
  const porting = portingFactory.build({
    required: ['donorProviderApproval'],
  })
  const submit = vi.fn()
  render(
    <StepDonorProviderApprovalForm porting={porting} onSubmit={submit} />,
    { wrapper },
  )

  await user.click(screen.getByRole('button', { name: 'Submit' }))
  expect(submit).not.toHaveBeenCalled()
  expect(screen.getByText(/you must get the approval/i)).toBeInTheDocument()
})

it('fires validation events', async () => {
  const user = userEvent.setup()
  const porting = portingFactory.build({
    required: ['donorProviderApproval'],
  })
  const submit = vi.fn()
  const validate = vi.fn()
  render(
    <StepDonorProviderApprovalForm
      porting={porting}
      onSubmit={submit}
      onValidationChange={validate}
    />,
    { wrapper },
  )

  const checkbox = screen.getByText(/i have notified my current provider/i)

  // initially valid because no validation was done yet
  expect(validate).toHaveBeenLastCalledWith({ isValid: true })
  await user.click(checkbox)
  await user.click(checkbox)
  expect(validate).toHaveBeenLastCalledWith({ isValid: false })
  await user.click(checkbox)
  expect(validate).toHaveBeenLastCalledWith({ isValid: true })
})

describe('form id', () => {
  it('has the default form id', () => {
    const porting = portingFactory.build({
      required: ['donorProviderApproval'],
    })
    render(
      <StepDonorProviderApprovalForm porting={porting} onSubmit={vi.fn()} />,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveAttribute(
      'id',
      'gigsPortingEmbedForm',
    )
  })

  it('uses a custom form id', () => {
    const porting = portingFactory.build({
      required: ['donorProviderApproval'],
    })
    render(
      <OptionsContext.Provider value={{ formId: 'customFormId' }}>
        <StepDonorProviderApprovalForm porting={porting} onSubmit={vi.fn()} />
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
    const porting = portingFactory.build({
      required: ['donorProviderApproval'],
    })
    render(
      <StepDonorProviderApprovalForm porting={porting} onSubmit={vi.fn()} />,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass(
      'GigsEmbeds',
      'GigsPortingEmbed',
      'GigsEmbeds-form',
    )
  })

  it('allows to specify a custom class name', () => {
    const porting = portingFactory.build({
      required: ['donorProviderApproval'],
    })
    render(
      <OptionsContext.Provider
        value={{ className: { form: () => 'custom-class-name' } }}
      >
        <StepDonorProviderApprovalForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-name')
  })

  it('passes the form name to the custom class name', () => {
    const porting = portingFactory.build({
      required: ['donorProviderApproval'],
    })
    render(
      <OptionsContext.Provider
        value={{ className: { form: ({ name }) => `custom-class-${name}` } }}
      >
        <StepDonorProviderApprovalForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass(
      'custom-class-donorProviderApproval',
    )
  })

  it('allows a custom class for the touched state', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['donorProviderApproval'],
    })
    render(
      <OptionsContext.Provider
        value={{
          className: {
            form: ({ touched }) =>
              `custom-class-${touched ? 'touched' : 'untouched'}`,
          },
        }}
      >
        <StepDonorProviderApprovalForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-untouched')
    await user.click(screen.getByLabelText(/i have/i))
    expect(screen.getByRole('form')).toHaveClass('custom-class-touched')
  })

  it('allows a custom class for the dirty state', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['donorProviderApproval'],
    })
    render(
      <OptionsContext.Provider
        value={{
          className: {
            form: ({ dirty }) => `custom-class-${dirty ? 'dirty' : 'undirty'}`,
          },
        }}
      >
        <StepDonorProviderApprovalForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-undirty')
    await user.click(screen.getByLabelText(/i have/i))
    expect(screen.getByRole('form')).toHaveClass('custom-class-dirty')
  })

  it('allows a custom class for the valid state', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['donorProviderApproval'],
    })
    render(
      <OptionsContext.Provider
        value={{
          className: {
            form: ({ valid }) => `custom-class-${valid ? 'valid' : 'invalid'}`,
          },
        }}
      >
        <StepDonorProviderApprovalForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByRole('form')).toHaveClass('custom-class-valid')
    await user.click(screen.getByLabelText(/i have/i))
    await user.click(screen.getByLabelText(/i have/i))
    expect(screen.getByRole('form')).toHaveClass('custom-class-invalid')
  })

  it('allows a custom class for the submitting state', async () => {
    const user = userEvent.setup()
    const porting = portingFactory.build({
      required: ['donorProviderApproval'],
    })
    render(
      <OptionsContext.Provider
        value={{
          className: {
            form: ({ submitting }) =>
              `custom-class-${submitting ? 'submitting' : 'idle'}`,
          },
        }}
      >
        <StepDonorProviderApprovalForm
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
    await user.click(screen.getByLabelText(/i have/i))
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('form')).toHaveClass('custom-class-submitting')
  })
})

describe('custom labels', () => {
  it('allows to specify custom labels', () => {
    const porting = portingFactory.build({
      required: ['donorProviderApproval'],
    })
    render(
      <OptionsContext.Provider
        value={{
          text: {
            'field.donorProviderApproval.label': 'I DO',
          },
        }}
      >
        <StepDonorProviderApprovalForm porting={porting} onSubmit={vi.fn()} />
      </OptionsContext.Provider>,
      {
        wrapper,
      },
    )
    expect(screen.getByLabelText('I DO')).toBeInTheDocument()
  })
})
