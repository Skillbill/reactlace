import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { act, fireEvent, render } from '@testing-library/react'
import { RLCrudFilters, type RLCrudFilterType } from '../../src/components/RLCrudFilters'
import { commit, textFields, typeText } from './helpers'

const filters: RLCrudFilterType[] = [
  { i18n_key: 'name', value: 'name', label: 'Name', input_type: 'text' },
  { i18n_key: 'notes', value: 'notes', label: 'Notes', input_type: 'text', default_value: 'any' },
  { i18n_key: 'from', value: 'from', label: 'From', input_type: 'number' },
  { i18n_key: 'to', value: 'to', label: 'To', input_type: 'number' }
]

let consoleError: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error')
})

afterEach(() => {
  expect(consoleError).not.toHaveBeenCalled()
})

async function setup() {
  const onFiltersApplied = vi.fn()
  const view = render(<RLCrudFilters filters={filters} onFiltersApplied={onFiltersApplied} />)
  const elements = await textFields(view.container)
  const field = (name: string) => elements.find((element) => element.name === name)!
  const button = (label: string) =>
    [...view.container.querySelectorAll('sl-button')].find((candidate) => candidate.textContent === label)!
  const shown = () => Object.fromEntries(elements.map((element) => [element.name, element.value]))
  return { ...view, field, button, shown, onFiltersApplied }
}

test('RLCrudFilters starts from the default values', async () => {
  const { shown } = await setup()
  expect(shown()).toEqual({ name: '', notes: 'any', from: '', to: '' })
})

test('RLCrudFilters keeps the text typed in the next field before the render of a commit', async () => {
  const { field, button, shown, onFiltersApplied } = await setup()

  act(() => {
    typeText(field('name'), 'fib')
    commit(field('name'))
    typeText(field('notes'), 'so')
  })
  expect(shown()).toEqual({ name: 'fib', notes: 'so', from: '', to: '' })

  act(() => {
    typeText(field('notes'), 'some')
    commit(field('notes'))
    typeText(field('from'), '1')
  })
  expect(shown()).toEqual({ name: 'fib', notes: 'some', from: '1', to: '' })

  act(() => {
    typeText(field('from'), '10')
    commit(field('from'))
  })
  act(() => {
    fireEvent.click(button('apply'))
  })

  expect(onFiltersApplied).toHaveBeenLastCalledWith({ name: 'fib', notes: 'some', from: 10, to: undefined })
})

test('RLCrudFilters reset empties a field committed right before it', async () => {
  const { field, button, shown, onFiltersApplied } = await setup()

  // Reset clicked with the cursor still in the field: the commit of the blur
  // and the reset come one after the other
  act(() => {
    typeText(field('name'), 'fib')
    commit(field('name'))
    typeText(field('from'), '10')
    commit(field('from'))
    fireEvent.click(button('reset'))
  })

  expect(shown()).toEqual({ name: '', notes: 'any', from: '', to: '' })
  expect(onFiltersApplied).toHaveBeenLastCalledWith({ name: undefined, notes: 'any', from: undefined, to: undefined })
})

test.each([
  ['a click on apply', (view: Awaited<ReturnType<typeof setup>>) => fireEvent.click(view.button('apply'))],
  [
    'Enter',
    (view: Awaited<ReturnType<typeof setup>>) =>
      fireEvent.keyUp(view.container.querySelector('sl-details')!, { key: 'Enter' })
  ]
])('RLCrudFilters applies a value committed right before %s', async (_, apply) => {
  const view = await setup()

  // The apply follows the commit with no render scheduled by React in between
  act(() => {
    typeText(view.field('name'), 'fib')
    commit(view.field('name'))
    typeText(view.field('to'), '20')
    commit(view.field('to'))
    apply(view)
  })

  expect(view.onFiltersApplied).toHaveBeenLastCalledWith({ name: 'fib', notes: 'any', from: undefined, to: 20 })
})

test('RLCrudFilters reset brings a changed default back', async () => {
  const { field, button, shown } = await setup()

  act(() => {
    typeText(field('notes'), 'other')
    commit(field('notes'))
  })
  expect(shown().notes).toBe('other')

  act(() => {
    fireEvent.click(button('reset'))
  })
  expect(shown().notes).toBe('any')
})

test('RLCrudFilters setFilterModel replaces what is in the fields', async () => {
  const ref = { current: null as { setFilterModel: (model: Record<string, unknown>) => void } | null }
  const view = render(<RLCrudFilters ref={ref as never} filters={filters} />)
  const elements = await textFields(view.container)
  const shown = () => Object.fromEntries(elements.map((element) => [element.name, element.value]))

  typeText(elements[0], 'typing')
  act(() => {
    ref.current!.setFilterModel({ name: 'set', from: 5 })
  })

  expect(shown()).toEqual({ name: 'set', notes: '', from: '5', to: '' })
})
