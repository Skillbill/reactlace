import { StrictMode, createRef, useState, type ReactElement } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { act, render } from '@testing-library/react'
import { RLInput, type RLInputRef } from '../../src/components/RLInput'
import { RLNumberInput } from '../../src/components/RLNumberInput'
import { RLTextArea } from '../../src/components/RLTextArea'
import { commit, nativeOf, textField, typeText, watchOverwrites } from './helpers'

type ModelValue = string | number | null | undefined

interface FieldProps {
  value?: ModelValue
  onChange?: (value: ModelValue) => void
  [key: string]: unknown
}

interface FieldCase {
  name: string
  Field: (props: FieldProps) => ReactElement
  /** Two model values and the text each one shows */
  first: [ModelValue, string]
  second: [ModelValue, string]
  /** Text typed by the user and the model value it commits */
  typed: [string, ModelValue]
  /** The same text typed further, after a commit */
  longer: [string, ModelValue]
  /** What a parent could turn the committed value into, and the text it shows */
  changed: [(value: ModelValue) => ModelValue, string]
}

const cases: FieldCase[] = [
  {
    name: 'RLInput',
    Field: (props) => <RLInput label="Field" {...(props as object)} />,
    first: ['alpha', 'alpha'],
    second: ['beta', 'beta'],
    typed: ['typed', 'typed'],
    longer: ['typed and more', 'typed and more'],
    changed: [(value) => String(value).toUpperCase(), 'TYPED']
  },
  {
    name: 'RLNumberInput',
    Field: (props) => <RLNumberInput label="Field" {...(props as object)} />,
    first: [1000, '1000'],
    second: [42, '42'],
    typed: ['2001', 2001],
    longer: ['20015', 20015],
    changed: [(value) => Number(value) * 2, '4002']
  },
  {
    name: 'RLTextArea',
    Field: (props) => <RLTextArea label="Field" {...(props as object)} />,
    first: ['line one\nline two', 'line one\nline two'],
    second: ['beta', 'beta'],
    typed: ['typed', 'typed'],
    longer: ['typed\nand more', 'typed\nand more'],
    changed: [(value) => String(value).toUpperCase(), 'TYPED']
  }
]

let consoleError: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error')
})

afterEach(() => {
  // No React warning along the way
  expect(consoleError).not.toHaveBeenCalled()
})

