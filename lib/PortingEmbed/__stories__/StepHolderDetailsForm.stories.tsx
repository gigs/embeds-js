import { Meta } from '@storybook/preact'

import { portingFactory } from '@/testing/factories/porting'

import { StepHolderDetailsForm } from '../StepHolderDetailsForm'

const meta: Meta<typeof StepHolderDetailsForm> = {
  title: 'Porting/StepHolderDetailsForm',
  component: StepHolderDetailsForm,
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
      required: ['firstName', 'lastName', 'birthday'],
    }),
  },
}

export const Prefilled = {
  args: {
    porting: portingFactory.build({
      required: ['firstName', 'lastName', 'birthday'],
      firstName: 'Jerry',
      lastName: 'Seinfeld',
      birthday: '1954-04-29',
    }),
  },
}
