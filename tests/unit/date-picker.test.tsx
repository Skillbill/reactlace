import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { RLDatePicker } from '../../src/components/RLDatePicker'
import { textField } from './helpers'

// RLDatePicker shows its value through a read-only RLInput
test('RLDatePicker shows the date it is given and follows its changes', async () => {
  const { container, rerender } = render(<RLDatePicker label="Date" value={new Date(2026, 9, 15)} />)
  const field = await textField(container)
  expect(field.value).toBe('15-10-2026')

  rerender(<RLDatePicker label="Date" value={new Date(2027, 0, 2)} />)
  expect(field.value).toBe('02-01-2027')

  rerender(<RLDatePicker label="Date" value={null} />)
  expect(field.value).toBe('')

  rerender(<RLDatePicker label="Date" value={new Date(2026, 9, 15)} />)
  expect(field.value).toBe('15-10-2026')
})
