import type { Meta, StoryObj } from '@storybook/react'
import { RLSelect } from '../../components'

const meta = {
  title: 'Components/Select',
  component: RLSelect,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large', undefined] },
    placement: { control: 'select', options: ['top', 'bottom', undefined] }
  },
  args: {
    label: 'Favorite music genres (RLSelect)',
    placeholder: 'Select your favorite music genre...',
    options: [
      { value: 'dance', text: 'Dance' },
      { value: 'rock', text: 'Rock' },
      { value: 'pop', text: 'Pop' },
      { value: 'indie', text: 'Indie' },
      { value: 'classic', text: 'Classic' },
      { value: 'country', text: 'Country' },
      { value: 'jazz', text: 'Jazz' },
      { value: 'others', text: 'Others...' }
    ]
  }
} satisfies Meta<typeof RLSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Multiple: Story = {
  args: {
    multiple: true
  }
}
