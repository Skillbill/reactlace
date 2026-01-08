import type { Meta, StoryObj } from '@storybook/react'
import { RLDatePicker } from '../../components'
import { useState } from 'react'

const meta = {
  title: 'Components/Date picker',
  component: RLDatePicker,
  tags: ['autodocs'],
  argTypes: {
    selectionMode: { control: 'select', options: ['single', 'range', 'multiple', undefined] }
  },
  args: {},
  render: (args) => {
    const [value, setValue] = useState<Date | Date[] | null>(null)

    return (
      <RLDatePicker
        {...args}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    )
  }
} satisfies Meta<typeof RLDatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: {
    label: 'Date of birth (RLDatePicker)',
    rules: [
      {
        validateFn: (value: unknown) => !!value,
        message: 'The value is required'
      },
      {
        validateFn: (value: unknown) => (value as Date).getTime() < new Date().getTime(),
        message: 'Oh...it seems you are not born yet!'
      }
    ]
  },
}

export const Multiple: Story = {
  args: {
    label: 'Date',
    name: 'DateInput',
    placeholder: 'Select a date...',
    selectionMode: 'multiple'
  }
}

export const Range: Story = {
  args: {
    label: 'Date',
    name: 'DateInput',
    placeholder: 'Select a date...',
    selectionMode: 'range'
  }
}

export const WithTime: Story = {
  args: {
    label: 'Date',
    name: 'DateInput',
    placeholder: 'Select a date and time...',
    withTime: true
  }
}
