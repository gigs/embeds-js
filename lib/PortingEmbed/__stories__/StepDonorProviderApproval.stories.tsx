import { Meta } from '@storybook/preact'

import { portingFactory } from '@/testing/factories/porting'

import { StepDonorProviderApprovalForm } from '../StepDonorProviderApprovalForm'

const meta: Meta<typeof StepDonorProviderApprovalForm> = {
  title: 'Porting/StepDonorProviderApprovalForm',
  component: StepDonorProviderApprovalForm,
  tags: ['autodocs'],
  argTypes: {
    porting: { control: 'object' },
    onValidationChange: { action: 'onValidationChange' },
    onSubmit: { action: 'onSubmit' },
  },
  decorators: [
    (Story) => (
      <div>
        {Story()}
        <button form="gigsPortingEmbedForm" type="submit">
          Submit!
        </button>
      </div>
    ),
  ],
}

export default meta

export const Empty = {
  args: {
    porting: portingFactory.build({
      required: ['donorProviderApproval'],
    }),
  },
}

export const Prefilled = {
  args: {
    porting: portingFactory.build({
      required: ['donorProviderApproval'],
      donorProviderApproval: true,
    }),
  },
}
