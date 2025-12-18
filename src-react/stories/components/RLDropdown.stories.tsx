import type { Meta, StoryObj } from '@storybook/react'
import { RLDropdown } from '../../components'

const meta = {
  title: 'Components/Dropdown',
  component: RLDropdown,
  tags: ['autodocs'],
  args: {
    label: 'Favorite music genres (RLDropdown)',
    options: [
      { value: 'station-levels', text: 'Stations Levels' },
      { value: 'trains', text: 'Trains' },
      { value: 'sections', text: 'Sections' },
      { value: 'building-levels', text: 'Buildings Levels' }
    ],
    dropdown: true,
    manual: true,
    multiple: true
  }
} satisfies Meta<typeof RLDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Main: Story = {}
