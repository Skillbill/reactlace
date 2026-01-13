import type { Meta, StoryObj } from '@storybook/react'
import { RLExpansionCard } from '../../components'

const meta = {
  title: 'Components/ExpansionCard',
  component: RLExpansionCard,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    title: 'Expansion Card Title',
    children: 'This is the content of the expansion card. It can contain any React elements.'
  }
} satisfies Meta<typeof RLExpansionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}

export const Open: Story = {
  args: {
    open: true
  }
}

export const CustomTitle: Story = {
  args: {
    title: 'Custom Expansion Card',
    children: (
      <div>
        <p>This expansion card has custom content.</p>
        <p>You can add multiple paragraphs or any React components here.</p>
      </div>
    )
  }
}
