import { render, screen } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'

import { portingFactory } from '@/testing/factories/porting'

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
