import { Meta } from '@storybook/preact'

import { portingFactory } from '@/testing/factories/porting'

import { StepAddressForm } from '../StepAddressForm'

const meta: Meta<typeof StepAddressForm> = {
  title: 'Porting/StepAddressForm',
  component: StepAddressForm,
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
      required: ['address'],
    }),
  },
}

export const Prefilled = {
  args: {
    porting: portingFactory.build({
      required: ['address'],
      address: {
        line1: 'line1',
        line2: null,
        city: 'city',
        postalCode: 'pc123',
        state: 'ST',
        country: 'CO',
      },
    }),
  },
}
