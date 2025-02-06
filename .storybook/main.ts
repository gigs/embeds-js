import type { StorybookConfig } from '@storybook/preact-vite'

const config: StorybookConfig = {
  stories: ['../lib/**/*.mdx', '../lib/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/preact-vite',
    options: {},
  },
  docs: {},
}
export default config
