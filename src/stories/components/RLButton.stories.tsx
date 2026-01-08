import type { Meta, StoryObj } from '@storybook/react'
import { RLButton } from '../../components'

const meta = {
  title: 'Components/Button',
  component: RLButton,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large', undefined] },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'neutral', 'warning', 'danger', 'text', undefined]
    },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    target: { control: 'select', options: ['_blank', '_parent', '_self', '_top', undefined] }
  },
  args: { size: 'small', children: 'Click me' }
} satisfies Meta<typeof RLButton>

export default meta
type Story = StoryObj<typeof meta>

export const Medium: Story = {
  args: {
    size: 'medium'
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}

export const Pill: Story = {
  args: {
    pill: true
  }
}

export const Warning: Story = {
  args: {
    variant: 'warning'
  }
}
