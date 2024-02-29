import { Meta } from '@storybook/preact'

import { portingFactory } from '@/testing/factories/porting'

import { PortingEmbed } from '../PortingEmbed'

const meta: Meta<typeof PortingEmbed> = {
  title: 'Porting/Embed',
  component: PortingEmbed,
  tags: ['autodocs'],
  argTypes: {
    porting: { control: 'object' },
    onPortingUpdate: { action: 'onPortingUpdate' },
    onValidationChange: { action: 'onValidationChange' },
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

export const EmptyPorting = {
  args: {
    porting: portingFactory.build(),
  },
}

export const PrefilledPorting = {
  args: {
    porting: portingFactory
      .params({
        accountNumber: '1234',
        accountPinExists: true,
        birthday: '01.01.1990',
        firstName: 'Jane',
        lastName: 'Doe',
      })
      .build(),
  },
}
