import { expect, test, type Page } from '@playwright/test'
import {
  CONDITIONS,
  RACY_CONDITIONS,
  REGISTERS,
  clobbers,
  focusField,
  openHarness,
  pageErrors,
  pause,
  pick,
  settle,
  shownValues,
  typeSequence,
  type Condition
} from './helpers'

const typed = REGISTERS.map((_, i) => String(2000 + i))
const typedNumbers = Object.fromEntries(REGISTERS.map((key, i) => [key, 2000 + i]))
const typedShown = Object.fromEntries(REGISTERS.map((key, i) => [key, String(2000 + i)]))
const stored = Object.fromEntries(REGISTERS.map((key, i) => [key, 1000 + i]))

const open = (page: Page, type: 'add' | 'edit', condition: Condition, extra = '') =>
  openHarness(page, `scenario=form&type=${type}${extra}`, condition, 'sl-checkbox')

const confirm = (page: Page) => page.locator('sl-button', { hasText: 'Confirm' }).click()

const confirmed = (page: Page) => page.evaluate(() => window.__confirmed)

async function expectConfirmed(page: Page, expected: Record<string, unknown>) {
  await expect.poll(() => confirmed(page)).toHaveLength(1)
  const [data] = await confirmed(page)
  expect(pick(data, Object.keys(expected))).toEqual(expected)
}

test.afterEach(({ page }) => {
  expect(pageErrors(page)).toEqual([])
})

