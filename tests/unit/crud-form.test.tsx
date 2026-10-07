import { Fragment, StrictMode } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { act, fireEvent, render } from '@testing-library/react'
import { RLCrudForm, type RLCrudFormFieldType, type RLCrudFormProps } from '../../src/components/RLCrudForm'
import { commit, textField, textFields, typeText, watchOverwrites, type TextElement } from './helpers'

const fields: RLCrudFormFieldType[] = [
  { i18n_key: 'name', value: 'name', label: 'Name', input_type: 'text', required: true },
  { i18n_key: 'notes', value: 'notes', label: 'Notes', input_type: 'textarea' },
  {
    i18n_key: 'code',
    value: 'code',
    label: 'Code',
    input_type: 'text',
    side_effect: (model) => {
      const { code } = model as { code?: string }
      ;(model as { code_upper?: string }).code_upper = code?.toUpperCase() ?? ''
    }
  },
  { i18n_key: 'code_upper', value: 'code_upper', label: 'Code upper', input_type: 'text' },
  { i18n_key: 'reg_01', value: 'reg_01', label: 'Register 1', input_type: 'number' },
  { i18n_key: 'reg_02', value: 'reg_02', label: 'Register 2', input_type: 'number' },
  { i18n_key: 'reg_03', value: 'reg_03', label: 'Register 3', input_type: 'number' },
  { i18n_key: 'reg_04', value: 'reg_04', label: 'Register 4', input_type: 'number' },
  { i18n_key: 'enabled', value: 'enabled', label: 'Enabled', input_type: 'checkbox', default_value: true }
]

const stored = {
  id: 7,
  name: 'fiber-7',
  notes: 'stored notes',
  code: 'abc',
  code_upper: 'ABC',
  reg_01: 1000,
  reg_02: 1001,
  reg_03: 1002,
  reg_04: 1003,
  enabled: true
}

let consoleError: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error')
})

afterEach(() => {
  // No React warning along the way: flushSync complains when it cannot flush
  expect(consoleError).not.toHaveBeenCalled()
})

