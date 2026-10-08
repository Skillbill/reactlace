import { expect, test, type Page } from '@playwright/test'
import {
  CONDITIONS,
  RACY_CONDITIONS,
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

const open = (page: Page, condition: Condition, extra = '') =>
  openHarness(page, `scenario=inputs${extra}`, condition, 'sl-textarea')

const model = async (page: Page) => JSON.parse((await page.getByTestId('model').textContent()) ?? '{}')

// Standalone inputs held by a plain useState: a commit renders the parent
// before its event returns, every other render is asynchronous
test.afterEach(({ page }) => {
  expect(pageErrors(page)).toEqual([])
})

for (const condition of CONDITIONS) {
  test.describe(`Standalone inputs, ${condition.title}`, () => {
    test('fields typed in sequence keep what was typed', async ({ page }) => {
      await open(page, condition)
      await focusField(page, 'text')
      // text, upper (uppercased by its parent), rejected (its parent ignores
      // changes), uncontrolled (skipped), number, clamped, area
      await typeSequence(page, ['hello', 'abc', 'x', '', '2000', '70', 'two words'], condition)
      await settle(page, condition)

      const expected = { text: 'hello', upper: 'ABC', rejected: 'locked', number: 2000, clamped: 70, area: 'two words' }
      expect(await model(page)).toEqual(expected)
      expect(pick(await shownValues(page), Object.keys(expected))).toEqual({
        text: 'hello',
        upper: 'ABC',
        rejected: 'locked',
        number: '2000',
        clamped: '70',
        area: 'two words'
      })
      expect(await clobbers(page)).toEqual([])
    })

    test('a click on save right after typing saves what was typed', async ({ page }) => {
      await open(page, condition)
      for (const [name, text] of [['text', 'hello'], ['number', '2001'], ['area', 'two words']]) {
        await focusField(page, name)
        await typeSequence(page, [text], condition, { tabAfterLast: false })
        // No Tab: the click on save is what leaves the field and commits it
        await page.getByTestId('save').click()
        await settle(page, condition)
      }

      expect(await page.evaluate(() => window.__saved)).toEqual([
        { text: 'hello', number: null, area: '' },
        { text: 'hello', number: 2001, area: '' },
        { text: 'hello', number: 2001, area: 'two words' }
      ])
    })

    test('Enter commits and typing can go on in the same field', async ({ page }) => {
      await open(page, condition)
      await focusField(page, 'text')
      await typeSequence(page, ['abc'], condition, { tabAfterLast: false })
      await page.keyboard.press('Enter')
      await pause(page, condition)
      await typeSequence(page, ['def'], condition, { tabAfterLast: false })
      await settle(page, condition)

      expect((await shownValues(page)).text).toBe('abcdef')
      expect((await model(page)).text).toBe('abc')
      expect(await clobbers(page)).toEqual([])

      await page.keyboard.press('Tab')
      await expect.poll(async () => (await model(page)).text).toBe('abcdef')
      expect((await shownValues(page)).text).toBe('abcdef')
    })

    test('values set from outside reach the fields, also over text being typed', async ({ page }) => {
      await open(page, condition)
      await page.getByTestId('set').click()
      await expect
        .poll(async () => pick(await shownValues(page), ['text', 'upper', 'number', 'clamped', 'area']))
        .toEqual({ text: 'preset', upper: 'PRESET', number: '42', clamped: '7', area: 'preset area' })

      // Typed and committed, then set again from outside
      await focusField(page, 'text')
      await typeSequence(page, ['mine'], condition)
      await settle(page, condition)
      expect((await model(page)).text).toBe('mine')
      await page.getByTestId('set').click()
      await expect.poll(async () => (await shownValues(page)).text).toBe('preset')

      // Typed and still in the field when the reset comes
      await focusField(page, 'number')
      await typeSequence(page, ['777'], condition, { tabAfterLast: false })
      await page.getByTestId('reset').click()
      await expect
        .poll(async () => pick(await shownValues(page), ['text', 'upper', 'number', 'clamped', 'area']))
        .toEqual({ text: '', upper: '', number: '', clamped: '', area: '' })
      expect(await model(page)).toEqual({ text: '', upper: '', rejected: 'locked', number: null, clamped: null, area: '' })

      await page.getByTestId('set').click()
      await expect
        .poll(async () => pick(await shownValues(page), ['text', 'number', 'area']))
        .toEqual({ text: 'preset', number: '42', area: 'preset area' })
    })

    test('a number out of range shows the value it was brought to', async ({ page }) => {
      await open(page, condition)
      await focusField(page, 'clamped')
      await typeSequence(page, ['500'], condition)
      await settle(page, condition)
      expect((await shownValues(page)).clamped).toBe('100')
      expect((await model(page)).clamped).toBe(100)

      // Out of range again: the model does not change, the field still has to
      await focusField(page, 'clamped')
      await typeSequence(page, ['900'], condition)
      await settle(page, condition)
      expect((await shownValues(page)).clamped).toBe('100')
      expect((await model(page)).clamped).toBe(100)

      await focusField(page, 'clamped')
      await typeSequence(page, ['-5'], condition)
      await settle(page, condition)
      expect((await shownValues(page)).clamped).toBe('0')
      expect((await model(page)).clamped).toBe(0)
    })

    test('the clear button empties the field and the model', async ({ page }) => {
      await open(page, condition)
      await focusField(page, 'text')
      await typeSequence(page, ['hello'], condition)
      await focusField(page, 'number')
      await typeSequence(page, ['42'], condition)
      await settle(page, condition)
      expect(pick(await model(page), ['text', 'number'])).toEqual({ text: 'hello', number: 42 })

      for (const index of [0, 0]) {
        await page.locator('sl-input [part~="clear-button"]').nth(index).click()
        await pause(page, condition)
      }
      await settle(page, condition)

      expect(pick(await model(page), ['text', 'number'])).toEqual({ text: '', number: null })
      expect(pick(await shownValues(page), ['text', 'number'])).toEqual({ text: '', number: '' })

      // Cleared fields take new text
      await focusField(page, 'text')
      await typeSequence(page, ['again', '', '', '', '7'], condition)
      await settle(page, condition)
      expect(pick(await model(page), ['text', 'number'])).toEqual({ text: 'again', number: 7 })
      expect(pick(await shownValues(page), ['text', 'number'])).toEqual({ text: 'again', number: '7' })
    })
  })
}

for (const condition of RACY_CONDITIONS) {
  test.describe(`Standalone inputs with other renders going on, ${condition.title}`, () => {
    for (const strict of ['', '&strict=1']) {
      test(`renders from the parent do not touch the field being typed${strict && ', StrictMode'}`, async ({ page }) => {
        await open(page, condition, `&tick=15${strict}`)
        await focusField(page, 'text')
        // Slow enough for several renders to land inside each field
        await typeSequence(page, ['hello world', 'abcdef', '', '', '123456', '55', 'some more text'], {
          ...condition,
          keyDelay: Math.max(condition.keyDelay, 40)
        })
        await settle(page, condition)

        expect(pick(await shownValues(page), ['text', 'upper', 'number', 'clamped', 'area'])).toEqual({
          text: 'hello world',
          upper: 'ABCDEF',
          number: '123456',
          clamped: '55',
          area: 'some more text'
        })
        expect(await clobbers(page)).toEqual([])
        expect(Number(await page.locator('[data-tick]').getAttribute('data-tick'))).toBeGreaterThan(5)
      })
    }

    test('a change the parent ignores is taken back at the next render', async ({ page }) => {
      await open(page, condition, '&tick=15')
      await focusField(page, 'rejected')
      await typeSequence(page, ['other'], condition)
      await settle(page, condition)

      expect((await shownValues(page)).rejected).toBe('locked')
    })
  })
}