for (const condition of CONDITIONS) {
  test.describe(`RLCrudForm, ${condition.title}`, () => {
    test('add: registers typed in sequence are all kept', async ({ page }) => {
      await open(page, 'add', condition)
      await focusField(page, 'reg_01')
      await typeSequence(page, typed, condition)
      await settle(page, condition)

      expect.soft(pick(await shownValues(page), REGISTERS)).toEqual(typedShown)
      expect(await clobbers(page)).toEqual([])

      await focusField(page, 'name')
      await typeSequence(page, ['fiber'], condition)
      await confirm(page)
      await expectConfirmed(page, { name: 'fiber', ...typedNumbers })
    })

    test('edit: retyped registers replace the stored ones', async ({ page }) => {
      await open(page, 'edit', condition)
      await expect.poll(async () => pick(await shownValues(page), REGISTERS)).toEqual(
        Object.fromEntries(REGISTERS.map((key, i) => [key, String(1000 + i)]))
      )

      await focusField(page, 'reg_01')
      await typeSequence(page, typed, condition)
      await settle(page, condition)

      expect.soft(pick(await shownValues(page), REGISTERS)).toEqual(typedShown)
      expect(await clobbers(page)).toEqual([])

      await confirm(page)
      await expectConfirmed(page, { id: 7, name: 'fiber-7', description: 'stored description', ...typedNumbers })
    })

    test('add: confirm clicked right after the last key, without leaving the field', async ({ page }) => {
      await open(page, 'add', condition)
      await focusField(page, 'name')
      await typeSequence(page, ['fiber'], condition)
      await focusField(page, 'reg_01')
      await typeSequence(page, typed, condition, { tabAfterLast: false })
      await confirm(page)

      await expectConfirmed(page, { name: 'fiber', ...typedNumbers })
    })

    test('edit: confirm clicked right after the last key, without leaving the field', async ({ page }) => {
      await open(page, 'edit', condition)
      await focusField(page, 'reg_01')
      await typeSequence(page, typed, condition, { tabAfterLast: false })
      await confirm(page)

      await expectConfirmed(page, typedNumbers)
    })

    test('add: Enter in the last field submits what was typed', async ({ page }) => {
      await open(page, 'add', condition)
      await focusField(page, 'name')
      await typeSequence(page, ['fiber'], condition)
      await focusField(page, 'reg_01')
      await typeSequence(page, typed.slice(0, 4), condition, { tabAfterLast: false })
      await page.keyboard.press('Enter')

      await expectConfirmed(page, { name: 'fiber', ...pick(typedNumbers, REGISTERS.slice(0, 4)) })
    })

    test('add: text, textarea and number fields in one run', async ({ page }) => {
      await open(page, 'add', condition)
      await focusField(page, 'name')
      // name, description, code, code_upper (filled by the side effect of code), then registers
      await typeSequence(page, ['fiber one', 'first line', 'abc', '', '2000', '2001', '2002'], condition)
      await settle(page, condition)

      const shown = await shownValues(page)
      expect(pick(shown, ['name', 'description', 'code', 'code_upper', 'reg_01', 'reg_02', 'reg_03'])).toEqual({
        name: 'fiber one',
        description: 'first line',
        code: 'abc',
        code_upper: 'ABC',
        reg_01: '2000',
        reg_02: '2001',
        reg_03: '2002'
      })

      await confirm(page)
      await expectConfirmed(page, {
        name: 'fiber one',
        description: 'first line',
        code: 'abc',
        code_upper: 'ABC',
        reg_01: 2000,
        reg_02: 2001,
        reg_03: 2002
      })
    })

    test('add: going back with Shift+Tab and typing on appends to the field', async ({ page }) => {
      await open(page, 'add', condition)
      await focusField(page, 'reg_01')
      await typeSequence(page, ['2000'], condition)
      await page.keyboard.press('Shift+Tab')
      await pause(page, condition)
      // Tab focus selects the content: move to its end before typing on
      await page.keyboard.press('End')
      await typeSequence(page, ['5', '2001'], condition)
      await settle(page, condition)

      expect(pick(await shownValues(page), ['reg_01', 'reg_02'])).toEqual({ reg_01: '20005', reg_02: '2001' })
      expect(await clobbers(page)).toEqual([])
    })

    test('edit: untouched fields keep the stored values', async ({ page }) => {
      await open(page, 'edit', condition)
      await focusField(page, 'reg_03')
      await typeSequence(page, ['3333', '4444'], condition)
      await settle(page, condition)
      await confirm(page)

      await expectConfirmed(page, { ...stored, reg_03: 3333, reg_04: 4444, code: 'abc', code_upper: 'ABC' })
    })

    test('edit: an emptied register is saved as empty', async ({ page }) => {
      await open(page, 'edit', condition)
      await focusField(page, 'reg_01')
      await page.keyboard.press('Delete')
      await page.keyboard.press('Tab')
      await pause(page, condition)
      await typeSequence(page, ['2001'], condition)
      await settle(page, condition)

      expect(pick(await shownValues(page), ['reg_01', 'reg_02'])).toEqual({ reg_01: '', reg_02: '2001' })
      await confirm(page)
      await expectConfirmed(page, { reg_01: null, reg_02: 2001, reg_03: 1002 })
    })

    test('add: numbers are normalized once the field is left', async ({ page }) => {
      await open(page, 'add', condition)
      await focusField(page, 'reg_01')
      await typeSequence(page, ['0012', '1.50', '2002'], condition)
      await settle(page, condition)

      expect(pick(await shownValues(page), ['reg_01', 'reg_02', 'reg_03'])).toEqual({
        reg_01: '12',
        reg_02: '1.5',
        reg_03: '2002'
      })
    })

    test('add: a missing required field blocks the confirm and shows the error', async ({ page }) => {
      await open(page, 'add', condition)
      await focusField(page, 'reg_01')
      await typeSequence(page, typed.slice(0, 3), condition)
      await confirm(page)
      // The native constraint validation of the required field stops the submit
      await expect(page.locator('sl-input[data-user-invalid]')).toHaveCount(1)
      expect(await confirmed(page)).toEqual([])
      expect(pick(await shownValues(page), REGISTERS.slice(0, 3))).toEqual(pick(typedShown, REGISTERS.slice(0, 3)))

      await focusField(page, 'name')
      await typeSequence(page, ['fiber'], condition)
      await confirm(page)
      await expectConfirmed(page, { name: 'fiber', ...pick(typedNumbers, REGISTERS.slice(0, 3)), enabled: true })
    })

    test('add: select and checkbox changes do not disturb the typed fields', async ({ page }) => {
      await open(page, 'add', condition)
      await focusField(page, 'name')
      await typeSequence(page, ['fiber', 'notes'], condition)
      await page.locator('sl-select').click()
      await page.locator('sl-option', { hasText: 'Edge 2' }).click()
      await pause(page, condition)
      await focusField(page, 'reg_01')
      await typeSequence(page, typed.slice(0, 3), condition, { tabAfterLast: false })
      await page.locator('sl-checkbox [part~="control"]').click()
      await settle(page, condition)

      expect(pick(await shownValues(page), ['name', 'description', 'reg_01', 'reg_02', 'reg_03'])).toEqual({
        name: 'fiber',
        description: 'notes',
        reg_01: '2000',
        reg_02: '2001',
        reg_03: '2002'
      })
      await confirm(page)
      await expectConfirmed(page, {
        name: 'fiber',
        description: 'notes',
        edge: 'edge-2',
        enabled: false,
        reg_01: 2000,
        reg_02: 2001,
        reg_03: 2002
      })
    })
  })
}

