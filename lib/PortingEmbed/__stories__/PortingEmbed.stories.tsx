import { portingFactory } from '@/testing/factories/porting'

import { PortingEmbed } from '../PortingEmbed'

export default {
  title: 'Porting Embed/Base',
  component: PortingEmbed,
  tags: ['autodocs'],
  argTypes: {
    token: { control: 'text' },
    initialPorting: { control: 'object' },
  },
}

export const Primary = {
  args: {
    token: 'abc:123',
    initialPorting: portingFactory.build(),
  },
}
