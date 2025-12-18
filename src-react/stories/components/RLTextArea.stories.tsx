import type { Meta, StoryObj } from '@storybook/react'
import { RLTextArea } from '../../components'

const meta = {
  title: 'Components/TextArea',
  component: RLTextArea,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', undefined]
    },
    autocapitalize: {
      control: 'select',
      options: ['off', 'none', 'on', 'sentences', 'words', 'characters', undefined]
    },
    autocorrect: {
      control: 'select',
      options: ['off', 'on', undefined]
    },
    resize: { control: 'select', options: ['auto', 'none', 'vertical', undefined] }
  }
} satisfies Meta<typeof RLTextArea>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: 'Description (RLTextArea)'
  }
}
