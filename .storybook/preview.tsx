import type { Preview } from '@storybook/react'
import React from 'react'

import { ReactlaceProvider } from '../src/context'
import '../src/assets/main.css'

// PrimeReact theme
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    (Story) => (
      <ReactlaceProvider>
        <Story />
      </ReactlaceProvider>
    )
  ]
}

export default preview
