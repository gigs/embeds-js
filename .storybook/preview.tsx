import React from 'react'
import type { Preview } from '@storybook/preact'

import './styles.css'
import '../lib/styles/styles.css'

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="GigsEmbeds-root">
        {/* @ts-expect-error */}
        {Story()}
      </div>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
