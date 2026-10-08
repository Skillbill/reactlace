import { describe, expect, test } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useElementValue } from '../../src/hooks/useElementValue'

// Stands in for a Shoelace control: holds a value and counts its writes
function fakeElement(initial = '') {
  const writes: string[] = []
  let current = initial
  return {
    writes,
    get value() {
      return current
    },
    set value(written: string) {
      writes.push(written)
      current = written
    },
    // What typing does: the text changes without the hook being involved
    type(text: string) {
      current = text
    }
  }
}

type FakeElement = ReturnType<typeof fakeElement>

function setup(value: string, element: FakeElement | null = fakeElement()) {
  const hook = renderHook(
    (props: { value: string }) => {
      const result = useElementValue<FakeElement>(props.value)
      // The ref is attached during render, as React does before layout effects
      ;(result.elementRef as { current: FakeElement | null }).current = element
      return result
    },
    { initialProps: { value } }
  )
  return { ...hook, element }
}

describe('useElementValue', () => {
  test('writes the initial value', () => {
    const { element } = setup('alpha')
    expect(element!.value).toBe('alpha')
    expect(element!.writes).toEqual(['alpha'])
  })

  test('does not write an element that already holds the value', () => {
    const { element } = setup('', fakeElement(''))
    expect(element!.writes).toEqual([])
  })

  test('does not write again while the value stays the same', () => {
    const { element, rerender } = setup('alpha')
    rerender({ value: 'alpha' })
    rerender({ value: 'alpha' })
    expect(element!.writes).toEqual(['alpha'])
  })

  test('leaves typed text alone while the value stays the same', () => {
    const { element, rerender } = setup('alpha')
    element!.type('alpha and more')
    rerender({ value: 'alpha' })
    expect(element!.value).toBe('alpha and more')
  })

  test('writes when the value changes', () => {
    const { element, rerender } = setup('alpha')
    rerender({ value: 'beta' })
    expect(element!.writes).toEqual(['alpha', 'beta'])
  })

  test('a changed value replaces typed text', () => {
    const { element, rerender } = setup('alpha')
    element!.type('typed')
    rerender({ value: 'beta' })
    expect(element!.value).toBe('beta')
  })

  test('a value going back to one seen before is written again', () => {
    const { element, rerender } = setup('alpha')
    rerender({ value: 'beta' })
    rerender({ value: 'alpha' })
    expect(element!.writes).toEqual(['alpha', 'beta', 'alpha'])
  })

  test('the committed value coming back as a prop is not written', () => {
    const { element, rerender, result } = setup('alpha')
    element!.type('typed')
    result.current.commitValue('typed')
    rerender({ value: 'typed' })
    expect(element!.writes).toEqual(['alpha'])
  })

  test('text typed after a commit survives the render that echoes the commit', () => {
    const { element, rerender, result } = setup('alpha')
    element!.type('typed')
    result.current.commitValue('typed')
    element!.type('typed and more')
    rerender({ value: 'typed' })
    expect(element!.value).toBe('typed and more')
  })

  test('a commit that differs from the text is shown right away', () => {
    const { element, result } = setup('')
    element!.type('0012')
    result.current.commitValue('12')
    expect(element!.value).toBe('12')
  })

  test('a commit the parent ignores is taken back at the next render', () => {
    const { element, rerender, result } = setup('alpha')
    element!.type('typed')
    result.current.commitValue('typed')
    rerender({ value: 'alpha' })
    expect(element!.value).toBe('alpha')
  })

  test('a commit the parent changes shows the value of the parent', () => {
    const { element, rerender, result } = setup('')
    element!.type('typed')
    result.current.commitValue('typed')
    rerender({ value: 'TYPED' })
    expect(element!.value).toBe('TYPED')
  })

  test('works without an element, and syncs one that shows up later', () => {
    const element = fakeElement()
    const holder: { element: FakeElement | null } = { element: null }
    const { rerender, result } = renderHook(
      (props: { value: string }) => {
        const hook = useElementValue<FakeElement>(props.value)
        ;(hook.elementRef as { current: FakeElement | null }).current = holder.element
        return hook
      },
      { initialProps: { value: 'alpha' } }
    )
    expect(() => result.current.commitValue('typed')).not.toThrow()

    holder.element = element
    rerender({ value: 'alpha' })
    expect(element.value).toBe('alpha')
  })

  test('commitValue keeps its identity across renders', () => {
    const { rerender, result } = setup('alpha')
    const first = result.current.commitValue
    rerender({ value: 'beta' })
    expect(result.current.commitValue).toBe(first)
  })
})
