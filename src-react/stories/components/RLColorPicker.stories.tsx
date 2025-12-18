import type { Meta, StoryObj } from '@storybook/react'
import { RLColorPicker } from '../../components'

const meta = {
  title: 'Components/Color picker',
  component: RLColorPicker,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large', undefined] }
  },
  args: { label: 'Select a color (RLColorPicker)' }
} satisfies Meta<typeof RLColorPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {}
}