describe.each([
  ['', Fragment],
  [' in StrictMode', StrictMode]
])('RLCrudForm%s', (_, wrapper) => {
  async function setup(props: Partial<RLCrudFormProps> = {}) {
    const onConfirm = vi.fn()
    const form = (extra: Partial<RLCrudFormProps> = {}) => (
      <RLCrudForm
        type="add"
        fields={fields}
        title="Fiber"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        requiredRuleMessage="Required"
        primaryKey="id"
        onConfirm={onConfirm}
        {...props}
        {...extra}
      />
    )
    const view = render(form(), { wrapper })
    const elements = await textFields(view.container)
    const field = (name: string) => elements.find((element) => element.name === name)!
    const submit = () => fireEvent.submit(view.container.querySelector('form')!)
    return { ...view, form, field, elements, submit, onConfirm }
  }

  const shown = (elements: TextElement[]) => Object.fromEntries(elements.map((element) => [element.name, element.value]))

  test('add: starts empty and confirms what is typed', async () => {
    const { field, elements, submit, onConfirm } = await setup()
    expect(Object.values(shown(elements)).filter(Boolean)).toEqual([])

    for (const [name, text] of [['name', 'fiber'], ['notes', 'two\nlines'], ['reg_01', '2000'], ['reg_02', '2001']]) {
      act(() => {
        typeText(field(name), text)
        commit(field(name))
      })
    }
    act(() => submit())

    expect(onConfirm).toHaveBeenCalledWith({ name: 'fiber', notes: 'two\nlines', reg_01: 2000, reg_02: 2001, enabled: true })
  })

  test('add: text typed in the next field before the render of a commit is kept', async () => {
    const { field, submit, onConfirm } = await setup()

    act(() => {
      typeText(field('name'), 'fiber')
      commit(field('name'))
      typeText(field('reg_01'), '2000')
      commit(field('reg_01'))
      // First key of the next field, in before React gets to render
      typeText(field('reg_02'), '2')
    })
    expect(field('reg_02').value).toBe('2')

    act(() => {
      typeText(field('reg_02'), '2001')
      commit(field('reg_02'))
      typeText(field('reg_03'), '2')
    })
    expect(field('reg_03').value).toBe('2')

    act(() => {
      typeText(field('reg_03'), '2002')
      commit(field('reg_03'))
    })
    act(() => submit())

    expect(onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'fiber', reg_01: 2000, reg_02: 2001, reg_03: 2002 })
    )
  })

  test('edit: shows the stored values', async () => {
    const { elements } = await setup({ type: 'edit', value: stored })

    expect(shown(elements)).toEqual({
      name: 'fiber-7',
      notes: 'stored notes',
      code: 'abc',
      code_upper: 'ABC',
      reg_01: '1000',
      reg_02: '1001',
      reg_03: '1002',
      reg_04: '1003'
    })
  })

  test('edit: text typed in the next field before the render of a commit is not put back to the stored value', async () => {
    const { field, submit, onConfirm } = await setup({ type: 'edit', value: stored })

    act(() => {
      typeText(field('reg_01'), '3000')
      commit(field('reg_01'))
      typeText(field('reg_02'), '3001')
    })
    expect(field('reg_02').value).toBe('3001')

    act(() => commit(field('reg_02')))
    act(() => submit())

    expect(onConfirm).toHaveBeenCalledWith({ ...stored, reg_01: 3000, reg_02: 3001 })
  })

  test('a commit overwrites no other field', async () => {
    const { field, elements } = await setup({ type: 'edit', value: stored })
    const others = elements.filter((element) => element.name !== 'reg_01')
    for (const element of others) {
      typeText(element, element.name === 'notes' || element.name.startsWith('reg') ? '555' : 'typed')
    }
    const overwrites = others.map(watchOverwrites)

    act(() => {
      typeText(field('reg_01'), '0012')
      commit(field('reg_01'))
    })

    expect(overwrites.flat()).toEqual([])
    expect(field('reg_01').value).toBe('12')
    expect(field('reg_02').value).toBe('555')
    expect(field('name').value).toBe('typed')
  })

  test('renders a commit before its event returns', async () => {
    const { field } = await setup()

    let shownInsideTheEvent = ''
    act(() => {
      typeText(field('code'), 'abc')
      commit(field('code'))
      // Written by the side effect of code, through a render
      shownInsideTheEvent = field('code_upper').value
    })

    expect(shownInsideTheEvent).toBe('ABC')
  })

  test('a submit right after a commit carries the committed value', async () => {
    const { field, submit, onConfirm } = await setup({ type: 'edit', value: stored })

    // Click on confirm with the cursor still in the field, or Enter: the
    // submit follows the commit with no render scheduled by React in between
    act(() => {
      typeText(field('reg_04'), '3003')
      commit(field('reg_04'))
      submit()
    })

    expect(onConfirm).toHaveBeenCalledWith({ ...stored, reg_04: 3003 })
  })

  test('a field changed by the side effect of another one shows its new value', async () => {
    const { field, submit, onConfirm } = await setup({ type: 'edit', value: stored })

    act(() => {
      typeText(field('code'), 'xyz')
      commit(field('code'))
    })

    expect(field('code_upper').value).toBe('XYZ')
    act(() => submit())
    expect(onConfirm).toHaveBeenCalledWith({ ...stored, code: 'xyz', code_upper: 'XYZ' })
  })

  test('a checkbox change leaves the text being typed alone', async () => {
    const { field, container, submit, onConfirm } = await setup({ type: 'edit', value: stored })
    const checkbox = container.querySelector<HTMLElement & { checked: boolean }>('sl-checkbox')!

    typeText(field('reg_01'), '3000')
    act(() => {
      checkbox.checked = false
      checkbox.dispatchEvent(new CustomEvent('sl-change', { bubbles: true }))
    })
    expect(field('reg_01').value).toBe('3000')

    act(() => commit(field('reg_01')))
    act(() => submit())
    expect(onConfirm).toHaveBeenCalledWith({ ...stored, reg_01: 3000, enabled: false })
  })

  test('a render from the parent leaves the text being typed alone', async () => {
    const { field, rerender, form } = await setup({ type: 'edit', value: stored })

    typeText(field('reg_01'), '3000')
    typeText(field('name'), 'typed')
    rerender(form({ title: 'Other title', confirmLabel: 'Save' }))

    expect(field('reg_01').value).toBe('3000')
    expect(field('name').value).toBe('typed')
  })

  test('a missing required value blocks the confirm without touching the fields', async () => {
    const { field, submit, onConfirm } = await setup()

    act(() => {
      typeText(field('reg_01'), '2000')
      commit(field('reg_01'))
    })
    typeText(field('reg_02'), '2001')
    // Shoelace stops the submit of a form with an empty required control
    act(() => submit())

    expect(onConfirm).not.toHaveBeenCalled()
    expect(field('reg_01').value).toBe('2000')
    expect(field('reg_02').value).toBe('2001')

    act(() => {
      typeText(field('name'), 'fiber')
      commit(field('name'))
      commit(field('reg_02'))
    })
    act(() => submit())

    expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({ name: 'fiber', reg_01: 2000, reg_02: 2001 }))
  })

  test('an emptied number is confirmed as null', async () => {
    const { field, submit, onConfirm } = await setup({ type: 'edit', value: stored })

    act(() => {
      typeText(field('reg_01'), '')
      commit(field('reg_01'))
      typeText(field('reg_02'), '3001')
    })
    expect(field('reg_01').value).toBe('')
    expect(field('reg_02').value).toBe('3001')

    act(() => commit(field('reg_02')))
    act(() => submit())
    expect(onConfirm).toHaveBeenCalledWith({ ...stored, reg_01: null, reg_02: 3001 })
  })

  test('another item replaces the values, typed or not', async () => {
    const { field, elements, rerender, form } = await setup({ type: 'edit', value: stored })

    act(() => {
      typeText(field('reg_01'), '3000')
      commit(field('reg_01'))
    })
    typeText(field('reg_02'), '3001')

    const other = { ...stored, id: 8, name: 'fiber-8', notes: '', reg_01: 8000, reg_02: 8001, reg_03: null }
    rerender(form({ type: 'edit', value: other }))

    expect(shown(elements)).toEqual({
      name: 'fiber-8',
      notes: '',
      code: 'abc',
      code_upper: 'ABC',
      reg_01: '8000',
      reg_02: '8001',
      reg_03: '',
      reg_04: '1003'
    })
  })

  test('the same item built again by the parent keeps what was typed', async () => {
    const { field, rerender, form, submit, onConfirm } = await setup({ type: 'edit', value: { ...stored } })

    act(() => {
      typeText(field('reg_01'), '3000')
      commit(field('reg_01'))
    })
    typeText(field('name'), 'typed')
    // A parent passing value={toItem(page)}: a new object at each of its renders
    rerender(form({ type: 'edit', value: { ...stored } }))

    expect(field('reg_01').value).toBe('3000')
    expect(field('name').value).toBe('typed')
    act(() => commit(field('name')))
    act(() => submit())
    expect(onConfirm).toHaveBeenCalledWith({ ...stored, name: 'typed', reg_01: 3000 })
  })

  test('the same item is recognized also after the side effects changed the first one', async () => {
    // The side effect of code writes code_upper into the value it is given
    const item = () => ({ ...stored, code_upper: '' })
    const { field, rerender, form } = await setup({ type: 'edit', value: item() })

    act(() => {
      typeText(field('reg_01'), '3000')
      commit(field('reg_01'))
    })
    rerender(form({ type: 'edit', value: item() }))

    expect(field('reg_01').value).toBe('3000')
  })

  test('new fields with the same item start the form again', async () => {
    const { field, rerender, form } = await setup({ type: 'edit', value: stored })

    act(() => {
      typeText(field('reg_01'), '3000')
      commit(field('reg_01'))
    })
    rerender(form({ type: 'edit', value: stored, fields: [...fields] }))

    expect(field('reg_01').value).toBe('1000')
  })

  test('validate() from outside reports the missing value', async () => {
    const ref = { current: null as { validate: () => boolean } | null }
    const { field, container } = await setup({ ref } as Partial<RLCrudFormProps>)

    let valid = true
    act(() => {
      valid = ref.current!.validate()
    })
    expect(valid).toBe(false)
    expect(container.textContent).toContain('Required')

    act(() => {
      typeText(field('name'), 'fiber')
      commit(field('name'))
    })
    act(() => {
      valid = ref.current!.validate()
    })
    expect(valid).toBe(true)
  })
})

