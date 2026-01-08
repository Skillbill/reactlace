import type { Meta, StoryObj } from '@storybook/react'
import { RLColorPicker } from '../../components'
import { useState } from 'react'

const meta = {
  title: 'Components/Color picker',
  component: RLColorPicker,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large', undefined] }
  },
  args: { label: 'Select a color (RLColorPicker)' },
  render: (args) => {
      const [state, setState] = useState(args.value || '#000000');

    return <RLColorPicker {...args} value={state} onChange={setState} />
  }
} satisfies Meta<typeof RLColorPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
}
