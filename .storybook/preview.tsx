import './styles.css'
import '../lib/styles/styles.css'

import type { Preview } from '@storybook/preact'
import React from 'react'

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="GigsEmbeds-root">
        {/* @ts-expect-error Fix Node ReactNode mismatch */}
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
