import type { Meta, StoryObj } from '@storybook/react'
import { UsersCrudExample } from '../../components/examples'

const meta = {
  title: 'Examples/UsersCrud',
  component: UsersCrudExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof UsersCrudExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
