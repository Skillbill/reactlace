import type { Meta, StoryObj } from '@storybook/react'
import { RLAutocomplete } from '../../components'

const meta = {
  title: 'Components/Autocomplete',
  component: RLAutocomplete,
  tags: ['autodocs'],
  args: {
    label: 'Favorite music genres (RLAutocomplete)',
    options: [
      { value: 'station-levels', text: 'Stations Levels' },
      { value: 'trains', text: 'Trains' },
      { value: 'sections', text: 'Sections' },
      { value: 'building-levels', text: 'Buildings Levels' }
    ],
    emptySearchMessage: 'Nothing found'
  }
} satisfies Meta<typeof RLAutocomplete>

export default meta
type Story = StoryObj<typeof meta>

export const Main: Story = {}
