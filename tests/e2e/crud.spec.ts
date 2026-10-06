import { expect, test, type Page } from '@playwright/test'
import {
  CONDITIONS,
  REGISTERS,
  clobbers,
  focusField,
  openHarness,
  pageErrors,
  pick,
  settle,
  shownValues,
  typeSequence,
  type Condition
} from './helpers'

const DIALOG = 'sl-dialog'
const FILTERS = 'sl-details'

const typed = REGISTERS.map((_, i) => String(5000 + i))
const typedNumbers = Object.fromEntries(REGISTERS.map((key, i) => [key, 5000 + i]))
const rowShown = (id: number) => Object.fromEntries(REGISTERS.map((key, i) => [key, String(id * 1000 + i)]))

const open = (page: Page, condition: Condition) =>
  openHarness(page, 'scenario=crud', condition, 'tbody tr:nth-child(3)')

const calls = (page: Page) => page.evaluate(() => window.__calls)

const dialogButton = (page: Page, label: string) => page.locator(`${DIALOG} sl-button`, { hasText: label })

// The dialog moves the focus to its panel when the opening animation ends:
// typing has to start after that, as it does for a user
async function waitForDialog(page: Page, condition: Condition) {
  await expect(page.locator(`${DIALOG}[open] form`)).toBeVisible()
  await page.waitForTimeout(500)
  await settle(page, condition)
}

async function openAdd(page: Page, condition: Condition) {
  await page.locator('sl-button', { hasText: 'button.add_fiber' }).click()
  await waitForDialog(page, condition)
}

async function openEdit(page: Page, row: number, condition: Condition) {
  await page.locator('tbody tr').nth(row - 1).locator('sl-icon').click()
  await waitForDialog(page, condition)
  await expect.poll(async () => pick(await shownValues(page, DIALOG), REGISTERS)).toEqual(rowShown(row))
}

async function waitForDialogClosed(page: Page) {
  await expect(page.locator(`${DIALOG} form`)).toHaveCount(0)
}

test.afterEach(({ page }) => {
  expect(pageErrors(page)).toEqual([])
})

