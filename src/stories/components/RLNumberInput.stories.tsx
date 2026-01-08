import type { Meta, StoryObj } from '@storybook/react'
import { RLNumberInput } from '../../components'

const meta = {
  title: 'Components/Number input',
  component: RLNumberInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large', undefined] }
  },
  args: {}
} satisfies Meta<typeof RLNumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: 'Age (RLNumberInput)',
    clearable: true,
    helpText: 'The number must be between 0 and 150',
    rules: [
      {
        validateFn: (value: unknown) => value != undefined,
        message: 'The value is required'
      },
      {
        validateFn: (value: unknown) => (value as number) > 0,
        message: 'The value must be greater than 0'
      },
      {
        validateFn: (value: unknown) => (value as number) <= 150,
        message: 'The number must be less than 150'
      }
    ]
  }
}
