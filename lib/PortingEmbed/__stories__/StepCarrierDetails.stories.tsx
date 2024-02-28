import { Meta } from '@storybook/preact'

import { portingFactory } from '@/testing/factories/porting'

import { StepCarrierDetailsForm } from '../StepCarrierDetailsForm'

const meta: Meta<typeof StepCarrierDetailsForm> = {
  title: 'Porting/StepCarrierDetailsForm',
  component: StepCarrierDetailsForm,
  tags: ['autodocs'],
  argTypes: {
    porting: { control: 'text' },
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
      required: ['accountNumber', 'accountPin'],
    }),
  },
}

export const Prefilled = {
  args: {
    porting: portingFactory.build({
      required: ['accountNumber', 'accountPin'],
      accountNumber: '1337',
      accountPinExists: true,
    }),
  },
}
