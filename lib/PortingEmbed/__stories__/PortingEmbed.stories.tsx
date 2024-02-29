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
    porting: portingFactory.build({
      required: [
        'accountNumber',
        'accountPin',
        'address',
        'firstName',
        'lastName',
        'birthday',
        'donorProviderApproval',
      ],
    }),
  },
}

export const MissingHolderPorting = {
  args: {
    porting: portingFactory
      .params({
        required: [
          'accountNumber',
          'accountPin',
          'address',
          'firstName',
          'lastName',
          'birthday',
          'donorProviderApproval',
        ],
        accountNumber: '1234',
        accountPinExists: true,
      })
      .build(),
  },
}

export const MissingAddressPorting = {
  args: {
    porting: portingFactory
      .params({
        required: [
          'accountNumber',
          'accountPin',
          'address',
          'firstName',
          'lastName',
          'birthday',
          'donorProviderApproval',
        ],
        accountNumber: '1234',
        accountPinExists: true,
        firstName: 'first',
        lastName: 'last',
        birthday: '1954-04-29',
      })
      .build(),
  },
}

export const MissingDonorProviderApprovalPorting = {
  args: {
    porting: portingFactory
      .params({
        required: [
          'accountNumber',
          'accountPin',
          'address',
          'firstName',
          'lastName',
          'birthday',
          'donorProviderApproval',
        ],
        accountNumber: '1234',
        accountPinExists: true,
        firstName: 'first',
        lastName: 'last',
        birthday: '1954-04-29',
        address: {},
      })
      .build(),
  },
}
