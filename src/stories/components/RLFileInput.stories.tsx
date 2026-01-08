import type { Meta, StoryObj } from '@storybook/react'
import { RLFileInput } from '../../components'
import { useState } from 'react';

const meta = {
  title: 'Components/File input',
  component: RLFileInput,
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'text' }
  },
  render: (args) => {
    const [state, setState] = useState<File | File[] | null>(null);
    return <RLFileInput {...args} value={state} onChange={setState} />
  }
} satisfies Meta<typeof RLFileInput>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: 'File Upload (RLFileInput)',
    placeholder: 'Select a file...',
    name: 'file'
  }
}

export const Multiple: Story = {
  args: {
    label: 'File Upload (RLFileInput)',
    placeholder: 'Select a file...',
    name: 'file',
    multiple: true,
    fileLimit: 2,
    onError: (error: unknown) => {
      console.log('Error: ', error)
    }
  }
}
