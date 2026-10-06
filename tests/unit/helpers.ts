export type TextElement = HTMLElement & {
  name: string
  value: string
  disabled: boolean
  label: string
  updateComplete: Promise<unknown>
}

type NativeControl = HTMLInputElement | HTMLTextAreaElement

export const nativeOf = (element: TextElement) =>
  element.shadowRoot!.querySelector<NativeControl>('input, textarea')!

/** Text fields of a container once Shoelace has rendered them */
export async function textFields(container: HTMLElement) {
  const fields = [...container.querySelectorAll<TextElement>('sl-input, sl-textarea')]
  await Promise.all(fields.map((field) => field.updateComplete))
  return fields
}

export async function textField(container: HTMLElement, name?: string) {
  const fields = await textFields(container)
  const field = name ? fields.find((candidate) => candidate.name === name) : fields[0]
  if (!field) {
    throw new Error(`No text field ${name ?? ''}`)
  }
  return field
}

/**
 * Puts text in a field the way typing does: in the native control, with the
 * input event Shoelace listens to. Nothing is committed.
 */
export function typeText(element: TextElement, text: string) {
  const native = nativeOf(element)
  native.value = text
  native.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
}

/** What leaving the field or pressing Enter does: the native change event */
export function commit(element: TextElement) {
  nativeOf(element).dispatchEvent(new Event('change', { bubbles: true }))
}

/**
 * Values assigned from now on to the `value` property of an element over a
 * different text in its native control. Shoelace mirroring the native text on
 * the property, as it does on input and change, is not one of them.
 */
export function watchOverwrites(element: TextElement) {
  const overwrites: string[] = []
  let proto = Object.getPrototypeOf(element)
  let descriptor: PropertyDescriptor | undefined
  while (proto && !(descriptor = Object.getOwnPropertyDescriptor(proto, 'value'))) {
    proto = Object.getPrototypeOf(proto)
  }
  const accessor = descriptor!
  Object.defineProperty(element, 'value', {
    configurable: true,
    get() {
      return accessor.get!.call(this)
    },
    set(written: string) {
      if (written !== nativeOf(element).value) {
        overwrites.push(written)
      }
      accessor.set!.call(this, written)
    }
  })
  return overwrites
}
