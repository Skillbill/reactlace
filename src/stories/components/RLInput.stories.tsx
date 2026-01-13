import type { Meta, StoryObj } from '@storybook/react'
import { RLInput } from '../../components'
import { useState } from 'react'

const meta = {
  title: 'Components/Input',
  component: RLInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large', undefined] },
    type: { control: 'select', options: ['password', 'text', 'email', undefined] },
    autocapitalize: {
      control: 'select',
      options: ['off', 'none', 'on', 'sentences', 'words', 'characters', undefined]
    },
    autocorrect: { control: 'select', options: ['off', 'on', undefined] },
    inputmode: { control: 'select', options: ['none', 'text', 'email', undefined] }
  },
  render(args) {
    const [inputValue, setInputValue] = useState<string | undefined>(undefined)

    return (
      <RLInput
        {...args}
        value={inputValue}
        onChange={setInputValue}
      />
    )
  }
} satisfies Meta<typeof RLInput>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: 'Name (RLInput)',
    rules: [
      {
        validateFn: (value: unknown) => value && (value as string).length > 0,
        message: 'The value is required'
      },
      {
        validateFn: (value: unknown) => (value as string).length > 1,
        message: 'The value must be at least 2 characters long'
      }
    ]
  }
}
