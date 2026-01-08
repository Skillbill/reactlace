import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { RLDialog, RLButton } from '../../components'

const DialogExample = () => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <RLButton onClick={() => setOpen(true)}>Open Dialog</RLButton>
      <RLDialog
        label="Dialog Title"
        open={open}
        onRequestClose={() => setOpen(false)}
      >
        <p>This is the dialog content.</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <RLButton onClick={() => setOpen(false)}>Cancel</RLButton>
          <RLButton variant="primary" onClick={() => setOpen(false)}>Confirm</RLButton>
        </div>
      </RLDialog>
    </div>
  )
}

const meta = {
  title: 'Components/Dialog',
  component: DialogExample,
  tags: ['autodocs']
} satisfies Meta<typeof DialogExample>

export default meta
type Story = StoryObj<typeof meta>

export const Main: Story = {}
