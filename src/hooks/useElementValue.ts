import { useCallback, useLayoutEffect, useRef } from 'react'

interface ValueElement {
  value: string
}

export interface UseElementValueResult<T extends ValueElement> {
  elementRef: React.RefObject<T>
  commitValue: (committed: string) => void
}

/**
 * Keeps the `value` of a Shoelace text control in sync with a controlled prop.
 *
 * The Shoelace React wrappers assign every prop to the element on each render.
 * For `value` that means a render landing while the user is typing puts the
 * previous text back in the field, since the parent only learns about the new
 * one on `sl-change`. Here the element is written only when the prop moves
 * away from the last value the two agreed on.
 */
export function useElementValue<T extends ValueElement>(value: string): UseElementValueResult<T> {
  const elementRef = useRef<T>(null)
  const syncedValueRef = useRef<string | null>(null)

  useLayoutEffect(() => {
    const element = elementRef.current
    if (!element || syncedValueRef.current === value) {
      return
    }
    syncedValueRef.current = value
    if (element.value !== value) {
      element.value = value
    }
  })

  // To call on `sl-change` with the value handed to the parent. The render that
  // echoes it back is then not mistaken for a change coming from outside, which
  // would overwrite what the user typed in the meantime. A value that differs
  // from the text of the element (a parsed number) is shown right away.
  const commitValue = useCallback((committed: string) => {
    syncedValueRef.current = committed
    const element = elementRef.current
    if (element && element.value !== committed) {
      element.value = committed
    }
  }, [])

  return { elementRef, commitValue }
}
