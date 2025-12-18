import type { Meta, StoryObj } from '@storybook/react'
import { RLRadioGroup } from '../../components'

const meta = {
  title: 'Components/Radio group',
  component: RLRadioGroup,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large', undefined] }
  },
  args: {
    size: 'small'
  }
} satisfies Meta<typeof RLRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Medium: Story = {
  args: {
    label: 'Favorite pet (RLRadioGroup)',
    options: [
      { value: 'dog', label: 'Dogs' },
      { value: 'cat', label: 'Cats' },
      { value: 'parrot', label: 'Parrots' },
      { value: 'hamster', label: 'Hamsters' }
    ]
  }
}