describe('RLCrudForm required fields', () => {
  const requiredFields: RLCrudFormFieldType[] = [
    { i18n_key: 'count', value: 'count', label: 'Count', input_type: 'number', required: true },
    { i18n_key: 'accepted', value: 'accepted', label: 'Accepted', input_type: 'checkbox', required: true },
    {
      i18n_key: 'tags',
      value: 'tags',
      label: 'Tags',
      input_type: 'select',
      required: true,
      multiple: true,
      options: [{ value: 'a', text: 'A' }]
    }
  ]

  function validateWith(value: RLCrudFormProps['value']) {
    const ref = { current: null as { validate: () => boolean } | null }
    const view = render(
      <RLCrudForm
        ref={ref}
        type="edit"
        value={value}
        fields={requiredFields}
        validateAll
        title="Counter"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        requiredRuleMessage="Required"
        primaryKey="id"
      />
    )
    let valid = false
    act(() => {
      valid = ref.current!.validate()
    })
    const errors = view.container.textContent!.split('Required').length - 1
    view.unmount()
    return { valid, errors }
  }

  test('0 is a value', () => {
    expect(validateWith({ count: 0, accepted: true, tags: ['a'] })).toEqual({ valid: true, errors: 0 })
  })

  test('an unchecked checkbox and an empty list are missing', () => {
    expect(validateWith({ count: 1, accepted: false, tags: [] })).toEqual({ valid: false, errors: 2 })
  })

  test('null and empty text are missing', () => {
    expect(validateWith({ count: null, accepted: true, tags: ['a'] }).valid).toBe(false)
    expect(validateWith({ count: '', accepted: true, tags: ['a'] }).valid).toBe(false)
  })
})

test('RLCrudForm gives the step of a field to its number input', async () => {
  const { container } = render(
    <RLCrudForm
      type="add"
      fields={[
        { i18n_key: 'ratio', value: 'ratio', label: 'Ratio', input_type: 'number', step: 'any' },
        { i18n_key: 'count', value: 'count', label: 'Count', input_type: 'number' }
      ]}
      title="Steps"
      cancelLabel="Cancel"
      confirmLabel="Confirm"
      requiredRuleMessage="Required"
      primaryKey="id"
    />
  )
  const step = async (name: string) => ((await textField(container, name)) as TextElement & { step: unknown }).step
  expect(await step('ratio')).toBe('any')
  expect(await step('count')).toBe(1)
})

test('RLCrudForm keeps a single field by name', async () => {
  const { container } = render(
    <RLCrudForm
      type="add"
      fields={fields}
      title="Fiber"
      cancelLabel="Cancel"
      confirmLabel="Confirm"
      requiredRuleMessage="Required"
      primaryKey="id"
    />
  )
  expect((await textField(container, 'reg_04')).name).toBe('reg_04')
  expect(await textFields(container)).toHaveLength(8)
})
