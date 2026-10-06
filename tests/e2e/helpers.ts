import type { Page } from '@playwright/test'

export interface Condition {
  id: string
  title: string
  /** Delay between keystrokes, in ms */
  keyDelay: number
  /** Pause after each Tab, in ms */
  tabPause?: number
  /** Chrome CPU throttling rate */
  cpu?: number
  /** Delay added to every React Scheduler task, in ms: a browser too slow to render between keys */
  schedulerLag?: number
}

// The stale value race needs a key to land between the commit of a field and
// the render that follows. `human` leaves the render time to happen and is
// expected to pass even without the fix; the others open the window.
export const CONDITIONS: Condition[] = [
  { id: 'human', title: 'unhurried typing', keyDelay: 80, tabPause: 120 },
  { id: 'burst', title: 'burst typing', keyDelay: 0 },
  { id: 'cpu6x', title: 'CPU 6x slower, 60 ms per key', keyDelay: 60, cpu: 6 },
  { id: 'lag150', title: 'renders lagging 150 ms, 30 ms per key', keyDelay: 30, schedulerLag: 150 }
]

export const RACY_CONDITIONS = CONDITIONS.filter((condition) => condition.id !== 'human')

export const REGISTERS = Array.from({ length: 16 }, (_, i) => `reg_${String(i + 1).padStart(2, '0')}`)

const pageErrorLog = new WeakMap<Page, string[]>()

/** Exceptions and console errors of a page opened with openHarness: React reports its misuse there */
export const pageErrors = (page: Page) => pageErrorLog.get(page) ?? []

/**
 * Opens a harness scenario under the given condition. Slowdowns are switched
 * on once the page is ready, so that they only affect the interaction.
 */
export async function openHarness(page: Page, query: string, condition: Condition, readySelector: string) {
  const errors: string[] = []
  pageErrorLog.set(page, errors)
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })

  await page.addInitScript(() => {
    // React schedules its renders through a MessageChannel: delaying those
    // messages reproduces a render that arrives late
    const NativeMessageChannel = window.MessageChannel
    window.MessageChannel = class extends NativeMessageChannel {
      constructor() {
        super()
        const port = this.port2
        const postMessage = port.postMessage.bind(port)
        port.postMessage = (message: unknown) => {
          if (window.__schedulerLag) {
            setTimeout(() => postMessage(message), window.__schedulerLag)
          } else {
            postMessage(message)
          }
        }
      }
    }
  })

  await page.goto(`/?${query}`)
  await page.locator(readySelector).first().waitFor()
  await recordClobbers(page)
  await slowDown(page, condition)
}

export async function slowDown(page: Page, condition: Condition) {
  if (condition.cpu) {
    const session = await page.context().newCDPSession(page)
    await session.send('Emulation.setCPUThrottlingRate', { rate: condition.cpu })
  }
  if (condition.schedulerLag) {
    await page.evaluate((lag) => {
      window.__schedulerLag = lag
    }, condition.schedulerLag)
  }
}

/**
 * Records every write to the `value` of a focused field that does not match
 * what its native control is showing: text put there by the application over
 * what the user is typing.
 */
export async function recordClobbers(page: Page) {
  await page.evaluate(() => {
    window.__clobbers = []
    for (const tag of ['sl-input', 'sl-textarea']) {
      let proto = customElements.get(tag)!.prototype
      while (!Object.getOwnPropertyDescriptor(proto, 'value')) {
        proto = Object.getPrototypeOf(proto)
      }
      const descriptor = Object.getOwnPropertyDescriptor(proto, 'value')!
      Object.defineProperty(proto, 'value', {
        ...descriptor,
        set(this: HTMLElement & { name: string }, written: string) {
          const native = this.shadowRoot?.querySelector<HTMLInputElement>('input, textarea')
          if (native && document.activeElement === this && native.value !== written) {
            window.__clobbers.push({ name: this.name, shown: native.value, written })
          }
          descriptor.set!.call(this, written)
        }
      })
    }
  })
}

export const clobbers = (page: Page) => page.evaluate(() => window.__clobbers)

/** Time for lagging renders to land before the page is inspected */
export async function settle(page: Page, condition: Condition) {
  await page.waitForTimeout((condition.schedulerLag ?? 0) * 3 + (condition.cpu ? 500 : 200))
}

/**
 * Focuses a field the way Tab does: with its content selected. Fields are
 * looked up by their `name` property, which Shoelace does not reflect to an
 * attribute.
 */
export async function focusField(page: Page, name: string, root = 'body') {
  await page.waitForFunction(findField, [root, name] as const)
  await page.evaluate(
    ([find, args]) => {
      const field = new Function(`return (${find})`)()(args) as HTMLElement & { select?: () => void }
      field.focus()
      field.select?.()
    },
    [findField.toString(), [root, name]] as const
  )
}

function findField([root, name]: readonly [string, string]) {
  const fields = document.querySelector(root)?.querySelectorAll<HTMLElement & { name: string }>('sl-input, sl-textarea')
  return [...(fields ?? [])].find((field) => field.name === name)
}

/** Pause an unhurried user leaves after an action that commits a field */
export async function pause(page: Page, condition: Condition) {
  if (condition.tabPause) {
    await page.waitForTimeout(condition.tabPause)
  }
}

/**
 * Types each value and leaves the field with Tab, without waiting in between
 * unless the condition asks for it. Tab is skipped after the last value when
 * `tabAfterLast` is false. With `selectAll` the content of each field is
 * selected from the keyboard first: inside a Shoelace dialog Tab is handled by
 * its focus trap, which does not select the content as the browser does.
 */
export async function typeSequence(
  page: Page,
  values: string[],
  condition: Condition,
  { tabAfterLast = true, selectAll = false }: { tabAfterLast?: boolean; selectAll?: boolean } = {}
) {
  for (const [index, value] of values.entries()) {
    if (selectAll) {
      await page.keyboard.press('Control+A')
    }
    await page.keyboard.type(value, { delay: condition.keyDelay })
    if (index < values.length - 1 || tabAfterLast) {
      await page.keyboard.press('Tab')
      await pause(page, condition)
    }
  }
}

/** What the user sees in each text field, by field name */
export const shownValues = (page: Page, root = 'body') =>
  page.evaluate((selector) => {
    const fields = document.querySelector(selector)!.querySelectorAll<HTMLElement & { name: string }>(
      'sl-input, sl-textarea'
    )
    return Object.fromEntries(
      [...fields].map((field) => [
        field.name,
        field.shadowRoot!.querySelector<HTMLInputElement>('input, textarea')!.value
      ])
    )
  }, root)

export const pick = <T extends Record<string, unknown>>(source: T, keys: string[]) =>
  Object.fromEntries(keys.map((key) => [key, source[key]]))
