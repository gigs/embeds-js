import { WelcomeEmbed } from '../WelcomeEmbed'

export default {
  title: 'Example/WelcomeEmbed',
  component: WelcomeEmbed,
  tags: ['autodocs'],
  argTypes: {
    token: { control: 'text' },
    name: { control: 'text' },
    onCounterChange: { action: 'counterChange' },
  },
}

export const Primary = {
  args: {
    token: 'abc:123',
    name: 'Jerry',
  },
}
