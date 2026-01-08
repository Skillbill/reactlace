import type { Meta, StoryObj } from '@storybook/react'
import { RLCheckbox } from '../../components'

const meta = {
  title: 'Components/Checkbox',
  component: RLCheckbox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large', undefined] }
  },
  args: {}
} satisfies Meta<typeof RLCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    checked: true,
    label: 'I agree with the terms and conditions (RLCheckbox)',
    rules: [
      {
        validateFn: (value: unknown) => value === true,
        message: 'The value is required'
      }
    ]
  }
}
