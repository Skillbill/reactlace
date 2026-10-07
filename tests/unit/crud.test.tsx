import { createRef } from 'react'
import { expect, test, vi } from 'vitest'
import { act, render, waitFor } from '@testing-library/react'
import { RLCrud, type RLCrudProps, type RLCrudRef } from '../../src/components/RLCrud'
import { commit, textField, typeText } from './helpers'

type Page = Awaited<ReturnType<RLCrudProps['getItems']>>

const pageOf = (names: string[]): Page => ({
  result: names.map((name, i) => ({ id: i + 1, name })),
  page: { totalRows: names.length }
}) as Page

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((r) => {
    resolve = r
  })
  return { promise, resolve }
}

function renderCrud(getItems: RLCrudProps['getItems'], extra: Partial<RLCrudProps> = {}) {
  const ref = createRef<RLCrudRef>()
  const view = render(
    <RLCrud
      ref={ref}
      id="fibers"
      primary_key="id"
      singular_label="fiber"
      headers={[{ i18n_key: 'header.name', value: 'name' }]}
      filters={[]}
      form_fields={[{ i18n_key: 'name', value: 'name', input_type: 'text' }]}
      actions={[]}
      getItems={getItems}
      {...extra}
    />
  )
  return { ...view, ref }
}

const rows = (container: HTMLElement) =>
  [...container.querySelectorAll('tbody tr td')].map((cell) => cell.textContent).filter(Boolean)

test('RLCrud shows the answer of the latest request, not the one arriving last', async () => {
  const answers = [deferred<Page>(), deferred<Page>(), deferred<Page>()]
  let call = 0
  const getItems = vi.fn(() => answers[call++].promise)
  const onFetchError = vi.fn()
  const { container, ref } = renderCrud(getItems, { onFetchError })

  await act(async () => {
    answers[0].resolve(pageOf(['first']))
  })
  expect(rows(container)).toContain('first')

  act(() => {
    void ref.current!.fetchData()
    void ref.current!.fetchData()
  })
  await act(async () => {
    answers[2].resolve(pageOf(['latest']))
  })
  await act(async () => {
    answers[1].resolve(undefined as unknown as Page)
  })

  expect(rows(container)).toContain('latest')
  expect(rows(container)).not.toContain('first')
  expect(onFetchError).not.toHaveBeenCalled()
})

test('RLCrud reopened right after closing shows a new, working form', async () => {
  const getItems = vi.fn(async () => pageOf(['one']))
  const { container } = renderCrud(getItems)
  await waitFor(() => expect(rows(container)).toContain('one'))

  const button = (label: string) =>
    [...container.querySelectorAll('sl-button')].find((b) => b.textContent?.includes(label)) as HTMLElement

  act(() => button('button.add_fiber').click())
  const first = await textField(container, 'name')
  act(() => {
    typeText(first, 'left behind')
    commit(first)
  })
  act(() => button('button.cancel').click())
  // Opened again before the 300 ms after which a closed dialog drops its form
  act(() => button('button.add_fiber').click())
  await act(() => new Promise((r) => setTimeout(r, 400)))

  expect(container.querySelector('form')).not.toBeNull()
  expect((await textField(container, 'name')).value).toBe('')
})