for (const condition of CONDITIONS) {
  test(`RLCrudForm, ${condition.title}: fields of the other kinds commit next to typed ones`, async ({ page }) => {
    await openHarness(page, 'scenario=form&type=add&fields=kinds', condition, 'sl-textarea')
    await focusField(page, 'name')
    await typeSequence(page, ['fiber'], condition, { tabAfterLast: false })

    await page.locator('.date-input').click()
    await page
      .locator('.p-datepicker-calendar td:not(.p-datepicker-other-month) span', { hasText: /^15$/ })
      .click()
    await pause(page, condition)

    await focusField(page, 'reg_01')
    await typeSequence(page, ['2000'], condition, { tabAfterLast: false })
    await page.locator('input[name="group"]').click()
    await page.locator('li', { hasText: 'Group B' }).click()
    await pause(page, condition)

    await focusField(page, 'reg_02')
    await typeSequence(page, ['2001'], condition, { tabAfterLast: false })
    await page.locator('.p-autocomplete-input').click()
    await page.locator('.p-autocomplete-item', { hasText: 'Tag two' }).click()
    await pause(page, condition)

    await focusField(page, 'description')
    await typeSequence(page, ['some notes'], condition, { tabAfterLast: false })
    await settle(page, condition)

    expect(pick(await shownValues(page), ['name', 'reg_01', 'reg_02', 'description'])).toEqual({
      name: 'fiber',
      reg_01: '2000',
      reg_02: '2001',
      description: 'some notes'
    })
    expect((await shownValues(page)).birth).toMatch(/^15-\d{2}-\d{4}$/)
    expect(await clobbers(page)).toEqual([])

    await confirm(page)
    await expectConfirmed(page, {
      name: 'fiber',
      reg_01: 2000,
      group: 'b',
      reg_02: 2001,
      tag: 'two',
      description: 'some notes'
    })
    const [data] = await confirmed(page)
    expect((data.birth as Date).getDate()).toBe(15)
  })
}

for (const condition of RACY_CONDITIONS) {
  test.describe(`RLCrudForm with other renders going on, ${condition.title}`, () => {
    for (const type of ['add', 'edit'] as const) {
      test(`${type}: renders from the parent do not touch the field being typed`, async ({ page }) => {
        await open(page, type, condition, '&tick=15')
        await focusField(page, 'reg_01')
        // Slow enough for several renders to land inside each field
        await typeSequence(page, typed.slice(0, 6), { ...condition, keyDelay: Math.max(condition.keyDelay, 40) })
        await settle(page, condition)

        expect(pick(await shownValues(page), REGISTERS.slice(0, 6))).toEqual(pick(typedShown, REGISTERS.slice(0, 6)))
        expect(await clobbers(page)).toEqual([])
        expect(Number(await page.locator('[data-tick]').getAttribute('data-tick'))).toBeGreaterThan(5)
      })

      test(`${type}: StrictMode`, async ({ page }) => {
        await open(page, type, condition, '&strict=1')
        await focusField(page, 'reg_01')
        await typeSequence(page, typed, condition)
        await settle(page, condition)

        expect(pick(await shownValues(page), REGISTERS)).toEqual(typedShown)
        expect(await clobbers(page)).toEqual([])
      })
    }
  })
}