for (const condition of CONDITIONS) {
  test.describe(`RLCrud, ${condition.title}`, () => {
    test('add dialog: what is typed is what gets saved', async ({ page }) => {
      await open(page, condition)
      await openAdd(page, condition)
      await focusField(page, 'name', DIALOG)
      // name, description, code, code_upper (filled by the side effect of code), then registers
      await typeSequence(page, ['fiber', 'a description', 'abc', '', ...typed], condition, { tabAfterLast: false })
      await dialogButton(page, 'button.add').click()

      await expect.poll(async () => (await calls(page)).add).toHaveLength(1)
      const [added] = (await calls(page)).add
      expect(pick(added, ['name', 'description', 'code', 'code_upper', 'enabled', ...REGISTERS])).toEqual({
        name: 'fiber',
        description: 'a description',
        code: 'abc',
        code_upper: 'ABC',
        enabled: true,
        ...typedNumbers
      })
      expect(await clobbers(page)).toEqual([])
    })

    test('edit dialog: retyped registers are saved, the rest is untouched', async ({ page }) => {
      await open(page, condition)
      await openEdit(page, 2, condition)
      await focusField(page, 'reg_01', DIALOG)
      await typeSequence(page, typed, condition, { tabAfterLast: false, selectAll: true })
      await dialogButton(page, 'button.edit').click()

      await expect.poll(async () => (await calls(page)).edit).toHaveLength(1)
      const [edited] = (await calls(page)).edit
      expect(pick(edited, ['id', 'name', 'description', 'code', 'edge', ...REGISTERS])).toEqual({
        id: 2,
        name: 'fiber-2',
        description: 'stored description',
        code: 'abc',
        edge: 'edge-1',
        ...typedNumbers
      })
      expect(await clobbers(page)).toEqual([])
    })

    test('edit dialog: text left in a field does not leak into the next dialog', async ({ page }) => {
      await open(page, condition)
      await openEdit(page, 1, condition)
      await focusField(page, 'reg_01', DIALOG)
      await typeSequence(page, ['7777', '8888', '99'], condition, { tabAfterLast: false })
      await page.keyboard.press('Escape')
      await waitForDialogClosed(page)

      await openEdit(page, 3, condition)
      await dialogButton(page, 'button.cancel').click()
      await waitForDialogClosed(page)

      // The cancelled edit of row 1 has left nothing behind
      await openEdit(page, 1, condition)
      await dialogButton(page, 'button.cancel').click()
      await waitForDialogClosed(page)

      await openAdd(page, condition)
      const shown = await shownValues(page, DIALOG)
      expect(Object.values(shown).filter(Boolean)).toEqual([])
      expect((await calls(page)).edit).toEqual([])
    })

    test('add dialog: a second add starts from an empty form', async ({ page }) => {
      await open(page, condition)
      await openAdd(page, condition)
      await focusField(page, 'name', DIALOG)
      await typeSequence(page, ['first'], condition)
      await focusField(page, 'reg_01', DIALOG)
      await typeSequence(page, typed.slice(0, 3), condition, { tabAfterLast: false })
      await dialogButton(page, 'button.add').click()
      await waitForDialogClosed(page)

      await openAdd(page, condition)
      expect(Object.values(await shownValues(page, DIALOG)).filter(Boolean)).toEqual([])
      await focusField(page, 'name', DIALOG)
      await typeSequence(page, ['second'], condition)
      await focusField(page, 'reg_02', DIALOG)
      await typeSequence(page, ['42'], condition, { tabAfterLast: false })
      await dialogButton(page, 'button.add').click()

      await expect.poll(async () => (await calls(page)).add).toHaveLength(2)
      const [first, second] = (await calls(page)).add
      expect(pick(first, ['name', 'reg_01', 'reg_02', 'reg_03'])).toEqual({
        name: 'first',
        reg_01: 5000,
        reg_02: 5001,
        reg_03: 5002
      })
      expect(pick(second, ['name', 'reg_01', 'reg_02', 'reg_03'])).toEqual({
        name: 'second',
        reg_01: undefined,
        reg_02: 42,
        reg_03: undefined
      })
    })

    test('filters: typed filters are kept and applied', async ({ page }) => {
      await open(page, condition)
      await page.locator(`${FILTERS} [slot="summary"]`).click()
      await expect(page.locator(`${FILTERS}[open]`)).toBeVisible()
      await focusField(page, 'name', FILTERS)
      await typeSequence(page, ['fib', 'desc', '10', '20'], condition)
      await settle(page, condition)

      expect(await shownValues(page, FILTERS)).toEqual({ name: 'fib', description: 'desc', reg_from: '10', reg_to: '20' })
      expect(await clobbers(page)).toEqual([])

      await page.locator(`${FILTERS} sl-button`, { hasText: 'button.apply' }).click()
      await expect
        .poll(async () => (await calls(page)).filters.at(-1))
        .toEqual({ name: 'fib', description: 'desc', reg_from: 10, reg_to: 20 })
    })

    test('filters: apply clicked right after the last key, without leaving the field', async ({ page }) => {
      await open(page, condition)
      await page.locator(`${FILTERS} [slot="summary"]`).click()
      await expect(page.locator(`${FILTERS}[open]`)).toBeVisible()
      await focusField(page, 'name', FILTERS)
      await typeSequence(page, ['fib', 'desc', '10', '20'], condition, { tabAfterLast: false })
      await page.locator(`${FILTERS} sl-button`, { hasText: 'button.apply' }).click()

      await expect
        .poll(async () => (await calls(page)).filters.at(-1))
        .toEqual({ name: 'fib', description: 'desc', reg_from: 10, reg_to: 20 })
      expect(await clobbers(page)).toEqual([])
    })

    test('filters: Enter in the last field applies what was typed', async ({ page }) => {
      await open(page, condition)
      await page.locator(`${FILTERS} [slot="summary"]`).click()
      await expect(page.locator(`${FILTERS}[open]`)).toBeVisible()
      await focusField(page, 'name', FILTERS)
      await typeSequence(page, ['fib', 'desc', '10', '20'], condition, { tabAfterLast: false })
      await page.keyboard.press('Enter')

      await expect
        .poll(async () => (await calls(page)).filters.at(-1))
        .toEqual({ name: 'fib', description: 'desc', reg_from: 10, reg_to: 20 })
      expect(await clobbers(page)).toEqual([])
    })

    test('filters: reset empties the fields, including the one being typed', async ({ page }) => {
      await open(page, condition)
      await page.locator(`${FILTERS} [slot="summary"]`).click()
      await expect(page.locator(`${FILTERS}[open]`)).toBeVisible()
      await focusField(page, 'name', FILTERS)
      await typeSequence(page, ['fib', 'desc', '10', '20'], condition, { tabAfterLast: false })
      await page.locator(`${FILTERS} sl-button`, { hasText: 'button.reset' }).click()
      await settle(page, condition)

      expect(await shownValues(page, FILTERS)).toEqual({ name: '', description: '', reg_from: '', reg_to: '' })
      expect((await calls(page)).filters.at(-1)).toEqual({})

      // The fields are usable again after the reset
      await focusField(page, 'name', FILTERS)
      await typeSequence(page, ['again', 'more'], condition)
      await settle(page, condition)
      expect(pick(await shownValues(page, FILTERS), ['name', 'description'])).toEqual({
        name: 'again',
        description: 'more'
      })
    })
  })
}