describe.each(cases)('$name', ({ Field, first, second, typed, longer, changed }) => {
  // A parent holding the value in its state, as applications do
  function Controlled({
    initial,
    change = (value) => value,
    onModel
  }: {
    initial?: ModelValue
    change?: (value: ModelValue) => ModelValue
    onModel: (value: ModelValue) => void
  }) {
    const [value, setValue] = useState(initial)
    onModel(value)
    return <Field value={value} onChange={(next) => setValue(change(next))} />
  }

  test('shows the value it is given', async () => {
    const { container } = render(<Field value={first[0]} />)
    const field = await textField(container)

    expect(field.value).toBe(first[1])
    expect(nativeOf(field).value).toBe(first[1])
  })

  test.each([[undefined], [null], ['']])('shows an empty field for %o', async (empty) => {
    const { container } = render(<Field value={empty} />)
    const field = await textField(container)

    expect(field.value).toBe('')
  })

  test('follows the value when it changes', async () => {
    const { container, rerender } = render(<Field value={first[0]} />)
    const field = await textField(container)

    rerender(<Field value={second[0]} />)
    expect(field.value).toBe(second[1])

    rerender(<Field value={undefined} />)
    expect(field.value).toBe('')

    rerender(<Field value={first[0]} />)
    expect(field.value).toBe(first[1])
  })

  test('is not overwritten when rendered again with the same value', async () => {
    const { container, rerender } = render(<Field value={first[0]} />)
    const field = await textField(container)
    const overwrites = watchOverwrites(field)

    rerender(<Field value={first[0]} />)
    rerender(<Field value={first[0]} label="Other label" disabled error="Some error" />)

    expect(overwrites).toEqual([])
    // The other props did reach the element
    expect(field.label).toBe('Other label')
    expect(field.disabled).toBe(true)
    expect(container.textContent).toContain('Some error')
  })

  test('keeps the text being typed when rendered again', async () => {
    const onChange = vi.fn()
    const { container, rerender } = render(<Field value={first[0]} onChange={onChange} />)
    const field = await textField(container)

    typeText(field, typed[0])
    rerender(<Field value={first[0]} onChange={onChange} />)
    rerender(<Field value={first[0]} onChange={onChange} label="Other label" error="Some error" />)

    expect(field.value).toBe(typed[0])
    expect(onChange).not.toHaveBeenCalled()

    act(() => commit(field))
    expect(onChange).toHaveBeenCalledWith(typed[1])
  })

  test('a click right after a commit finds the parent with the committed value', async () => {
    // A save button reading the state of its render, as AppSettingsView in efesto
    const saved: ModelValue[] = []
    function WithSave() {
      const [value, setValue] = useState<ModelValue>(first[0])
      return (
        <>
          <Field value={value} onChange={setValue} />
          <button onClick={() => saved.push(value)}>Save</button>
        </>
      )
    }
    const { container } = render(<WithSave />)
    const field = await textField(container)

    // Leaving the field with the click on save: the commit, then the click,
    // with no render scheduled by React in between
    act(() => {
      typeText(field, typed[0])
      commit(field)
      container.querySelector('button')!.click()
    })

    expect(saved).toEqual([typed[1]])
  })

  test('reports the committed text once', async () => {
    const onChange = vi.fn()
    const onSlChange = vi.fn()
    const { container } = render(<Field value={first[0]} onChange={onChange} onSlChange={onSlChange} />)
    const field = await textField(container)

    act(() => {
      typeText(field, typed[0])
      commit(field)
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(typed[1])
    expect(onSlChange).toHaveBeenCalledTimes(1)
  })

  test('is not overwritten by the render that brings the committed value back', async () => {
    const onModel = vi.fn()
    const { container } = render(<Controlled initial={first[0]} onModel={onModel} />)
    const field = await textField(container)

    typeText(field, typed[0])
    const overwrites = watchOverwrites(field)
    act(() => commit(field))

    expect(onModel).toHaveBeenLastCalledWith(typed[1])
    expect(field.value).toBe(typed[0])
    expect(overwrites).toEqual([])
  })

  test('keeps what is typed between a commit and the render that follows it', async () => {
    const onModel = vi.fn()
    const { container } = render(<Controlled initial={first[0]} onModel={onModel} />)
    const field = await textField(container)

    // The render of the commit only happens when act returns: the text typed
    // in the meantime is what a slow browser would find in the field
    act(() => {
      typeText(field, typed[0])
      commit(field)
      typeText(field, longer[0])
    })

    expect(onModel).toHaveBeenLastCalledWith(typed[1])
    expect(field.value).toBe(longer[0])

    act(() => commit(field))
    expect(onModel).toHaveBeenLastCalledWith(longer[1])
    expect(field.value).toBe(longer[0])
  })

  test('takes a value set from outside over the text being typed', async () => {
    const { container, rerender } = render(<Field value={first[0]} />)
    const field = await textField(container)

    typeText(field, typed[0])
    rerender(<Field value={second[0]} />)

    expect(field.value).toBe(second[1])
  })

  test('takes a value set from outside after a commit', async () => {
    const { container, rerender } = render(<Field value={first[0]} />)
    const field = await textField(container)

    act(() => {
      typeText(field, typed[0])
      commit(field)
    })
    rerender(<Field value={typed[1]} />)
    rerender(<Field value={second[0]} />)
    expect(field.value).toBe(second[1])

    rerender(<Field value={typed[1]} />)
    expect(field.value).toBe(typed[0])
  })

  test.each([[first[0], first[1]], [undefined, '']])(
    'goes back to %o when the parent does not take the commit',
    async (value, shown) => {
      const { container, rerender } = render(<Field value={value} />)
      const field = await textField(container)

      act(() => {
        typeText(field, typed[0])
        commit(field)
      })
      rerender(<Field value={value} />)

      expect(field.value).toBe(shown)
    }
  )

  test('shows the committed value as changed by the parent', async () => {
    const onModel = vi.fn()
    const { container } = render(<Controlled initial={first[0]} change={changed[0]} onModel={onModel} />)
    const field = await textField(container)

    act(() => {
      typeText(field, typed[0])
      commit(field)
    })

    expect(onModel).toHaveBeenLastCalledWith(changed[0](typed[1]))
    expect(field.value).toBe(changed[1])
  })

  test('gives the value to an element created later', async () => {
    const { container, rerender } = render(<Field key="one" value={first[0]} />)
    const before = await textField(container)

    rerender(<Field key="two" value={first[0]} />)
    const after = await textField(container)

    expect(after).not.toBe(before)
    expect(after.value).toBe(first[1])
  })

  test('validates the value of the parent, not the text in the field', async () => {
    const ref = createRef<RLInputRef>()
    const rules = [{ validateFn: (value: unknown) => value !== null && value !== undefined && value !== '', message: 'Required' }]
    const { container, rerender } = render(<Field ref={ref} rules={rules} value={undefined} />)
    const field = await textField(container)

    typeText(field, typed[0])
    let valid = true
    act(() => {
      valid = ref.current!.validate()
    })
    expect(valid).toBe(false)
    expect(container.textContent).toContain('Required')
    // The render of the error left the typed text in place
    expect(field.value).toBe(typed[0])

    rerender(<Field ref={ref} rules={rules} value={typed[1]} />)
    act(() => {
      valid = ref.current!.validate()
    })
    expect(valid).toBe(true)
    expect(container.textContent).not.toContain('Required')
  })

  describe('in StrictMode', () => {
    test('shows the value and follows its changes', async () => {
      const { container, rerender } = render(<Field value={first[0]} />, { wrapper: StrictMode })
      const field = await textField(container)
      expect(field.value).toBe(first[1])

      rerender(<Field value={second[0]} />)
      expect(field.value).toBe(second[1])
    })

    test('keeps the text typed around a commit', async () => {
      const onModel = vi.fn()
      const { container } = render(<Controlled initial={first[0]} onModel={onModel} />, { wrapper: StrictMode })
      const field = await textField(container)

      act(() => {
        typeText(field, typed[0])
        commit(field)
        typeText(field, longer[0])
      })

      expect(onModel).toHaveBeenLastCalledWith(typed[1])
      expect(field.value).toBe(longer[0])
    })
  })
})

describe('RLNumberInput', () => {
  async function setup(props: FieldProps = {}) {
    const onChange = vi.fn()
    const view = render(<RLNumberInput label="Number" onChange={onChange} {...(props as object)} />)
    const field = await textField(view.container)
    return { ...view, field, onChange }
  }

  test.each([
    ['0012', 12, '12'],
    ['1.50', 1.5, '1.5'],
    ['-7', -7, '-7'],
    ['0', 0, '0'],
    ['1e3', 1000, '1000']
  ])('commits %s as %d and shows it parsed, before any render', async (text, value, shown) => {
    const { field, onChange } = await setup()

    let shownInsideTheEvent = ''
    act(() => {
      typeText(field, text)
      commit(field)
      shownInsideTheEvent = field.value
    })

    expect(onChange).toHaveBeenCalledWith(value)
    expect(shownInsideTheEvent).toBe(shown)
    expect(field.value).toBe(shown)
  })

  test('commits an emptied field as null', async () => {
    const { field, onChange } = await setup({ value: 5 })

    act(() => {
      typeText(field, '')
      commit(field)
    })

    expect(onChange).toHaveBeenCalledWith(null)
    expect(field.value).toBe('')
  })

  test('shows 0', async () => {
    const { field } = await setup({ value: 0 })
    expect(field.value).toBe('0')
  })

  test.each([
    ['500', 100],
    ['-3', 0]
  ])('brings %s into the range and shows the result', async (text, value) => {
    const { field, onChange } = await setup({ value: 50, min: 0, max: 100 })

    act(() => {
      typeText(field, text)
      commit(field)
    })

    expect(onChange).toHaveBeenCalledWith(value)
    expect(field.value).toBe(String(value))
  })

  test('shows the limit also when the model was already at the limit', async () => {
    // The value of the parent does not change: nothing but the commit itself
    // can put the limit back in the field
    const { field, onChange, rerender } = await setup({ value: 100, min: 0, max: 100 })

    act(() => {
      typeText(field, '900')
      commit(field)
    })
    rerender(<RLNumberInput label="Number" value={100} min={0} max={100} />)

    expect(onChange).toHaveBeenCalledWith(100)
    expect(field.value).toBe('100')
  })

  test('the clear button reports null', async () => {
    const onClear = vi.fn()
    const { field, onChange } = await setup({ value: 42, clearable: true, onClear })

    act(() => {
      field.shadowRoot!.querySelector<HTMLButtonElement>('[part~="clear-button"]')!.click()
    })

    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(field.value).toBe('')
  })
})

describe('RLInput', () => {
  test('the clear button reports an empty string', async () => {
    const onChange = vi.fn()
    const onClear = vi.fn()
    const { container } = render(<RLInput label="Text" value="hello" clearable onChange={onChange} onClear={onClear} />)
    const field = await textField(container)

    act(() => {
      field.shadowRoot!.querySelector<HTMLButtonElement>('[part~="clear-button"]')!.click()
    })

    expect(onChange).toHaveBeenLastCalledWith('')
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(field.value).toBe('')
  })

  test('forwards the events of the element', async () => {
    const onInput = vi.fn()
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const { container } = render(<RLInput label="Text" value="" onInput={onInput} onFocus={onFocus} onBlur={onBlur} />)
    const field = await textField(container)

    typeText(field, 'a')
    nativeOf(field).dispatchEvent(new Event('focus'))
    nativeOf(field).dispatchEvent(new Event('blur'))

    expect(onInput).toHaveBeenCalledTimes(1)
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  test('keeps numbers as text when used with type number', async () => {
    const onChange = vi.fn()
    const { container } = render(<RLInput label="Text" type="number" value="" onChange={onChange} />)
    const field = await textField(container)

    act(() => {
      typeText(field, '0012')
      commit(field)
    })

    expect(onChange).toHaveBeenCalledWith('0012')
    expect(field.value).toBe('0012')
  })
})
