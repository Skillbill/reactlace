import type { Meta, StoryObj } from '@storybook/react'
import { RLTooltip } from '../../components'

const meta = {
  title: 'Components/Tooltip',
  component: RLTooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'right',
        'right-start',
        'right-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end'
      ]
    }
  },
  args: {
    children: 'Hover me',
    hoist: true
  }
} satisfies Meta<typeof RLTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Medium: Story = {
  args: {
    content: 'tooltip!!!'
  }
}
