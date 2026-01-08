import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { RLDataTableCrud } from '../../components'
import { RLIcon } from '../../components'

interface RowData {
  username: string
  firstName: string
  lastName: string
  active: number
  activation_date: string
  expiration_date: string
}

const ActiveCell = ({ data, field, trueColor }: { data: RowData; field: string; trueColor?: string }) => {
  const value = data[field as keyof RowData]
  return (
    <RLIcon
      name={value ? 'check' : 'close'}
      className={value ? trueColor || 'text-green-500' : 'text-red-500'}
    />
  )
}

const getItems = (): RowData[] => {
  return new Array(40).fill(0).map((_, index) => {
    return {
      username: `user${index}`,
      firstName: `Name${index}`,
      lastName: `LastName${index}`,
      active: index % 2,
      activation_date: '2021-01-01',
      expiration_date: '2025-12-31'
    }
  })
}

const meta = {
  title: 'Components/Data Table',
  component: RLDataTableCrud,
  tags: ['autodocs'],
  argTypes: {
    selectionMode: { control: 'select', options: [undefined, 'single', 'multiple'] }
  },
  args: {}
} satisfies Meta<typeof RLDataTableCrud>

export default meta
type Story = StoryObj<typeof meta>

export const Simple: Story = {
  args: {
    columns: [
      {
        name: 'Username',
        value: 'username'
      },
      {
        name: 'First name',
        value: 'firstName',
        sortable: true
      },
      {
        name: 'Last name',
        value: 'lastName'
      },
      {
        name: 'Active',
        value: 'active',
        component: ActiveCell,
        componentProps: {
          trueColor: 'text-yellow-500'
        }
      },
      {
        name: 'Activation Date',
        value: 'activation_date'
      },
      {
        name: 'Expiration Date',
        value: 'expiration_date'
      }
    ],
    actions: [],
    items: getItems()
  }
}
