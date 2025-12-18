import type { Meta, StoryObj } from '@storybook/react'
import { RLImageUpload } from '../../components'

const meta = {
  title: 'Components/Image upload',
  component: RLImageUpload,
  tags: ['autodocs']
} satisfies Meta<typeof RLImageUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: 'Profile image (RLImageUpload)',
    placeholder: 'Select a file...',
    name: 'file'
  }
}
